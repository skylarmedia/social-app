import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './index.css';
import { Checkbox } from 'antd';

let timer = 0;
let delay = 200;
let prevent = false;

class HiddenCalendarSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHiddenCalendar: false,
      clientId: '',
      image: ''
    };

    this.toggleIsHidden = this.toggleIsHidden.bind(this);
  }

  componentWillMount() {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get('clientId');

    this.setState({
      clientId: c
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps, 'prev props');
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
      isHiddenCalendar: !this.state.isHiddenCalendar
    });
  }

  doDoubleClickAction() {
    // if(this.props)
    let friendlyUrl = 'test';
    this.props.push.push(
      `/admin-view-post/${this.props.month}/${this.props.day}/${friendlyUrl}/${this.props.clientId}/${this.props.itemId}`
    );
  }

  handleDoubleClick() {
    clearTimeout(timer);
    prevent = true;
    this.doDoubleClickAction();
  }

  truncate = input => (input.length > 200 ? `${input.substring(0, 200)}...` : input);

  handleColor = string => {
    if (string !== undefined) {
      return string.split('|||')[0];
    }
  };

  render() {
    const friendlyUrlTitle = 'test';

    const hiddenPost = () => {
      console.log('hiddenpost', this.props)
      console.log('props images', this.props.images);
      const date = new Date(this.props.ipDate);
      let string = this.props.copy;
      let maxLength = 200;
      let trimmedString = string.substr(0, maxLength);
      trimmedString = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
      );

      let image = this.props.images[0];
      return (
        <div className="hidden-inner">
          <h4 className="text-center">{this.props.title}</h4>
          <div class="social-wrapper d-flex justify-content-center">
            {this.props.facebook == true && <p>Facebook</p>}
            {this.props.instagram == true && <p>Instagram</p>}
            {this.props.linkedin == true && <p>LinkedIn</p>}
            {this.props.twitter == true && <p>Twitter</p>}
            {this.props.other == true && <p>Other</p>}
          </div>
          <p className="text-center">
            {date.toString().split('00')[0]} @ {this.props.ipDate}
          </p>
          <div className="d-flex">
            <div className="col-md-6">
              <img src={image} className="w-100"/>

              <p className="props-copy">{this.props.copy.substr(0, 200)}</p>
              <div>{this.props.hashtags}</div>
            </div>
            <div className="col-md-6">Label</div>
          </div>
          <div className="text-center">
          <Link to={`/edit-post/${this.props.postId}/${this.props.clientId}`} class="save-draft-btn">Edit Post</Link>
          </div>
        </div>
      );
    };

    const buttonStyle = {
      background: this.props.selectedCategory
    };
    return (
      <React.Fragment>
        <TransitionGroup component={null}>
          <div class="d-flex">
          <button
            onClick={this.toggleIsHidden}
            onDoubleClick={this.handleDoubleClick.bind(this)}
            style={buttonStyle}
            className="label-button"
          >
            {this.props.title}
            {this.props.adminRead != false ? '' : ''}
          </button>
          {this.props.ad && (
                                        <img src={require('../assets/ad.svg')} />
                                    )}
          </div>
          {this.state.isHiddenCalendar && (
            <CSSTransition classNames="dialog" timeout={300}>
              <div class="hidden-post">{hiddenPost()}</div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(HiddenCalendarSingle));
