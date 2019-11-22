import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import './index.css';
import app from 'firebase/app';

class AdminChatLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      message: {}
    };

    this.db = app.firestore();
  }

  componentDidMount() {
    console.log('item message', this.props.messages);
    console.log('this db', this.db)
  }

  deleteMessage(client, timestamp, i) {
    this.db
      .collection('chats')
      .doc(client)
      .collection('messages')
      .where('timestamp', '==', timestamp)
      .get()
      .then(res => {
        this.db
        .collection('chats')
        .doc(client)
        .collection('messages')
        .doc(res.docs[0].id)
        .delete();
        // console.log('id in res', res)
        // console.log('doc res client', client, timestamp)
      })

    this.props.deletePost(i)


  }

  render() {
    const { messages } = this.props;
    console.log('chatlog props', this.props.adminClient);
    return (
      <div className="d-flex justify-content-end">
        {messages &&
          this.props.messages.map((item, i) => {
            console.log('tiemstmasp', item.timestamp);
            if (item.admin == true) {
              return (
                <div class="admin-message-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      this.deleteMessage(this.props.adminClient, item.timestamp, i)
                    }
                  >
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                  {item.message}
                </div>
              );
            } else {
              return <div class="client-message-wrapper">{item.message}</div>;
            }
          })}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages => dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit => dispatch({ type: 'MESSAGES_LIMIT_SET', limit })
});

export default compose(
  withFirebase,
  connect(
    null,
    mapDispatchToProps
  )
)(AdminChatLog);
