import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
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

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout()) // logout is called one expirationTime is done
        }, expirationTime * 1000) // multiply by 1000 to turn your milli seconds to real seconds
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
               dispatch(checkAuthTimeout(response.data.expiresIn));
           }) 
           .catch(err => {
               console.log(err)
               dispatch(authFail(err.response.data.error));
           });
    }
}

