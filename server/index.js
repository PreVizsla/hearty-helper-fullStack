import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './routes/user.js'

const app = express();

app.use(bodyParser.json({limit: "1mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true}));
app.use(cors());

app.use('/user', userRouter)

// mongoDB
const CONNECTION_URL = 'mongodb+srv://previzsla:previzsla123@cluster0.dqxnt.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> app.listen(PORT, () => console.log("Server Running on port 5000")))
    .catch((error)=>console.log(error.message));

//mongoose.set('useFindAndModify', false);
