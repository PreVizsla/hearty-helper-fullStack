import {combineReducers} from 'redux';

import login from './login';
import session from './session';

export const reducers = combineReducers({login, session});