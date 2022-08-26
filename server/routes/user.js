import express from 'express';

import {signin, signup, signedin, getHistory, logout} from '../controllers/user.js'


const router = express.Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.post('/user', signedin);

router.post('/getHistory', getHistory);

router.post('/logout', logout);

export default router;

