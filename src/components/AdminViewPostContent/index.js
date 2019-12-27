import React from 'react';
import { Input } from 'antd';

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
            <Input
                id="outlined-name"
                value={props.post.title}
                className="blue-input"
                placeholder="TITLE"
            />
            <br />
            <Input
                id="outlined-name"
                value={props.post.copy}
                placeholder="COPY"
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