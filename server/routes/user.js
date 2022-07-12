import express from 'express';

import {signin, signup, signedin, getHistory, logout} from '../controllers/user.js'

import {create} from '../controllers/session.js'


const router = express.Router();

router.post('/signin', signin);

router.post('/signup', signup);

// router.post('/create', create);

router.post('/user', signedin);

router.post('/getHistory', getHistory);

router.post('/logout', logout);

export default router;

