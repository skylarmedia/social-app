import { combineReducers } from 'redux';
import setClientsReducer from './clients';
import editPostReducer from './editPost';
import userInfoReducer from './userInfo';
import pushReducer from './pushPost';


const rootReducer = combineReducers({
    setClientsReducer: setClientsReducer,
    editPostReducer: editPostReducer,
    userInfoReducer: userInfoReducer,
    pushReducer: pushReducer
})

export default rootReducer;