import {max, median, abs} from "mathjs";


// TODO standarize from -1 to 1 first !
class Despiker {
    
    constructor(input) {
        this.windowSize = 5000;
        this.inputData = [...input];
    }

    despike() {
        let inputReshaped = this.reshape(this.inputData);
        let MAAs = [];
        let MAAindices = [];

        inputReshaped.forEach(window => {
            const result = this.calculateMAA(window);
            MAAs.push(result[0]);
            MAAindices.push(result[1]);
        })

        let isSpike = this.checkOutliers(MAAs)[0]

        while (isSpike) {
            // Step1 locate the spike
            let spikeFrameInx = this.checkOutliers(MAAs)[1]
            let oldFrame = inputReshaped[spikeFrameInx]

            let startPoint = 0;
            let endPoint = oldFrame.length - 1;

            if (oldFrame[MAAindices[spikeFrameInx]] >= 0) {
                // Left zerocrossing: from neg to pos
                for (let i = 0; i < MAAindices[spikeFrameInx]; i++) {
                    if (oldFrame[i] <= 0 && oldFrame[i+1] > 0) {
                        startPoint = i;
                    }
                }
                // Right zerocrossing: from pos to neg
                for (let i = MAAindices[spikeFrameInx]; i < oldFrame.length - 1; i ++) {
                    if (oldFrame[i] >= 0 && oldFrame[i+1] < 0) {
                        endPoint = i;
                    }
                }
            } else {
                // Left zerocrossing: from pos to neg
                for (let i = 0; i < MAAindices[spikeFrameInx]; i++) {
                    if (oldFrame[i] >= 0 && oldFrame[i+1] < 0) {
                        startPoint = i;
                    }
                }
                // Right zerocrossing: from neg to pos
                for (let i = MAAindices[spikeFrameInx]; i < oldFrame.length - 1; i ++) {
                    if (oldFrame[i] <= 0 && oldFrame[i+1] > 0) {
                        endPoint = i;
                    }
                }
            }

            // Step2 remove spike
            console.log('spike start at ', startPoint, ' || end at ', endPoint, ' || frame index: ', spikeFrameInx);
            let newFrame = []
            for (let i = 0; i < oldFrame.length; i++) {
                if (startPoint <= i && i <= endPoint) {
                    newFrame.push(0.0001);
                } else {
                    newFrame.push(oldFrame[i]);
                }
            }

            inputReshaped[spikeFrameInx] = newFrame;

            // Step3 update MAAs by checking outliers

            MAAs = [];
            MAAindices = [];
            inputReshaped.forEach(window => {
                const result = this.calculateMAA(window);
                MAAs.push(result[0]);
                MAAindices.push(result[1]);
            })

            isSpike = this.checkOutliers(MAAs)[0];

        }

        return inputReshaped.flat();

    }

    checkOutliers(MAAs) {
        const median_ = median(MAAs);

        let outlierBol = false;
        let outlierIndex = -1;

        for (let i = 0; i < MAAs.length; i++){
            if (MAAs[i] >= 2.5 * median_) {
                outlierBol = true;
                outlierIndex = MAAs.indexOf(MAAs[i]);
                break;
            }
        }
        return [outlierBol, outlierIndex]
    }


    reshape(arr) {
        const newArr = [];
        while(arr.length) newArr.push(arr.splice(0, this.windowSize));
        return newArr;
    }

    calculateMAA(sampleFrames) {
        let MAA = max(abs(sampleFrames));
        let index = sampleFrames.indexOf(MAA);
        if (index === -1) {
            index = sampleFrames.indexOf(-MAA);
        }
        return [MAA, index];
    }

}

export default Despiker;
