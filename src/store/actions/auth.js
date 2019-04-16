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
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
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
               const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
               localStorage.setItem('token', response.data.idToken);
               localStorage.setItem('expirationTime', expirationTime);
               localStorage.setItem('userId', response.data.localId);
               dispatch(authSuccess(response.data.idToken, response.data.localId));
               dispatch(checkAuthTimeout(response.data.expiresIn));
           }) 
           .catch(err => {
               console.log(err)
               dispatch(authFail(err.response.data.error));
           });
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationTime'));
            if(expirationDate <= new Date()) {
                dispatch(logout())
            }
            else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime() / 1000 ))
            }
        }
    }
}
