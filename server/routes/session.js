import express from 'express';
import {create, getSessionByCreator} from '../controllers/session.js'

const sessionRouter = express.Router();

sessionRouter.post('/create', create);

sessionRouter.post('/getSessionByCreator', getSessionByCreator);

// Only for clean data
// sessionRouter.post('/deleteSessionByCreator', deleteSessionByCreator);

export default sessionRouter;