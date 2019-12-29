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
import { Picker } from 'emoji-mart';
import { Row, Col } from 'antd';

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
      clientRead: false,
      showIcons: true
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
      .then(
        res => {
          console.log('RES IN VIEW POST', res);
          this.setState({
            posts: res.data().post,
            category: res.data().selectedCategoryName,
            categoryColor: res.data().color,
            postId: this.props.match.params.id,
            clientRead: res.data().clientRead,
            approved: res.data().approved
          });
        },
        () => {
          console.log(this.state);
        }
      );

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

  toggleIcon = e => {
    this.setState({
      showIcons: !this.state.showIcons
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

    this.props.firebase.adminSendMessage(
      localStorage.getItem('clientName'),
      month,
      day,
      title,
      message,
      logo
    );
  };

  componentWillUnmount() {
    this.props.firebase.editReadAdmin(
      localStorage.getItem('clientName'),
      this.state.postId,
      this.state.adminRead
    );
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
      console.log('type of values', item)
      const styles = {
        backgroundColor: this.state.categoryColor
      };
      return (
        <div className="d-flex row client-item" key={index}>
          <Row className="container mx-auto" gutter={30}>
            <Col span={12}>
              <div className="w-100 color-blue p-border">{item.title}</div>
              {item.images.length > 0 ? (
                <ImagePosts imageSrc={item.images} />
              ) : (
                <div className="red-main-outter flex-wrap d-flex">
                  <div id="red-outline-wrapper" className="w-100 mt-30">
                    <input
                      type="file"
                      multiple
                      onChange={this.addFile}
                      className="red-dashed-input"
                    />
                  </div>
                  <div className="small-red-wrapper"></div>
                  <div className="small-red-wrapper"></div>
                  <div className="small-red-wrapper"></div>
                </div>
              )}

              <div className="float-left">
                <div className="w-100 color-blue p-border copy-margin">POST COPY</div>
                <p>{item.copy}</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <div className="client-category"></div>
                <div className="w-100 color-blue p-border">PLATFORMS</div>
                <div id="client-social" className="d-flex">
                  {item.facebook && <p>Facebook</p>}
                  {item.instagram && <p>Instagram</p>}
                  {item.twitter && <p>Twitter</p>}
                  {item.linkedin && <p>Linkedin</p>}
                  {item.other && <p>Other</p>}
                </div>
                <Row className="blue-border pb-10">
                  <Col span={8} className="p-blue f-16">POST DATE</Col>
                  <Col span={8} className="p-blue f-16">POST TIME</Col>
                  <Col span={8} className="p-blue f-16">POST MEDIUM</Col>
                </Row>
                <Row>
                  <Col span={8}>{item.ipDate}</Col>
                  <Col span={8}>{item.postTime}</Col>
                  <Col span={8}>{item.postMedium}</Col>
                </Row>
                <Row className="blue-border">
                  <Col span={12} className="p-blue f-16">AD OR SPONSORED POST</Col>
                </Row>
                 <Row>
                  <Col span={18} className="color-grey f-14">{item.budgetStart} - {item.budgetEnd}</Col>
                  <Col span={6} className="color-grey f-14"><span className="f-16 color-blue">BUDGET:</span>${item.budget}</Col>
                </Row>
                <Row className="blue-border">
                  <Col span={12} className="p-blue f-16">HASHTAGS</Col>
                </Row>
                <Row>
                  <Col span={12} className="color-grey f-14">{item.postHashTag}</Col>
                </Row>
                <Row className="blue-border">
                  <Col span={12} className="p-blue f-16">Links</Col>
                </Row>
                <Row>
                  {item.values.map((innerItem) => (
                    <Col span={23} className="color-grey f-14"><a className="color-grey" target="_blank" href={`https://www.${innerItem.value}`}>{innerItem.value}</a></Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      );
    });

    return (
      <React.Fragment>
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <div className="fixed-bottom container position_relative col-md-4">
                {this.state.showChat && (
                  <div className="inner-chat-log bg-white position-relative">
                    <AdminChatLog
                      messages={this.state.messages}
                      deletePost={this.deletePostParent}
                    />
                    <form onSubmit={this.submitMessage} className="d-flex mt-30 position-relative">
                      <textarea
                        onChange={this.setMessage}
                        value={this.state.message}
                        onKeyDown={this.captureKey.bind(this)}
                      />
                    </form>
                    <button
                      type="button"
                      onClick={this.toggleIcon.bind(this)}
                      className="clear-btn position-absolute happy-btn"
                    >
                      <i className="fas fa-smile-beam"></i>
                    </button>
                    <span className={this.state.showIcons ? 'hidden' : 'not-hidden'}>
                      <Picker onSelect={this.addEmoji} />
                    </span>
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
