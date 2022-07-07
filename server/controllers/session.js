import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';
import Counter from '../models/counter.js';

export const create = async (req, res) => {

    // TODO add the created session to the history

    const { creator, start, end, patientName, sid, duration } = req.body;

    // console.log(duration);
    
    try {
        // hashing wont work unless we have an id to match the hash (e.g. patient's name / doctors name)
        //const hashedSession = await bcrypt.hash(sid, 14);
        const dt = new Date();
        dt.setSeconds(dt.getSeconds()+duration);
        const durationStr = duration.toString() + 's';
        // console.log("asdfadsf"+dt);
        // console.log("tessss "+ new Date(Date.now() +duration))
        
        // const session_result = await Session.create({ sid : hashedSession, duration: duration, expiresAt: dt });
        const session_result = await Session.create({ 
            creator: creator, 
            patientName: patientName, 
            startTime: start, 
            endTime : end, 
            active: true,
            sid : sid, 
            duration: duration, 
        });
        // console.log(session_result);

        const  token = jwt.sign({sid: session_result.sid}, 'test', {expiresIn: durationStr});
        //console.log("a2");
        res.status(200).json({ result: session_result, token });
    } catch (error){
        console.error(error);
        // console.error(sid);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getId = async(req, res) => {
    try{
        Counter.find({seq_value: {$gt:0}}, function(err, session){
            // console.log(session);
            // console.log(session[0].seq_value);
            if(err){
                res.send(error)
            } else{
                res.json(session[0].seq_value)
            }
        });
        // console.log("tess");
    } catch (error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const listSession = async(req, res) => {
    
    const {user} = req.body;
    // console.log("req "+req);
    // console.log("user "+ req.params.name);
    try{    
        // Session.find({}, {projection: {creator: req.params.name }},function (err, session){
        Session.find({"creator" : req.params.name.substring(1)}, function (err, session){
            if(err){
                res.send(error)
            }else{
                // var len = session.length;
                // for(var i=0;i<len;i++){
                //     console.log("yeeee");
                //     // console.log(session[i]);
                //     console.log(session[i].creator);
                //     if (session[i].creator != req.params.name){
                //         console.log("REMOVE")
                //         session[i].pop();
                //     }
                // }

                res.json(session)
                // console.log(session)
            }
                
            
        });


        // res.status(500).json({message: "success"})
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}