import express from 'express';
import {create, getSessionByCreator, getSessionByToken} from '../controllers/session.js'

const sessionRouter = express.Router();

sessionRouter.post('/create', create);

sessionRouter.post('/getSessionByCreator', getSessionByCreator);

sessionRouter.post('/getSessionByToken', getSessionByToken);

// Only for clean data
// sessionRouter.post('/deleteSessionByCreator', deleteSessionByCreator);

export default sessionRouter;