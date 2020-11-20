import { SET_JWT, REMOVE_JWT, SET_LOGIN_PANEL } from './actionTypes';

const initalState = {
    jwt: null,
    showLoginPanel: false
};
  
function reducer(state = initalState, action) {
    switch(action.type) {
        case SET_JWT:
            return {...state, jwt: action.data};
        case REMOVE_JWT:
            return {...state, jwt: null};
        case SET_LOGIN_PANEL:
            return {...state, showLoginPanel: action.data};
        default:
        return state;
    }
}

export default reducer;
