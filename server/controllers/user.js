import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // console.log("Log In initiating");

        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(403).json({ message: "Invalid Credentials" });

        //secret (test)

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});

        // console.log("Log In successful");

        res.status(200).json({ result: existingUser, token });

    } catch (error){

        // TODO will be more specific
        res.status(500).json({ message: "Something went wrong: " + error });

    }
}


export const signedin = async (req, res) => {
    const {email, password} = req.body;
    // console.log(req.body);
    try {
        // console.log("fetching user");
        const existingUser = await User.findOne({ email });
        // console.log(existingUser);
        res.status(200).json(existingUser);
    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const signup = async (req, res) => {
    
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        console.log("sign up initiating");
        const existingUser = await User.findOne({ email });

        if(existingUser) return res.status(400).json({ message: "User already exists"});
    
        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match"});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "1h"});

        res.status(200).json({ result: result, token });

        console.log("sign up successful");
    } catch (error){

        res.status(500).json({ message: "Something went wrong" });
        console.log(error)

    }
}