import React from 'react';
import './App.css';
import {Button, Card, Container, Image, Modal, Navbar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import Recorder from 'recorder-js';

import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import {mean} from "mathjs";
import Loading from 'react-fullscreen-loading';

import createBuffer from "audio-buffer-from"

import Despiker from "./Despiker";
import Denoiser from "./Denoiser";

import bufferToWav from 'audiobuffer-to-wav';

import { resample } from 'wave-resampler';

const MODEL_R_PATH = '/models/recognition/model.json';
const MODEL_S_PATH = '/models/segmentation/model.json';


// Info
// Press button and allow the use of microphone to start sound recognition
// Place the phone on the skin of chest, move around to locate the best position
// Use of microphone is not allowed, heart sound can't be recognised or recorded
// Heartbeat is recognised, hold still for 10 seconds to complete the recording
// test push
class App extends React.Component {

    constructor(props) {
        super(props);
        this.audioData = null;
        this.state = {
            heartState: 0,
            information: 'Press Button and allow the use of microphone to start sound recognition',
            audio: null,
            startButtonText: 'Heartbeat is not detected',
            badMic: false,
            loading: false,
            modalShow: false,
            unPermitted: false,
        };
        this.timer = null;
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.audioContext = null;
        this.heartDetectArray = null;
        this.modelR = null;
        this.modelS = null;
        this.prediction = null;
        this.gumStream = null;
        this.gumStream2 = null;

        // initial timer for no recognition
        this.initTimer = 0;
        this.timerFunc = null;
        this.timeleft = 0;
        // if numOfHeartSound > 1, switch to Stage 2, and set numOfNoise to 0
        // if numOfNoise > 1, switch to Stage 1, and set numOfHeartSound to 0
        // if captureTimer > 9, switch to Stage 3, and set numOfNoise and numOfHeartSound to 0
        // As long as in the Stage 2, captureTimer + 1 per second

        this.numOfHeartSound = 0;
        this.numOfNoise = 0;
        this.captureTimer = 0;

        this.downloadUrl = null;
        this.recorder2Flag = true;
        this.audioBlob = null;
       // 2nd recording
       this.old_audioBlob = null;
       this.old_downloadUrl = null;

        this.chart_options = {
            stroke: {
                curve: 'smooth',
                width: 1.3,
            },
            colors: ['#B03A2E'],
            tooltip: {
                enabled: false,
            },
            chart: {
                sparkline: {
                    enabled: true
                },
                id: "heartVis",
            },
            grid: {
                column: {
                    colors: [],
                    opacity: 0.6,
                }
            },
        };

        this.chart_series = [{}];
        this.old_chart_series = [{}];

        this.csvData = [];
        this.old_csvData = [];  

        this.segBGColor = {
            0: '#375E97',
            1: '#FB6542',
            2: '#FFBB00',
            3: '#3F681C'
        };

        this.heartRate = 0;

        this.audioDom = null;

        this.hsRecording = [];
        this.hsBlobs = [];

        //second recording
        this.old_audioDom = null;
    };


    async componentDidMount() {
        console.log('component did mount');
        this.modelR = await tf.loadLayersModel(MODEL_R_PATH);
        this.modelS = await tf.loadLayersModel(MODEL_S_PATH);
    }


    async countdown(){
        console.log('init the mic, keep listening to detect heart sound || Stage 0 => 1');
        this.audioContext =  new (window.AudioContext || window.webkitAudioContext)();

        this.audioDom = document.createElement('audio');
        this.old_audioDom =  document.createElement('audio');

        let source = this.audioContext.createMediaElementSource(this.audioDom);
        let gainNode = this.audioContext.createGain();
        gainNode.gain.value = 10;//4; // double the volume
        source.connect(gainNode);
        // connect the gain node to an output destination
        gainNode.connect(this.audioContext.destination);

        // This recorder is for heart sound recognition
        this.recorder = new Recorder(this.audioContext, {
            numChannels:1
        });

        // This recorder is for heart sound segmentation
        this.recorder2 = new Recorder(this.audioContext, {
            numChannels:1
        });

        let that = this;

        // TODO failure handle here
        await navigator.mediaDevices.getUserMedia({audio: true})
            .then(
                function(stream) {
                    that.recorder.init(stream);
                    that.gumStream = stream;

                    that.recorder2.init(stream);
                    that.gumStream2 = stream;
                }
            )
            .catch(err => {
                    console.log('Uh oh... unable to get stream...', err);
                    that.setState({
                        unPermitted: true
                    })
                }
            )
        if (!this.state.unPermitted) {
            this.initMic();
            // uncomment to enable the countdown
        //     this.timeleft = 5;
        //     // setting heartState to 1 so that it change the color and text of the start button
        //     this.setState({
                
        //         heartState: 1, 
        //         startButtonText: 'Please Wait a moment'
                    
        //     });
        //     this.initTimer = 0;
        //     this.timeleft = 5;

        //     this.timerFunc = setInterval(() => {
        //         this.setState({
        //             startButtonText: 'Recording will start in ' + (this.timeleft - this.initTimer) + ' seconds'
        //         });
        //         this.update();
        //         }, 1000)
        }
        else{
            this.setState({
                information: 'Use of microphone is not allowed, heart sound can\'t be recognised or recorded',
                unPermitted: false,
            });
        }
    }

    async update(){
        console.log("time left: " +( this.timeleft - this.initTimer));
        this.initTimer += 1;
        if(this.initTimer>5){
            clearInterval(this.timerFunc);

            // after finish with the timer, start recording
            this.initMic();
        }
        
    }

   

    // This function initialise recorder for heart sound recognition
    async initMic() {
        await this.startListening().then(
            this.timer = setInterval( () =>
                this.pauseAndStartListening(), 1000 )
        )

        this.setState({
            heartState: 1,
            information: 'Place the phone on the skin of chest, move around to locate the best position'
        });

    }
    // end of initMic function

    async startListening() {
        await this.recorder.start();
    }

    // heartState = 1 (black, listening)
    async pauseAndStartListening() {
        await this.recorder.stop()
            .then(({blob, buffer}) => {

                const downSampledArray = this.downSample(tf.buffer([buffer[0].length], 'float32', buffer[0]).toTensor().arraySync(), 1000);
                this.heartDetectArray = this.cropAndPad(downSampledArray);
                
                // recognition result (remove this part)
                this.prediction = this.doPrediction(this.heartDetectArray);

                // The threshol d can be tuned
                let threshold_ = 0.5;
                if (this.prediction.arraySync()[0] > threshold_) {
                // changed part so that the recognition part is not used
                //if (true){
                    this.numOfNoise = 0;
                    //skipping noise recognition part
                    if (this.numOfHeartSound >= 0) {
                        this.startRecording();
                    } else {
                        this.numOfHeartSound = this.numOfHeartSound + 1;
                    }
                }
                else {
                    this.numOfHeartSound = 0;

                    if (this.numOfNoise >= 1) {
                        this.recorder2Flag = true;
                        this.captureTimer = 0;

                        // Clear the recording array
                        this.hsRecording = [];
                        this.hsBlobs = [];

                        if (this.state.badMic === false) {
                            this.setState({
                                heartState: 1,
                                startButtonText: 'Heartbeat is not detected',
                                information: 'Place the phone on the skin of chest, move around to locate the best position'
                            });
                        }

                    } else {
                        this.numOfNoise = this.numOfNoise + 1;
                    }
                }


                if (this.captureTimer > 10) {
                    this.recorder2Flag = true;
                    this.stopRecording();
                
                
                } else if (this.state.heartState === 2) {
                    this.setState({
                        startButtonText: 'Hold for ' + (10 - this.captureTimer) + ' seconds'
                    });
                    
                    this.captureTimer = this.captureTimer + 1;

                    this.hsRecording.push(...this.heartDetectArray);
                    this.hsBlobs.push(blob);

                    if (this.recorder2Flag) {
                        console.log('record for analysis ...');

                        // TODO tobe delete?
                        this.recorder2.start();
                        this.recorder2Flag = false;
                    }

                }

                

                console.log('1-sec signal recorded, processed and predicted.', this.prediction.arraySync()[0]);

            }).then(await this.recorder.start())
    }

    downSample(array, sr) {
        const sampleRate = this.audioContext.sampleRate;
        const mod = Math.round( sampleRate / sr );
        let result = [];
        for (let i = 0; i < array.length; i++) {
            if ( (i % mod) === 0 ) {
                result.push(array[i])
            }
        }
        return result
    }

    averageDownSample(array, oldSr = this.audioContext.sampleRate, sr) {
        const sampleRate = oldSr;
        const mod = Math.round( sampleRate / sr );
        let result = [];
        for (let i = 0; i < array.length; i++) {
            if ( (i % mod) === 0 && ( i+mod ) < array.length ) {
                result.push(mean(array.slice(i, (i+mod))))
            }
        }
        return result
    }

    cropAndPad(array, sr = 1000) {
        if (array.length === sr) {
            return array
        } else if (array.length < sr) {

            while(array.length < sr) array.push(0);
            return array

        } else {
            return array.slice(0, sr)
        }
    }

    doPrediction(tensor) {

        const min = Math.min(...tensor);
        const max = Math.max(...tensor);

        if (min === 0 && max === 0) {
            console.log('The mic is not available, no sound recorded');
            this.setState({
                startButtonText: 'The microphone is not available, please reload the app',
                badMic: true,
            });
            return tf.tensor([0]);
        } else {
            let standardTensor = this.minmaxScale(tensor);
            standardTensor = tf.tensor(standardTensor);
            standardTensor = standardTensor.reshape([1, standardTensor.shape[0], 1]);
            const output = this.modelR.predict(standardTensor);
            output.print();
            return output;
        }
    }

    doStandardization(tensor) {
        const matrix = tensor.transpose().arraySync();
        let newMatrix = [];
        let that = this;
        matrix.forEach(function(row) {
            const mean_ = that.calculateMean(row);
            const std_ = that.calculateStDeviation(row);
            let newRow = row.map(item => (item - mean_)/std_);

            newRow.pop();

            newMatrix.push(newRow);
        });

        return tf.tensor(newMatrix).transpose()
    }
    calculateMean(array){
        return array.reduce(function(a, b){ return a+b; })/array.length;
    }
    calculateStDeviation(array){
        let mean= this.calculateMean(array),
            dev= array.map(function(itm){return (itm-mean)*(itm-mean); });
        return Math.sqrt(dev.reduce(function(a, b){ return a+b; })/array.length);
    }

    async startRecording() {

        console.log('start recording, to get heart sound data || Stage 1 => 2');
        this.setState({
            heartState: 2,
            information: 'Heartbeat is recognised, hold still for 10 seconds to complete the recording ',
        });

        this.numOfNoise = 0;
    }

    async stopRecording() {

        this.setState({
            loading: true
        });

        await this.recorder2.stop().then(({blob, buffer}) => {
            let old_blob = blob;
            document.getElementById('audioPlayer').appendChild(this.audioDom);
            // adding second recording
            // console.log("new: "+this.audioDom);
            // console.log("OLD: "+this.old_audioDom);
            document.getElementById('old_audioPlayer').appendChild(this.old_audioDom);

            const originalArray = tf.buffer([buffer[0].length], 'float32', buffer[0]).toTensor().arraySync();
            const cropAndPadArray = this.cropAndPad(originalArray, this.audioContext.sampleRate * 10);

            // Get sound, change to wavelet
            let denoiser = new Denoiser(cropAndPadArray);
            // resample to two sound (high, low)
            const denoised = denoiser.dwtDenoise();

            // despiker algo
            let despiker = new Despiker(denoised[0]);
            const despiked = despiker.despike();

            let upsampled = resample(despiked, 10000, this.audioContext.sampleRate, {method: "sinc"});

            let audioBuffer = createBuffer(upsampled, { sampleRate: this.audioContext.sampleRate });

            // TODO bug => last 2 seconds?
            let wav = bufferToWav(audioBuffer);
            let newblob = new window.Blob([ new DataView(wav) ], {
                type: 'audio/wav'
            });

            // let old_upsampled = resample(cropAndPadArray, 10000, this.audioContext.sampleRate, {method: "sinc"});
            // let old_wav = bufferToWav(old_upsampled)
            // let old_newblob = new window.Blob([ new DataView(old_wav) ], {
            //     type: 'audio/wav'
            // }); 

            const downSampledArrayForVis = denoised[1];

            const despiked_dup = [...despiked];
            while(despiked_dup.length) this.csvData.push(despiked_dup.splice(0,100000));

            // audio chart
            this.chart_series = [{data: this.minmaxScale(downSampledArrayForVis)}];
            //this.old_chart_series = null;

            // create download url for old recording
            this.old_downloadUrl = URL.createObjectURL(old_blob);
            this.old_audioBlob = old_blob;

            this.old_audioDom.controls = true;
            this.old_audioDom.src = URL.createObjectURL(old_blob);


            blob = newblob;

            this.downloadUrl = URL.createObjectURL(blob);
            this.audioBlob = blob;

            this.audioDom.controls = true;
            this.audioDom.src = URL.createObjectURL(blob);

        });


        this.gumStream.getAudioTracks()[0].stop();
        this.gumStream2.getAudioTracks()[0].stop();

        clearInterval(this.timer);
        this.numOfHeartSound = 0;
        this.numOfNoise = 0;
        this.captureTimer = 0;

        console.log('check the length: ',this.hsRecording.length);

        console.log('stop recording, feed the recorded data to the model || Stage 2 => 3');
        this.setState({
            heartState: 3,
            // information: 'Heart Rate: '+ (this.heartRate) + ' bpm',
            information: 'Segmentation & HR Measurement is currently turned off',
            loading: false
        });
    }

    async restart() {
        document.getElementById('audioPlayer').innerHTML = '';
        document.getElementById('old_audioPlayer').innerHTML = '';
        console.log('restart the workflow || Stage 3 => 0');
        this.setState({
            heartState: 0,
            information: 'Press Button and allow the use of microphone to start sound recognition',
            startButtonText: 'Heartbeat is not detected',
        })
    }

    downloadImg() {
        ApexCharts.exec("heartVis", "dataURI").then(({ imgURI }) => {
            let imgDownloadLink = document.createElement('a')
            imgDownloadLink.href = imgURI;
            imgDownloadLink.download = 'HeartyHelper_Image';
            document.body.appendChild(imgDownloadLink)
            imgDownloadLink.click()
            document.body.removeChild(imgDownloadLink)
            window.URL.revokeObjectURL(imgURI);
        });
    }

    downloadAudio() {
        let audioDownloadLink = document.createElement('a')
        audioDownloadLink.href = this.downloadUrl;
        audioDownloadLink.download = 'HeartyHelper_Audio';
        document.body.appendChild(audioDownloadLink);
        audioDownloadLink.click();
        document.body.removeChild(audioDownloadLink);
    }

    downloadOldAudio() {
        let audioDownloadLink = document.createElement('a')
        audioDownloadLink.href = this.old_downloadUrl;
        audioDownloadLink.download = 'HeartyHelper_OriginalAudio';
        document.body.appendChild(audioDownloadLink);
        audioDownloadLink.click();
        document.body.removeChild(audioDownloadLink);
    }


    segmentHeartSound(array) {
        // Process1
        let feats = tf.abs(tf.signal.stft(tf.tensor1d(array), 80, 20, 80, tf.signal.hammingWindow)).arraySync();
        // Process2 TODO here is a bug?
        const len1 = feats.length;
        const len2 = feats[0].length;
        for (let i = 0; i < len1; i++) {
            for (let j = 0; j < len2; j++) {
                if (feats[i][j] > 0) {
                    feats[i][j] = Math.log(feats[i][j]);
                }
            }
        }
        // Process3, minmax_scale 0-1 axis=0
        let featsTrans = feats[0].map((_, colIndex) => feats.map(row => row[colIndex]))
        let scaledFeats = [];
        featsTrans.forEach(row => {
            scaledFeats.push(this.minmaxScale(row));
        });
        let scaledFeatsTrans = tf.tensor(scaledFeats[0].map((_, colIndex) => scaledFeats.map(row => row[colIndex])));

        scaledFeatsTrans = scaledFeatsTrans.reshape([1, scaledFeatsTrans.shape[0], scaledFeatsTrans.shape[1]]);

        const output = this.modelS.predict(scaledFeatsTrans).arraySync()[0];

        let bgColorList = [];
        let bgIndexList = [];
        output.forEach(seg => {
            const mIndex =seg.indexOf(Math.max(...seg));
            for (let i = 0; i < 2; i++) {
                bgColorList.push(this.segBGColor[mIndex]);
                bgIndexList.push(mIndex);
            }
        })

        if (bgColorList.length < 1000) {
            bgColorList = bgColorList.concat(Array(1000-bgColorList.length).fill(bgColorList[bgColorList.length - 1]));
        }

        if (bgIndexList.length < 1000) {
            bgIndexList = bgIndexList.concat(Array(1000-bgIndexList.length).fill(bgIndexList[bgIndexList.length - 1]));
        }

        this.chart_options.grid.column.colors = bgColorList;

        this.calculateHeartRateViaBGCL(bgIndexList);
    }

    calculateHeartRateViaBGCL( list ) {
        let count = 0;
        let startPoint = 0;
        let endPoint = 0;
        let flag = false;
        for (let i = 1; i < list.length; i++) {
            if (list[i] === 0 && list[i-1] === 3) {

                if (!flag) {
                    // Captured the first starting point
                    flag = true;
                    startPoint = i;
                } else {
                    // Captured the end point
                    count = count + 1;
                    endPoint = i-1;
                }

            }

        }
        let min = (endPoint - startPoint) / (6000);
        this.heartRate =  Math.round(count / min)
    }

    minmaxScale( row ) {
        let scaledRow = [];
        const min = Math.min(...row);
        const dif = Math.max(...row) - min;
        row.forEach(element => {
            scaledRow.push((element-min)/dif);
        })
        return scaledRow;
    }

    // This might be useful: Scale array from -1 to 1
    minmaxScaleSym( row ) {
        let scaledRow = [];
        const min = Math.min(...row);
        const dif = Math.max(...row) - min;
        row.forEach(element => {
            scaledRow.push((((element-min)/dif) - 0.5) * 2);
        })
        return scaledRow;
    }

    showHelp() {
        this.setState({
            modalShow:true
        })
    }
    closeModal() {
        this.setState({
            modalShow:false
        })
    }

    // TODO may be the reason of low resolution
    convertURIToBinary(dataURI) {
        let BASE64_MARKER = ';base64,';
        let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        let base64 = dataURI.substring(base64Index);
        let raw = window.atob(base64);
        let rawLength = raw.length;
        let arr = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            arr[i] = raw.charCodeAt(i);
        }
        return arr;
    }

    // result handling
    shareAudio() {
        let audioFile = new File([this.audioBlob], "audio.wav", {
            type: 'audio/wav',
        });
        let filesArray = [audioFile];
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            navigator.share({
                files: filesArray,
            })
                .then(() => console.log('Share was successful.'))
                .catch((error) => console.log('Sharing failed', error));
        } else {
            console.log(`Your system doesn't support sharing files.`);
        }
    }

    // for sharing original audio
    shareOldAudio() {
        let audioFile = new File([this.old_audioBlob], "original_audio.wav", {
            type: 'audio/wav',
        });
        let filesArray = [audioFile];
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            navigator.share({
                files: filesArray,
            })
                .then(() => console.log('Share was successful.'))
                .catch((error) => console.log('Sharing failed', error));
        } else {
            console.log(`Your system doesn't support sharing files.`);
        }
    }

    shareImg() {
        ApexCharts.exec("heartVis", "dataURI").then(({ imgURI }) => {
            // TODO maybe there is a bug causing low-resolution
            let imgBlob = this.convertURIToBinary(imgURI)
            let imgFile = new File([imgBlob], "img.png", {
                type: 'image/png',
            });
            let filesArray = [imgFile];
            if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                navigator.share({
                    files: filesArray,
                })
                    .then(() => console.log('Share was successful.'))
                    .catch((error) => console.log('Sharing failed', error));
            } else {
                console.log(`Your system doesn't support sharing files.`);
            }
        });
    }

    shareCSV() {
        let csvBlob = new Blob(this.csvData);
        let csvFile = new File([csvBlob], "data.csv", {
            type: 'text/csv',
        });
        let filesArray = [csvFile];
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            navigator.share({
                files: filesArray,
            })
                .then(() => console.log('Share was successful.'))
                .catch((error) => console.log('Sharing failed', error));
        } else {
            console.log(`Your system doesn't support sharing files.`);
        }
    }

    downloadCSV() {
        let csvBlob = new Blob(this.csvData);
        let csvFile = new File([csvBlob], "data.csv", {
            type: 'text/csv',
        });

        let csvDownloadLink = document.createElement('a')
        csvDownloadLink.href = URL.createObjectURL(csvFile);
        csvDownloadLink.download = 'HeartyHelper_CSV';
        document.body.appendChild(csvDownloadLink);
        csvDownloadLink.click();
        document.body.removeChild(csvDownloadLink);
    }
    // end of function declaration

    // main function
    render() {
        
        let centerImg;
        if ( this.state.heartState === 0 ) {
            centerImg = <Image className="Img" src="/images/heart-rate-white.png" width="180" height="180" rounded />;
        } else if ( this.state.heartState === 1  ) {
            centerImg = <Image className="Img" src="/images/heart-rate-black.png" width="180" height="180" rounded />;
        } else if ( this.state.heartState === 2  ) {
            centerImg = <Image className="Img" src="/images/heart-rate-red.png" width="180" height="180" rounded />;
        } else if ( this.state.heartState === 3  ) {
            centerImg = <Image className="Img" src="/images/checked.png" width="150" height="150" rounded />;
        }

        let startButton;
        if ( this.state.heartState === 0 ) {
            startButton = <Card className="CardButton" onClick={() => this.countdown()}>START</Card>;
        } else if (this.state.heartState === 3 ) {
            startButton = <Card className="CardButton" onClick={() => this.restart()}>TRY AGAIN</Card>;
        } else if (this.state.heartState === 1 || this.state.heartState === 2 ) {
            startButton =
                <Card className="Card">
                    <Card.Body>
                        {this.state.startButtonText}
                    </Card.Body>
                </Card>;
        }

        let downloadButton;
        let old_downloadButton;
        
        // this is the sharing elements
        if ( this.state.heartState === 3 ) {
            downloadButton = <div>

                <div className="ButtonGroup">
                    <Card className="CardButton BgLightB leftButton" onClick={() => this.shareAudio()}>SHARE AUDIO</Card>
                    <Card className="CardButton BgBlue rightButton" onClick={() => this.downloadAudio()}>
                        <Image src="/images/download.png" width="32" height="32"/>
                    </Card>
                </div>

                <div className="containerHorizontalScroll">
                    <Chart
                        options={this.chart_options}
                        series={this.chart_series}
                        type="line"
                        height="100"
                        width="1500"
                        id="theChart"></Chart>
                </div>

                <div className="ButtonGroup">
                    <Card className="CardButton BgLightB leftButton" onClick={() => this.shareImg()}>SHARE IMAGE</Card>
                    <Card className="CardButton BgBlue rightButton" onClick={() => this.downloadImg()}>
                        <Image src="/images/download.png" width="32" height="32"/>
                    </Card>
                </div>

                <div className="ButtonGroup">
                    <Card className="CardButton BgLightB leftButton" onClick={() => this.shareCSV()}>SHARE CSV</Card>
                    <Card className="CardButton BgBlue rightButton" onClick={() => this.downloadCSV()}>
                        <Image src="/images/download.png" width="32" height="32"/>
                    </Card>
                </div>
                <h1>Original Audio</h1>
                
            </div>

            old_downloadButton = <div>
                
                <div className="ButtonGroup">
                    <Card className="CardButton BgLightB leftButton" onClick={() => this.shareOldAudio()}>SHARE AUDIO</Card>
                    <Card className="CardButton BgBlue rightButton" onClick={() => this.downloadOldAudio()}>
                        <Image src="/images/download.png" width="32" height="32"/>
                    </Card>
                </div>



            </div>

        }

        return (
        
            <div className="App">
                <Container className="Container">

                    <Loading loading={this.state.loading} background="#F8F5F2" loaderColor="#D70026"/>

                    <div className="PlaceHolder"></div>
                    <Navbar className="NavBar" variant="dark">
                        <Navbar.Brand>
                            <img
                                alt=""
                                src="/images/heart-rate.png"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            HEARTY HELPER
                        </Navbar.Brand>
                    </Navbar>
                    <Card className="Card">
                        <Card.Body>
                            <Card.Text>
                                { this.state.information }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    {centerImg}
                    {startButton}

                    <div className="audioBlock" id='audioPlayer'></div>

                    {downloadButton}

                    <div className="audioBlock" id='old_audioPlayer'></div>

                    {old_downloadButton}
                    <Card className="CardButton" onClick={() => this.showHelp()}>HELP</Card>

                    <div className="PlaceHolder"></div>

                    <div className="footer">
                        Copyright &copy; Developed by Ho Lab, HKU
                    </div>
                </Container>


                <Modal animation={false} show={this.state.modalShow} onHide={() => this.closeModal()} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header>
                        <Modal.Title>Help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>

                            <Card className="Card ModalSection">
                                <strong>Tip 0: Add this app to Home Screen</strong>
                                You can add this web-based application to your Home Screen so that this app can be stored for later retrieval. Also, entering the app from Home Screen will let you have a native-app experience.
                            </Card>

                            <Card className="Card ModalSection">
                                <strong>Tip 1: Auscultation</strong>
                                This app will start to record when our deep neural network incessantly recognises your heart sound. Your heart sound will be better identified and recorded if the phone case and clothes are removed during the auscultation. You may refer to the image below to know where to locate the best auscultation position on your chest.
                                <div className="ModalImgSection">
                                    <Image className="Img" src="/images/help.png" width='60%'/>
                                </div>
                            </Card>

                            <Card className="Card ModalSection">
                                <strong>Tip 2: Privacy & File sharing</strong>
                                All sensings and analysis will be accomplished on your phone locally, and all your data will stay with you unless you initiatively share them. You can save the audio file and the visualisation of your heart sound after recording and also share them through other applications (i.g. WhatsApp, Email, WeChat, etc.).
                            </Card>

                            <Card className="Card ModalSection">
                                <strong>Tip 3: Other</strong>
                                This app is designed to be cross-platform and valid in both iOS and Android systems. But there may be other reasons that cause the app’s failure. You may 1) reload the app, 2) permit your browser and this website to use your microphone, 3)  use the app on another device or update your operating system to the latest if the app doesn’t run properly.
                            </Card>

                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="BgRed" onClick={() => this.closeModal()}>CLOSE</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default App;