import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import "./index.css";

class AdminChatLog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            message: {}
        }

    }

    componentDidMount() {
        console.log(this.props.id, 'props in mounted compoennt')
        console.log(this.props, 'props in chatlog')
    }

    componenetDidUpdate(prevProps) {
        if (this.props.authUser.email !== prevProps.authUser.email) {
            alert('updated');
        }
    }



    render() {
        console.log(this.props.id, 'props on id')
        console.log(this.state.messages, 'messages')
        console.log(this.props.authUser, 'auth user')

        // console.log(this.state.messages.length, 'in message render')
        const logoStyles = {
            width: 100,
            height: 100
        }

        let avatar;

        // console.log()
        if (this.props.authUser) {
            if (this.props.authUser.email === 'sky3@hotmail.com') {
                avatar = <p>Avatar Admin</p>
            } else {
                avatar = <p>Avatar User</p>
            }
        }


        // const renderMessage = 
        return (
            <div>
                {
                    this.props.messages && (
                        this.props.messages.map(item => {
                            // console.log(this.state.messages, 'message length')
                            return (
                                (
                                    <li className="row align-items-center">
                                        <img src={`${item.logo}`} className="avatar-chat" />
                                        <p>{item.message}</p>
                                    </li>
                                )
                            )

                        })
                    )
                }

            </div >
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSetMessages: messages =>
        dispatch({ type: 'MESSAGES_SET', messages }),
    onSetMessagesLimit: limit =>
        dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

export default compose(
    withFirebase,
    connect(
        null,
        mapDispatchToProps
    ),
)(AdminChatLog)