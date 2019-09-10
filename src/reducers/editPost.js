const INITIAL_STATE = {
    post: null
}

const editPost = (state, action) => (
    console.log(action, 'action in clients'), {

        ...state,
        data: action.post
    });



function setEditPostReducer(state = INITIAL_STATE, action) {

    switch (action.type) {
        case 'GET_POST': {
            return editPost(state, action)
        }
        default:
            return state
    }
}

export default setEditPostReducer;