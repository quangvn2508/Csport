import { SET_JWT, REMOVE_JWT, SET_LOGIN_PANEL, ADD_MESSAGE, ADD_ERROR, REMOVE_NOTIFICATION } from './actionTypes';

const initalState = {
    jwt: null,
    showLoginPanel: false,
    notification: null
};
  
function reducer(state = initalState, action) {
    switch(action.type) {
        case SET_JWT:
            return {...state, jwt: action.data};
        case REMOVE_JWT:
            return {...state, jwt: null};
        case SET_LOGIN_PANEL:
            return {...state, showLoginPanel: action.data};
        case ADD_MESSAGE:
            return {...state, notification: action.data};
        case ADD_ERROR:
            return {...state, notification: action.data};
        case REMOVE_NOTIFICATION:
            return {...state, notification: null};
        default:
        return state;
    }
}

export default reducer;