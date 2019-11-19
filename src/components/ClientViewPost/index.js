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
      color: '#fff'
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.approveFormSubmit = this.approveFormSubmit.bind(this);
  }

  componentWillMount() {
    app
      .firestore()
      .collection('users')
      .doc(this.state.userId)
      .collection('posts')
      .doc(this.props.match.params.id)
      .get()
      .then(res => {
        this.setState(
          {
            posts: res.data().post,
            category: res.data().selectedCategoryName,
            categoryColor: res.data().color
          },
          () => {
            console.log('RES', res.data());
          }
        );
      });

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

    const posts = this.state.posts.map(item => {
      const styles = {
        backgroundColor: this.state.categoryColor
      };
      return (
        <div className="d-flex">
          {/* <div className="col-sm-6">
            <p>{item.title}</p>
            <p>Post Copy</p>
            <p>{item.copy}</p>
          </div>
          <div className="col-sm-6 d-flex flex-wrap">
            <div style={styles} className="col-sm-6 align-self-center">
              {this.state.category}
            </div>
            <div className="col-sm-6 d-flex align-items-center">
              <input type="checkbox" checked={item.approved} />
              <label>APPROVE POST</label>
            </div>
            <div className="d-flex flex-column">
              <div>PLATFORMS</div>
              <div className="d-flex row col-sm-12">
                <div>{item.facebook && (<p>Facebook</p>)}</div>
                <div>{item.instagram && (<p>Instagram</p>)}</div>
                <div>{item.twitter && (<p>Twitter</p>)}</div>
                <div>{item.linkedin && (<p>Linkedin</p>)}</div>
                <div>{item.other && (<p>Other</p>)}</div>
              </div>
            </div>

            <div className="row justify-content-between col-sm-12">
              <div className="col-sm-4">POST DATE</div>
              <div className="col-sm-4">POST TIME</div>
              <div className="col-sm-4">POST MEDIUM</div>
            </div>
            <div className="row justify-content-between col-sm-12">
              <div className="col-sm-4">{item.ipDate}</div>
              <div className="col-sm-4">{item.postTime}</div>
              <div className="col-sm-4">POST MEDIUM</div>
            </div>
          </div>

          <div /> */}
        </div>
      );
    });

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
              {this.state.posts && <p>{posts}</p>}
            </div>
          )}
        </AuthUserContext.Consumer>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(ClientViewPost));
