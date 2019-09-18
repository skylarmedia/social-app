export const pushPost = (item)=>{
    console.log("MAIN ITEM", item)
    return{
        type: 'PUSH_POST',
        item
    }
}