const INITIAL_STATE = {
    userId: ''
}

const userId = (state, action) => (
    {

        ...state,
        userId: action.authUser
    });



function userInfoReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_USER_ID': {
            return userId(state, action)
        }
        default:
            return state
    }
}

export default userInfoReducer;