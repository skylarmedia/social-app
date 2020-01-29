const initState = {
    posts:[]
}

const pushReducer = (state = initState, action) => {
    if(action.type === 'PUSH POST' && action){
        return{
            ...state,
            posts: [...state.posts, action.item],
            // [action.item.index]:action.payload.data
        }
    }
    else{
        return state
    }
}

export default pushReducer;