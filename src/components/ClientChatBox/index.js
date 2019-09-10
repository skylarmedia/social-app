import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext } from '../Session';

class ClientChatBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        }
        this.setMessage = this.setMessage.bind(this);
    }

    setMessage = e => {
        e.preventDefault();

        this.setState({
            message: e.target.value
        })
    }

    submitMessage = e => {
        e.preventDefault();

        let id = this.props.id
        let month = parseInt(this.props.month)
        let day = parseInt(this.props.day)
        let title = this.props.title
        let message = this.state.message

        let date = new Date;
        var messageMonth = date.getMonth();

        this.props.getMessage(id, month, day, title, message)
    }




    render() {
        return (
            <form onSubmit={this.submitMessage}>
                <textarea onChange={this.setMessage} value={this.state.message} />
                <button onClick={this.submitMessage}>Submit</button>
            </form>
        )
    }
}

export default compose(
    withFirebase(ClientChatBox)
)