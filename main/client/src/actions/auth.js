import { AUTH } from '../constants/actionTypes';
import Swal from 'sweetalert2';
import * as api from '../api/index.js';

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data })
    navigate('/')

  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Try another email',
    })
  }
};

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data })
    navigate('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Incorrect email or password.',
    })

    console.log(error);
  }
};

