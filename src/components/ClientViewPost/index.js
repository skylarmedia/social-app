import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import AdminChatLog from '../ChatLog';
import { AuthUserContext } from '../Session';
import moment from 'moment';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './index.css';
import ImagePosts from '../ImagePosts';

class ClientViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: localStorage.getItem('clientName'),
      posts: [],
      media: [],
      hashtags: [],
      links: [],
      approved: false,
      postId: '',
      showPopUp: false,
      messages: [],
      adminRead: null,
      clientRead: null,
      category: '',
      color: '#fff',
      openedChat: false,
      updatedMessages: false,
      clientRead: false
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.approveFormSubmit = this.approveFormSubmit.bind(this);
    this.db = app.firestore();
    this.functions = app.functions();
  }

  componentDidMount() {
    // Get Post
    app
      .firestore()
      .collection('users')
      .doc(this.state.userId)
      .collection('posts')
      .doc(this.props.match.params.id)
      .get()
      .then(res => {
        console.log('RES IN VIEW POST', res);
        this.setState({
          posts: res.data().post,
          category: res.data().selectedCategoryName,
          categoryColor: res.data().color,
          postId: this.props.match.params.id,
          clientRead: res.data().clientRead,
          approved: res.data().approved
        });
      }, () => {
        console.log(this.state)
      });

    // Get Messages
    this.db
      .collection('chats')
      .doc(localStorage.getItem('clientName'))
      .collection('messages')
      .where('postId', '==', this.props.match.params.id)
      .onSnapshot(snap => {
        const messageArr = [...this.state.messages];

        snap.docChanges().forEach(change => {
          console.log('CHANGE', change.type);
          if (change.type == 'added') {
            console.log('CHANGE DETECTED', change);
            messageArr.push(change.doc.data());
            this.setState({
              messages: messageArr
            });
          } else if (change.type == 'removed') {
            console.log(change.oldIndex);
            this.setState({
              messages: this.state.messages.filter((_, i) => i !== change.oldIndex)
            });
            console.log('CHANGE REMOVED', change);
          }
        });
      });

    const updateClientMessages = this.functions.httpsCallable('updateClientMessages');
    let newId = this.props.match.params.id;
    let functionObj = new Object();
    functionObj.postId = newId;
    functionObj.userId = this.state.userId;
    updateClientMessages(functionObj);

    //update readByClient
    if (this.state.clientRead == false) {
      app
        .firestore()
        .collection('users')
        .doc(this.state.userId)
        .collection('posts')
        .doc(this.props.match.params.id)
        .update({
          clientRead: true
        });
    }
  }

  toggleChat = () => {
    if (this.state.updatedMessages == false) {
    }
    this.setState({
      showChat: !this.state.showChat,
      updatedMessages: true
    });
  };

  handleCheckbox = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      approved: value
    });
  };

  approveFormSubmit = e => {
    e.preventDefault();

    // this.props.firebase.approvePost(this.state.userId, this.state.postId, this.state.approved);
  };

  deletePostParent = index => {
    alert('ran');
    this.setState({
      messages: this.state.messages.filter((_, i) => i !== index)
    });
  };

  showPopUp = e => {
    e.preventDefault();

    this.setState({
      showPopUp: !this.state.showPopUp
    });
  };

  formatAMPM = date => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  captureKey = e => {
    if (e.key === 'Enter') {
      console.log('CLIENT ID', this.state.userId);
      e.preventDefault();
      this.props.firebase.adminSendMessage(
        false,
        moment(new Date()).format('DD/MM/YYYY'), // Date,
        this.formatAMPM(new Date()),
        this.state.userId, // Client
        this.state.message, // Message
        this.props.match.params.id,
        moment().unix(),
        parseInt(this.props.match.params.month), // Month to count messages,
        2019 // Year to count messages
      );

      this.setState({
        message: ''
      });

      const updateClientNotification = this.functions.httpsCallable('updateClientNotification');
      let newId = this.props.match.params.id;
      let noteObj = new Object();
      noteObj.postId = newId;
      noteObj.userId = this.state.userId;
      updateClientNotification(noteObj);
    }
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

    this.props.firebase.adminSendMessage(localStorage.getItem('clientName'), month, day, title, message, logo);
  };

  componentWillUnmount() {
    this.props.firebase.editReadAdmin(localStorage.getItem('clientName'), this.state.postId, this.state.adminRead);
  }

  setMessage = e => {
    e.preventDefault();
    this.setState({
      message: e.target.value
    });
  };

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

    const posts = this.state.posts.map((item, index) => {
      console.log('ITEM POST in client', item);
      const styles = {
        backgroundColor: this.state.categoryColor
      };
      return (
        <div className="d-flex row client-item" key={index}>
          <div className="container mx-auto row">
            <div className="col-sm-6">
              <div className="w-100 color-blue p-border">{item.title}</div>
              <ImagePosts imageSrc={item.images} />
              <div className="w-100 color-blue p-border copy-margin">POST COPY</div>
              <p>{item.copy}</p>
            </div>
            <div className="col-sm-6">
              <div>
                <div className="w-100 color-blue p-border">PLATFORMS</div>
                <div id="client-social" className="d-flex">
                  {item.facebook && <p>Facebook</p>}
                  {item.instagram && <p>Instagram</p>}
                  {item.twitter && <p>Twitter</p>}
                  {item.linkedin && <p>Linkedin</p>}
                  {item.other && <p>Other</p>}
                </div>
                <div className="blue-border row">
                  <p className="col-sm-3">POST DATE</p>
                  <p className="col-sm-3">POST TIME</p>
                  <p className="col-sm-3">POST MEDIUM</p>
                </div>
                <div className="row">
                  <p className="col-sm-3">{item.ipDate}</p>
                  <p className="col-sm-3">POST TIME1</p>
                  <p className="col-sm-3">POST MEDIUM1</p>
                </div>
                <div className="times-border row">
                  <p className="col-sm-3">POST DATE</p>
                  <p className="col-sm-3">POST TIME</p>
                  <p className="col-sm-3">POST MEDIUM</p>
                </div>
                <div>
                  {/* {new Date(item.postDate)} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <React.Fragment>
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <div className="col-md-5 client-chat">
                {this.state.showChat && (
                  <div>
                    <AdminChatLog
                      messages={this.state.messages}
                      deletePost={this.deletePostParent}
                    />
                    <textarea
                      onChange={this.setMessage}
                      value={this.state.message}
                      onKeyDown={this.captureKey.bind(this)}
                    />
                  </div>
                )}
                <button onClick={this.toggleChat} type="button" type="button" className="clear-btn">
                  <img src={require('../assets/chatbox.svg')} />
                </button>
              </div>
              {this.state.showPopUp ? (
                <div style={popUpStyles}>
                  You have changed the approval of this post
                  <button onClick={this.showPopUp}>Close</button>
                </div>
              ) : (
                ''
              )}
              {this.state.posts && <div className="client-view-post">{posts}</div>}
            </div>
          )}
        </AuthUserContext.Consumer>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(ClientViewPost));
