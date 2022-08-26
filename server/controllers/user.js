import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Log In initiating");
        console.log(email);
        const existingUser = await User.findOne({ email});

        if(!existingUser) return res.status(200).json({ message: "User doesn't exist", error: 404});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(200).json({ message: "Invalid Credentials", error: 403 });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});

        return res.status(200).json({ result: existingUser, token, error: 0 });

    } catch (error){

        // TODO will be more specific
        res.status(500).json({ message: "Something went wrong: " + error });

    }
}


export const signedin = async (req, res) => {
    const {email, password} = req.body;
    try {

        const existingUser = await User.findOne({ email });
        
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

        if(existingUser) return res.status(200).json({ message: "User already exists", error: 400});
    
        if(password !== confirmPassword) return res.status(200).json({ message: "Passwords don't match", error: 403});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: firstName + ' ' + lastName});

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "1h"});

        res.status(200).json({ result: result, token, error: 0 });

        console.log("sign up successful");

    } catch (error){

        res.status(500).json({ message: "Something went wrong" });
        console.log(error)

    }
}


export const getHistory = async (req, res) => {

    const {_id} = req.body;

    try {
        console.log("fetching user");
        const user = await User.findOne({ _id });
        const history = user['sessionHistory'];
        console.log(history);
        res.status(200).json(history);
    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = async (req, res) => {
    const {_id} = req.body;

    try {
        console.log("fetching user");
        const user = await User.findOne({ _id }).then((rUser) => {
            rUser.online = false;
            rUser.save();
            // console.log(rUser);
        })
        // req.logout();
        // res.redirect("/");
        res.status(200).json(user);

    } catch (error){
        res.status(500).json({ message: "Something went wrong" });
    }

}