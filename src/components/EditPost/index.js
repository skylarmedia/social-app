import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import TimePicker from 'react-time-picker';
import EditCategoryForm from '../EditCategoryForm';
import * as ROUTES from '../../constants/routes';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import './index.css';

import TextField from '@material-ui/core/TextField';
import CustomCalendarComponent from '../CustomCalendarComponent';
import DatePicker from 'react-datepicker';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      currentTime: null,
      approved: false
    };

    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handlePostMedium = this.handlePostMedium.bind(this);
    this.handleAd = this.handleAd.bind(this);
    this.handleHashTags = this.handleHashTags.bind(this);
    this.submitEdits = this.submitEdits.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handlePostMedium = e => {
    let index = e.target.getAttribute('index');
    let state = [...this.state.posts];
    state[index].postMedium = e.target.value;

    this.setState({
      posts: state
    });
  };

  handleHashTags = e => {
    let index = e.target.getAttribute('index');
    let state = [...this.state.posts];
    state[index].postHashTag = e.target.value;

    this.setState({
      posts: state
    });
  };

  handleTitle = e => {
    // console.log(e.target.name)
    let index = e.target.getAttribute('index');
    console.log('HANDLE e', e.target.getAttribute('index'));

    let state = [...this.state.posts];
    state[index].title = e.target.value;

    this.setState({
      posts: state
    });

    console.log('this state', this.state);
  };

  handleCopy = e => {
    let index = e.target.getAttribute('index');
    console.log('HANDLE e', e.target.getAttribute('index'));

    let state = [...this.state.posts];
    state[index].copy = e.target.value;

    this.setState({
      posts: state
    });
  };

  componentWillMount() {
    this.props.firebase
      .editPostFirebase(this.props.match.params.clientId, this.props.match.params.postId)
      .then(item => {
        if (this.state.posts.length == 0) {
          this.setState(
            {
              posts: item.data().post,
              selectedCategoryName: item.data().selectedCategoryName,
              approved: item.data().approved
            },
            () => {
              console.log(this.state.posts);
            }
          );
        }
      });
  }

  submitEdits = () => {
    this.props.firebase.updatePost(
      this.props.match.params.postId,
      this.props.match.params.clientId,
      this.state.posts
    );
    this.props.history.goBack()
  };

  // Social Handles

  handleFacebook = e => {
    console.log('FACEBOOK', e.currentTarget);
    let index = e.target.getAttribute('index');
    console.log(index);
    let posts = [...this.state.posts];
    posts[index].facebook = !posts[index].facebook;
    this.setState({
      posts: posts
    });
  };

  handleInstagram = e => {
    console.log('FACEBOOK', e.currentTarget);
    let index = e.target.getAttribute('index');
    console.log(index);
    let posts = [...this.state.posts];
    posts[index].instagram = !posts[index].instagram;
    this.setState({
      posts: posts
    });
  };

  handleTwitter = e => {
    console.log('FACEBOOK', e.currentTarget);
    let index = e.target.getAttribute('index');
    console.log(index);
    let posts = [...this.state.posts];
    posts[index].twitter = !posts[index].twitter;
    this.setState({
      posts: posts
    });
  };

  handleLinkedin = e => {
    console.log('FACEBOOK', e.currentTarget);
    let index = e.target.getAttribute('index');
    console.log(index);
    let posts = [...this.state.posts];
    posts[index].linkedin = !posts[index].linkedin;
    this.setState({
      posts: posts
    });
  };

  handleApproval = e => {
    let index = e.target.getAttribute('index');

    let posts = [...this.state.posts];

    posts[index].approved = !posts[index].approved;

    this.setState({
      posts: posts
    });
  };

  handleOther = e => {
    console.log('FACEBOOK', e.currentTarget);
    let index = e.target.getAttribute('index');
    console.log(index);
    let posts = [...this.state.posts];
    posts[index].other = !posts[index].other;
    this.setState({
      posts: posts
    });
  };

  handleAd = e => {
    let index = e.target.getAttribute('index');

    let posts = [...this.state.posts];

    posts[index].ad = !posts[index].ad;

    this.setState({
      posts: posts
    });
  };

  handleComplete = index => {
    let posts = [...this.state.posts];
    posts[index].postTime = this.state.currentTime;
    this.setState(
      {
        posts: posts
      },
      () => {
        console.log('POST TIME', this.state.posts);
      }
    );
  };

  handlePostTime = (time, timePicker) => {
    console.log(time);
    this.setState({
      currentTime: timePicker
    });
  };

  render() {
    const posts = this.state.posts.map((post, index) => {

      let image = this.state.posts[index].images.map(item => {
        return (
          <img src={item} />
        )
      })
      return (
        <div>
          <div>
            <input
              className="outlined-title"
              label="Post Title"
              name="title"
              index={index}
              newKey={index}
              value={this.state.posts[index].title}
              onChange={this.handleTitle}
              margin="normal"
            />
            <div />
            {image}
            <input
              className="outlined-copy"
              label="Copy"
              name="copy"
              multiline
              value={this.state.posts[index].copy}
              onChange={this.handleCopy}
              margin="normal"
              variant="outlined"
              index={index}
            />
            <EditCategoryForm
              clientId={this.props.match.params.postId}
              getSelectedCategory={this.getSelectedCategory}
              category={this.state.selectedCategory}
              currentCat={this.state.selectedCategoryName}
            />
            <div>
              <input
                type="checkbox"
                name="facebook"
                value={this.state.posts[index].facebook}
                checked={this.state.posts[index].facebook}
                onChange={this.handleFacebook}
                index={index}
              />
              <label for="facebook">Facebook</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="instagram"
                value={this.state.posts[index].instagram}
                checked={this.state.posts[index].instagram}
                onChange={this.handleInstagram}
                index={index}
              />
              <label for="instagram">Instagram</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="twitter"
                value={this.state.posts[index].twitter}
                checked={this.state.posts[index].twitter}
                onChange={this.handleTwitter}
                index={index}
              />
              <label for="twitter">Twitter</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="linkedin"
                value={this.state.posts[index].linkedin}
                checked={this.state.posts[index].linkedin}
                onChange={this.handleLinkedin}
                index={index}
              />
              <label for="linkedin">LinkedIn</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="other"
                value={this.state.posts[index].other}
                checked={this.state.posts[index].other}
                onChange={this.handleOther}
                index={index}
              />
              <label for="other">Other</label>
            </div>

            <DatePicker
              selected={this.state.dpDate}
              placeholderText="Post Date"
              onChange={value => this.handleDPChange(value)}
              customInput={
                <CustomCalendarComponent
                  ipDate={this.state.posts[index].ipDate}
                  placeholderText="Post Date"
                  handleIpChange={val => this.handleIpChange(val)}
                />
              }
              dateFormat={'MM/dd/yyyy'}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <TimePicker
              index={index}
              onOpenChange={() => this.handleComplete(index)}
              onChange={this.handlePostTime}
              defaultValue={moment(`${this.state.posts[index].postTime}`, 'HH:mm:ss')}
            />
            <input
              type="text"
              placeholder="POST MEDIUM"
              name="postMedium"
              value={this.state.posts[index].postMedium}
              onChange={this.handlePostMedium}
              index={index}
            />
            <div>
              <input
                type="checkbox"
                checked={this.state.posts[index].ad}
                onChange={this.handleAd}
                id="ad"
                index={index}
              />
              <label for="ad">Ad or Sponsored Post</label>
            </div>
            <div>

            </div>
            <div>
              <textarea
                placeholder="Hashtags"
                value={this.state.posts[index].postHashTag}
                name="postHashTag"
                onChange={this.handleHashTags}
                index={index}
              />
            </div>
            <button onClick={this.submitEdits} className="add-date-btn">
              Submit Edits
            </button>
          </div>
        </div>
      );
    });
    return (
      <div className="container add-post edit-post">
        <input
          type="checkbox"
          name="approved"
          value={this.state.approved}
          onChange={this.handleApproval}
          checked={this.state.approved}
          id="approvePost"
        />
        {posts}
      </div>
    );
  }
}

export default withFirebase(EditPost);
