import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';

function makeToken(length) {
    let result = '';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


export const getSessionByCreator = async (req, res) => {

    const { creator } = req.body;

    try {
        console.log("fetching Session");
        const sessions = await Session.find({ creator });

        res.status(200).json(sessions);
    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }

}

// export const deleteSessionByCreator = async (req, res) => {
//
//     const { creator } = req.body;
//
//     try {
//         console.log("fetching Session");
//         const sessions = await Session.deleteMany({ creator });
//
//         res.status(200).json(sessions);
//     } catch (error){
//         res.status(500).json({ message: "Something went wrong" });
//     }
//
// }


export const create = async (req, res) => {

    // TODO add the created session to the history

    const { creator, patientName, startTime, endTime, duration} = req.body;
    const token = makeToken(6);

    try {
        const sessionResult = await Session.create({
            creator: creator,
            patientName: patientName,
            duration: duration,
            startTime: startTime,
            endTime: endTime,
            token: token,
        });

        console.log(sessionResult);
        res.status(200).json({ result: sessionResult });

    } catch (e) {

        res.status(500).json({ message: "Something went wrong" });
    }

}