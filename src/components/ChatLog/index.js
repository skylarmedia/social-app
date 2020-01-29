import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import './index.css';
import app from 'firebase/app';
import { Popover, Button } from 'antd';
import { AuthUserContext } from '../Session';

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
    console.log('props custom claims', this.props);
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
    return (
      <AuthUserContext.Consumer>
        {authUser => {
          return (
            <div className="d-flex flex-wrap messages-wrapper">
              {messages &&
                this.props.messages.map((item, i) => {
                  if (authUser.skylarAdmin === true) {
                    var content = (
                      <button
                        type="button"
                        key={i}
                        className="clear-btn d-flex"
                        onClick={() =>
                          this.deleteMessage(this.props.adminClient, item.timestamp, i)
                        }
                      >
                        <i className="fas fa-trash"></i>
                        <span className="ml-10">DELETE</span>
                      </button>
                    );
                  }
                  return (
                    <React.Fragment>
                      {item.admin === true ? (
                        <div className={authUser.skylarAdmin ? 'admin-logged-in admin-message-wrap position-relative w-100' : 'client-logged-in admin-message-wrap position-relative w-100'}>
                          <div className="inner-admin-message w-100">
                            {authUser.skylarAdmin === true && (
                              <Popover placement="topRight" content={content} trigger="click">
                                <Button className="clear-btn">
                                  <i className="fas fa-ellipsis-v"></i>
                                </Button>
                              </Popover>
                            )}
                            <div className="admin-mesage">
                              <span className="grey-text">{`${item.date}, ${item.time}`}</span>
                              <span className="color-blue">{item.message}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={authUser.skylarAdmin ? 'admin-logged-in client-message-wrap position-relative w-100 client-message-wrap d-flex' : 'client-logged-in client-message-wrap position-relative w-100 client-message-wrap d-flex' }>
                          <img src={item.photo} alt="client logo" className="client-logo"/>
                          <div className="inner-admin-message position-relative">
                            {authUser.skylarAdmin === true && (
                              <Popover placement="topRight" content={content} trigger="click">
                                <Button className="clear-btn client-clear-btn position-absolute">
                                  <i className="fas fa-ellipsis-v"></i>
                                </Button>
                              </Popover>
                            )}
                            <div className="client-message">
                              <div className="d-flex align-items-center justify-content-between pl-10">
                              <span className="p-blue f-16 fw-500">{item.client}</span>
                              <span className="grey-text">{`${item.date}, ${item.time}`}</span>
                              </div>
                              <span className="color-blue d-block">{item.message}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          );
        }}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(withFirebase)(AdminChatLog);
