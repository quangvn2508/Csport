import { SET_JWT, REMOVE_JWT, SET_LOGIN_PANEL, ADD_MESSAGE, ADD_ERROR, REMOVE_NOTIFICATION } from './actionTypes';

export function setJwt(jwt) {
    return {
        type: SET_JWT,
        data: jwt
    }
}

export function removeJwt() {
    return {
        type: REMOVE_JWT
    }
}

export function showLoginPanel(show) {
    return {
        type: SET_LOGIN_PANEL,
        data: show
    }
}

export function addMessage(body, title = null) {
    return {
        type: ADD_MESSAGE,
        data: {
            heading: title,
            body: body,
            type: "success"
        }
    }
}

export function addError(body, title = null) {
    return {
        type: ADD_ERROR,
        data: {
            heading: title,
            body: body,
            type: "danger"
        }
    }
}

export function removeNotification() {
    return {
        type: REMOVE_NOTIFICATION
    }
}