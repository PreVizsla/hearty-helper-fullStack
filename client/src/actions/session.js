import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    // login user

    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router('/signed');
  } catch (error) {
    console.log(error);
  }
};

export const create = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router('/signed');
  } catch (error) {
    console.log(error);
  }
}; 