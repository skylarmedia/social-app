import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

class ClientChatLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messsages: []
        }
    }

    componentWillMount() {
        // this.props.firebase.getMessages(localStorage.getItem('userId'))
    }
    render() {
        return (
            <React.Fragment>
                Main Chatlog
            </React.Fragment>
        )
    }
}

export default compose(
    withFirebase,
    connect(
        null,
        null
    ),
)(ClientChatLog)