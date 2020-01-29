import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

class MediaWrapper extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }



    render() {

        const check = (url) => {
            if (url !== 'No Files') {
                var checkUrl = new URL(url)
                var query_string = checkUrl.search;
                var search_params = new URLSearchParams(query_string);
                var type = search_params.get('type');

                return type
            }
        }

        const MediaRender = (files) => (

            files.map(file => {
                const imgStyle = {
                    width: 200,
                    height: 200
                }
                switch (check(file)) {
                    case 'image':
                        return (
                            <img src={file} style={imgStyle} alt="media file"/>
                        )
                        break;
                    case 'video':
                        return (
                            <div>
                                <video height="200" width="200" controls>
                                    <source src={file} />
                                </video>
                            </div>

                        )
                        break;
                    default:
                        return (
                            <div>File Not Supported</div>
                        )

                }
            })
        )


        return (
            <div>{MediaRender(this.props.media)}</div>
        )
    }
}


export default MediaWrapper;