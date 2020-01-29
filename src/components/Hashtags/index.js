import React from 'react';

const Hashtags = props => {


    const HashTagList = props => {
        if (props.hashtags) {
            var hashes = props.hashtags.split(' ');
            hashes.map(hash => {
                // Add Later
            })
        }

    }
    return (
        <div>
            {HashTagList(props.hashtags)}
        </div>
    )
}

export default Hashtags