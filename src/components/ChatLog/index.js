import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import './index.css';
import app from 'firebase/app';
import { Popover, Button } from 'antd';

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
    console.log('this db', this.db);
  }

  deletePostParent = index => {
    this.setState({
      messages: this.state.messages.filter((_, i) => i !== index)
    });
  };

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
      });

    this.props.deletePost(i);
  }

  render() {
    const { messages } = this.props;
    console.log('chatlog props', this.props.adminClient);
    return (
      <div className="d-flex flex-wrap messages-wrapper">
        {messages &&
          this.props.messages.map((item, i) => {
            console.log('tiemstmasp', item.timestamp);
            if (item.admin == true) {
              let content = (
                <button
                  type="button"
                  className="clear-btn d-flex"
                  onClick={() => this.deleteMessage(this.props.adminClient, item.timestamp, i)}
                  key={i}
                >
                  <i class="fas fa-trash"></i>
                  <span className="ml-10">DELETE</span>
                </button>
              );
              return (
                <div className="admin-message-wrap position-relative w-100">
                  <div className="inner-admin-message w-100">
                    {localStorage.getItem('skylarAdmin') == 'true' && (
                      <Popover placement="topRight" content={content} trigger="click">
                        <Button className="clear-btn">
                          <i className="fas fa-ellipsis-v"></i>
                        </Button>
                      </Popover>
                    )}

                    <div className="admin-mesage">
                      <span className="grey-text">{`${item.date}, ${item.time}`}</span>
                      <span class="color-blue">{item.message}</span>
                    </div>
                  </div>
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


export default compose(withFirebase)(AdminChatLog);
