import { combineReducers } from 'redux';
import setClientsReducer from './clients';
import editPostReducer from './editPost';
import userInfoReducer from './userInfo';


const rootReducer = combineReducers({
    setClientsReducer: setClientsReducer,
    editPostReducer: editPostReducer,
    userInfoReducer: userInfoReducer
})

export default rootReducer;