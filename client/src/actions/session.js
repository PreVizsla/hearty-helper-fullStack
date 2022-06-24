import { CREATE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const create = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.create(formData);

    dispatch({ type: CREATE, data });

    router('/signed');
  } catch (error) {
    console.log(error);
  }
}; 