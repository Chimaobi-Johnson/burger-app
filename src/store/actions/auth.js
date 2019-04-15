import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
        empty: null
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCkAYMWmM1U7xW0JI3SJVyVjkidA0HHq9A';
        if(!isSignUp) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCkAYMWmM1U7xW0JI3SJVyVjkidA0HHq9A';
        }
        axios.post(url, authData)
           .then(response => {
               console.log(response);
               dispatch(authSuccess(response.data.idToken, response.data.localId));
           }) 
           .catch(err => {
               console.log(err)
               dispatch(authFail(err));
           });
    }
}

