import express from 'express';
import {create, listSession, getId} from '../controllers/session.js'
import {signin} from '../controllers/sessionReq.js';
const sessionRouter = express.Router();

sessionRouter.post('/create', create);

sessionRouter.post('/signin', signin);

sessionRouter.get('/list/:name', listSession);

sessionRouter.get('/count', getId);
export default sessionRouter;