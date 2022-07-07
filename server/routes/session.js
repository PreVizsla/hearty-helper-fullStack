import express from 'express';
import {create} from '../controllers/session.js'

const sessionRouter = express.Router();

sessionRouter.post('/create', create);

export default sessionRouter;