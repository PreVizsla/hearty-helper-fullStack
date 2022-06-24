import express from 'express';

import {signin, signup} from '../controllers/user.js'

import {create} from '../controllers/session.js'


const router = express.Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.post('/create', create);

export default router;