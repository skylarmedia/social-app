import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

class ChatBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: '',
            clientLogo: '',
            authUser: ''
        }

        this.setMessage = this.setMessage.bind(this);
    }

    setMessage = e => {
        e.preventDefault();

        this.setState({
            message: e.target.value
        })
    }

    componentDidMount() {
        // this.setState({
        //     clientLogo: this.props.authUser.photoURL
        // })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.authUser !== state.authUser) {
            return {
                authUser: props.authUser
            }
        }

        // Return null if the state hasn't changed
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.authUser !== prevState.authUser) {
            this.setState({
                authUser: this.props.authUser
            })
        }
    }

    submitMessage = e => {
        e.preventDefault()

        let id = this.props.id
        let month = parseInt(this.props.month)
        let day = parseInt(this.props.day)
        let title = this.props.title
        let message = this.state.message
        let logo = this.state.authUser.photoURL

        let date = new Date;
        var messageMonth = date.getMonth();

        this.props.getMessage(id, month, day, title, message, logo)

        this.setState({
            message: ''
        })
    }

    addEmoji = (e) => {
        //console.log(e.unified)
        if (e.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${e.unified}`)
            this.setState({
                message: this.state.message + emojiPic
            })
        } else {

            let sym = e.unified.split('-')
            let codesArray = []
            sym.forEach(el => codesArray.push('0x' + el))
            //console.log(codesArray.length)
            //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]

            let emojiPic = String.fromCodePoint(...codesArray)
            this.setState({
                message: this.state.message + emojiPic
            })
        }
    }





    render() {
        console.log(this.props, 'props in chatbox');
        console.log(this.state, 'auth user in client chat')
        return (
            <div>
                <form onSubmit={this.submitMessage}>
                    <textarea onChange={this.setMessage} value={this.state.message} />
                    {/* {this.props.authUser && (
                    <input type="hidden" value={} />
                )} */}

                    <button onClick={this.submitMessage}>Submit</button>
                </form >
                <span>
                    <Picker onSelect={this.addEmoji} />
                </span>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSetMessage: message => dispatch({ type: 'MESSAGE_SENT', message }),
});


export default compose(
    withFirebase,
    connect(
        null,
        mapDispatchToProps
    )
)(ChatBox)