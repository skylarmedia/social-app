import React from 'react';
import TextField from '@material-ui/core/TextField';

const AdminViewPostContent = props => {


    // const categoryName = props.post.selectedCategory.split('|||')[0];
    // const categoryColor = props.post.selectedCategory.split('|||')[1];

    // const categoryStyleColor = {
    //     background: categoryColor,
    //     width: "50px",
    //     height: "50px"
    // }

    const renderHashtags = props.hashtags.map(item => (
        <div>#{item}</div>
    ))

    return (
        <React.Fragment>
            <TextField
                id="outlined-name"
                label="Title"
                value={props.post.title}
                margin="normal"
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />
            <br />
            <TextField
                id="outlined-name"
                label="Copy"
                value={props.post.copy}
                margin="normal"
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />
            <br />
            {renderHashtags}
            Time: <p>{props.post.time}</p>
            {/* Category: <p>{categoryName}</p><div style={categoryStyleColor}></div> */}
            Approved: <p>
                {props.post.approve ? 'Appoved' : 'Not Approved'}
            </p>
        </React.Fragment>
    )
}

export default AdminViewPostContent;