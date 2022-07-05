import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';

// export const create = async (req, res) => {
//     const { id } = req.body;

//     try {
//         //secret (test)
//         const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});

//         res.status(200).json({ result: existingUser, token });
//     } catch (error){
//         res.status(500).json({ message: "Something went wrong" });
//     }
// }


export const create = async (req, res) => {
    const { sid, duration } = req.body;

    console.log(sid);
    
    try {
        const hashedSession = await bcrypt.hash(sid, 14);
        
        // console.log("a");
        // succeed in setting customized expiry
        const session_result = await Session.create({ sid : hashedSession, duration: duration, expiresAt: {expires: duration}});
        //console.log("a1");

        const  token = jwt.sign({sid: session_result.sid}, 'test', {expiresIn: "20s"});
        //console.log("a2");
        res.status(200).json({ result: session_result, token });
    } catch (error){
        console.error(error);
        // console.error(sid);
        res.status(500).json({ message: "Something went wrong" });
    }
}