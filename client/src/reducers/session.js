import * as actionType from '../constants/actionTypes';

//const sessionReducer = (state = { authData: null }, action) => {
const sessionReducer = (state = {sessionData: null}, action) => {

    switch (action.type) {
        case actionType.CREATE:
            console.log(action?.data);
            //saving the id in local storage
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));

            return { ...state, authData: action.data, loading: false, errors: null };
        default:
            
            return state;
    }
};

// const authReducer = (state = {authData: null}, action) => {
//     switch (action.type){
//         case actionType.AUTH:
//             console.log(action?.data);
//             return state;
//         default:
//             return state;
//     }
// };

export default sessionReducer;