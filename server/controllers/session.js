import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';


export const create = async (req, res) => {

    // TODO add the created session to the history

    const { creator, start, end, patientName, sid, duration } = req.body;

    console.log(duration);
    
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
        console.log(session_result);

        const  token = jwt.sign({sid: session_result.sid}, 'test', {expiresIn: durationStr});
        //console.log("a2");
        res.status(200).json({ result: session_result, token });
    } catch (error){
        console.error(error);
        // console.error(sid);
        res.status(500).json({ message: "Something went wrong" });
    }
}