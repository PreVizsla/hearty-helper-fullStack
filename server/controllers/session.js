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
    const { id } = req.body;

    try {
        const hashedSession = await bcrypt.hash(id, 12);

        const result = await Session.create({ id : hashedSession});

        const  token = jwt.sign({id: result.id}, 'test', {expiresIn: "1h"});
        
        res.status(200).json({ result: result, token });
    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }
}