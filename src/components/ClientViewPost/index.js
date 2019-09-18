import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import MediaWrapper from '../MediaWrapper';
import Hashtags from '../Hashtags';
import ChatBox from '../ChatBox';
import ChatLog from '../ChatLog';

import { AuthUserContext } from '../Session';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


class ClientViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: localStorage.userId,
      post: [],
      media: [],
      hashtags: [],
      links: [],
      approved: false,
      postId: '',
      showPopUp: false,
      messages: [],
      adminRead: null,
      clientRead: null
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.approveFormSubmit = this.approveFormSubmit.bind(this);
  }

  componentWillMount() {

    app.firestore().collection('users').doc(this.state.userId).collection('posts')
    .doc(this.props.match.params.id).get().then(res => {
        console.log('RES', res.data())
    })

    // this.props.firebase
    //   .getSinglePost(
    //     this.state.userId,
    //     this.props.match.params.id
    //   ).then(res => {
    //     console.log('DATA', res)
    //     return res.data()
    //   })
  }

  handleCheckbox = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      approved: value
    });
  };

  approveFormSubmit = e => {
    e.preventDefault();

    this.props.firebase.approvePost(this.state.userId, this.state.postId, this.state.approved);
  };

  showPopUp = e => {
    e.preventDefault();

    this.setState({
      showPopUp: !this.state.showPopUp
    });
  };

  getMessage = (id, month, day, title, message, logo) => {
    const incomingMessageObj = {};
    incomingMessageObj.id = id;
    incomingMessageObj.logo = logo;
    incomingMessageObj.month = month;
    incomingMessageObj.day = day;
    incomingMessageObj.title = title;
    incomingMessageObj.message = message;

    this.setState({
      messages: [...this.state.messages, incomingMessageObj],
      adminRead: false
    });

    this.props.firebase.adminSendMessage(localStorage.userId, month, day, title, message, logo);
  };

  componentWillUnmount() {
    this.props.firebase.editReadAdmin(localStorage.userId, this.state.postId, this.state.adminRead);
  }

  render() {
    console.log(this.state, 'read or not read');
    const approveStyles = {
      margin: 200,
      width: 300,
      height: 300
    };

    const popUpStyles = {
      width: 500,
      height: 500,
      background: 'red',
      position: 'fixed',
      zIndex: 1
    };

    return (
      <React.Fragment>
        <AuthUserContext.Consumer>
          {authUser => (
            <div className="container">
              {this.state.showPopUp ? (
                <div style={popUpStyles}>
                  You have changed the approval of this post
                  <button onClick={this.showPopUp}>Close</button>
                </div>
              ) : (
                ''
              )}
              <p>{this.state.title}</p>
              <div className="media-text-wrapper row">
                <div className="col-sm-6">
                  <MediaWrapper media={this.state.media} />
                </div>
                <div className="col-sm-6">
                  <div className="col-sm-12">
                    <p>Copy</p>
                    <p>{this.state.copy}</p>
                  </div>
                  <div className="col-sm-12">
                    {this.state.hashtags.map(hash => (
                      <div>#{hash}</div>
                    ))}
                    <br />

                    {this.state.links.map(link => (
                      <div>{link}</div>
                    ))}
                  </div>
                </div>
                <br />
                <br />
                <br />
                <form onSubmit={this.approveFormSubmit} id="approve-form" style={approveStyles}>
                  <label>
                    {this.state.approved ? (
                      <p>You have approved this post</p>
                    ) : (
                      <p>You have not approved this post</p>
                    )}
                    <input
                      name="approve"
                      type="checkbox"
                      id="approve-checkbox"
                      onChange={this.handleCheckbox}
                      checked={this.state.approved}
                    />
                  </label>
                  <button onClick={this.approveFormSubmit}>Submit</button>
                </form>
              </div>
              {/* End of media-text-wrapper */}

              <div id="chat-wrapper">
                <ChatBox
                  getMessage={this.getMessage}
                  month={this.props.match.params.month}
                  day={this.props.match.params.day}
                  title={this.props.match.params.title}
                  authUser={authUser}
                />
                <ChatLog
                  incomingMessage={this.state.incomingMessage}
                  id={this.props.match.params.client}
                  month={this.props.match.params.month}
                  day={this.props.match.params.day}
                  messages={this.state.messages}
                  authUser={authUser}
                />
              </div>
            </div>
          )}
        </AuthUserContext.Consumer>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(ClientViewPost));
