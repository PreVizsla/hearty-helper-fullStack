import jwt from 'jsonwebtoken';
import Session from '../models/session.js'

export const signin = async (req, res) => {
    const { sid } = req.body;
    console.log(req.body);
    try {
        console.log("Session request initiating");
        const existingSession = await Session.findOne({ sid });

        if(!existingSession) return res.status(404).json({ message: "Session doesn't exist"});

        const token = jwt.sign({ sid: existingSession.sid, id: existingSession._id }, 'test', { expiresIn: "1h"});

        console.log("Session request successful");
        res.status(200).json({ result: existingSession, token });
    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }
}