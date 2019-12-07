import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './index.css';
import Icons from '../Icons';
import Ad from '../Ad';
import { Checkbox } from 'antd';
import ImagePosts from '../ImagePosts';
import app from 'firebase/app';
import { Modal } from 'antd';

let timer = 0;
let delay = 200;
let prevent = false;

class HiddenCalendarSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      clientId: '',
      image: '',
      approved: false
    };

    this.toggleIsHidden = this.toggleIsHidden.bind(this);
    this.db = app.firestore();
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  componentDidMount() {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get('clientId');

    this.setState({
      clientId: c,
      approved: this.props.approved
    });
  }

  toggleIsHidden = () => {
    let me = this;
    timer = setTimeout(function() {
      if (!prevent) {
        me.doClickAction();
      }
      prevent = false;
    }, delay);
  };

  doClickAction() {
    this.setState({
      visible: true
    });
  }

  handleApproval = () => {
    this.setState({
      approved: !this.state.approved
    });
    this.db
      .collection('users')
      .doc(this.props.clientId)
      .collection('posts')
      .doc(this.props.itemId)
      .update({
        approved: !this.state.approved
      });
  };

  truncate = input => (input.length > 200 ? `${input.substring(0, 200)}...` : input);

  handleColor = string => {
    if (string !== undefined) {
      return string.split('|||')[0];
    }
  };

  ellipse = text => {
    let ellipseText;
    if (text.length > 8) {
      ellipseText = `${text.substring(0, 8) + '...'}`;
    } else {
      ellipseText = text;
    }
    return <React.Fragment>{ellipseText}</React.Fragment>;
  };

  render() {
    const hiddenPost = () => {
      const date = new Date(this.props.ipDate);
      let string = this.props.copy;
      let maxLength = 200;
      let trimmedString = string.substr(0, maxLength);
      trimmedString = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
      );
      return (
        <div className="hidden-inner">
          <h4 className="text-center">{this.props.title}</h4>
          <div className="social-wrapper d-flex justify-content-center">
            {this.props.facebook === true && <p>Facebook</p>}
            {this.props.instagram === true && <p>Instagram</p>}
            {this.props.linkedin === true && <p>LinkedIn</p>}
            {this.props.twitter === true && <p>Twitter</p>}
            {this.props.other === true && <p>Other</p>}
          </div>
          <p className="text-center">
            {date.toString().split('00')[0]} @ {this.props.ipDate}
          </p>
          <div className="d-flex">
            <div className="col-md-6 edit-form">
              <ImagePosts imageSrc={this.props.images} />
              {/* <img src={image} className="w-100" /> */}
              <p className="props-copy">{this.props.copy.substr(0, 200)}</p>
              <div>{this.props.hashtags}</div>
            </div>
            <div className="col-md-6">
              <div className="d-flex approval-wrapper">
                <Checkbox
                  name="approved"
                  onChange={this.handleApproval}
                  id="approvePost"
                  checked={this.state.approved}
                />
                <label for="approvePost" className="color-blue">
                  APPROVE POST
                </label>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              to={`/edit-post/${this.props.postId}/${this.props.clientId}`}
              className="save-draft-btn color-red"
            >
              VIEW POST
            </Link>
          </div>
        </div>
      );
    };

    const buttonStyle = {
      background: this.props.selectedCategory
    };
    return (
      <React.Fragment>
        <div className="d-flex align-items-center">
          <button onClick={this.toggleIsHidden} style={buttonStyle} className="label-button">
            {this.ellipse(this.props.title)}
            {this.props.adminRead != false ? '' : ''}
          </button>
          <Ad ad={this.props.ad} className="ad-icon" />
          <Icons
            approved={this.props.approved}
            clientRead={this.props.clientRead}
            clientNotifcation={this.props.clientNotifcation}
            adminNotification={this.props.adminNotifcation}
          />
        </div>
        <Modal className="outter-modal"  footer={null} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} cancelButtonProps={{ style: { display: 'none' } }}>
          <div className="hidden-post">{hiddenPost()}</div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(HiddenCalendarSingle));
