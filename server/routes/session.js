import express from 'express';
import {create} from '../controllers/session.js'
import {signin} from '../controllers/sessionReq.js';
const sessionRouter = express.Router();

sessionRouter.post('/create', create);

sessionRouter.post('/signin', signin);

export default sessionRouter;