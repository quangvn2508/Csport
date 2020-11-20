import { SET_JWT, REMOVE_JWT, SET_LOGIN_PANEL } from './actionTypes';

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
