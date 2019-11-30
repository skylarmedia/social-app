import React, { Component } from 'react';
import EditCategoryForm from '../EditCategoryForm';
import { Picker } from 'emoji-mart';
import AdminChatLog from '../ChatLog';
import './index.css';
import { Input } from 'antd';
import { Checkbox } from 'antd';
import CustomCalendarComponent from '../CustomCalendarComponent';
import DatePicker from 'react-datepicker';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
import 'emoji-mart/css/emoji-mart.css';
import { withFirebase } from '../Firebase';
import { Collapse } from 'antd';
import app from 'firebase/app';
const { TextArea } = Input;
const { Panel } = Collapse;

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      currentTime: null,
      approved: false,
      showChat: false,
      message: '',
      messages: [],
      currentMonth: null,
      currentYear: null,
      updatedMessages: false
    };

    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handlePostMedium = this.handlePostMedium.bind(this);
    this.handleAd = this.handleAd.bind(this);
    this.handleHashTags = this.handleHashTags.bind(this);
    this.submitEdits = this.submitEdits.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleBudget = this.handleBudget.bind(this);

    this.db = app.firestore();
    this.functions = app.functions();
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
    let index = e.target.getAttribute('index');

    let state = [...this.state.posts];
    state[index].title = e.target.value;

    this.setState({
      posts: state
    });
  };

  handleCopy = e => {
    let index = e.target.getAttribute('index');
    let state = [...this.state.posts];
    state[index].copy = e.target.value;

    this.setState({
      posts: state
    });
  };

  getNumberOfMessages = () => {
    this.props.firebase
      .countClientMessages(
        this.props.match.params.clientId,
        this.state.currentMonth,
        this.state.currentYear
      )
      .then(snapshot => {
        console.log('snapshot in months', snapshot);
        snapshot.docs.map(item => {
          console.log('item month data', item.data());
        });
      });
  };

  unsubscribe = () =>
    this.db
      .collection('chats')
      .doc(this.props.match.params.postId)
      .collection('messages')
      .where('postId', '==', this.props.match.params.clientId)
      .onSnapshot(snap => {
        const messageArr = [...this.state.messages];
        snap.docChanges().forEach(change => {
          if (change.type == 'added') {
            console.log('CHANGE DETECTED', change);
            messageArr.push(change.doc.data());
            this.setState({
              messages: messageArr
            });
          }
        });
      });

  componentWillMount() {
    const updateAdminMessages = this.functions.httpsCallable('updateAdminMessages');
    let newId = this.props.match.params.id;
    let functionObj = new Object();
    functionObj.postId = this.props.match.params.clientId;
    functionObj.userId = this.props.match.params.postId;
    updateAdminMessages(functionObj);

    this.props.firebase
      .editPostFirebase(this.props.match.params.clientId, this.props.match.params.postId)
      .then(item => {
        if (this.state.posts.length == 0) {
          this.setState({
            posts: item.data().post,
            selectedCategoryName: item.data().selectedCategoryName,
            approved: item.data().approved,
            currentMonth: item.data().month,
            curretYear: item.data().year
          });
        }
      });

    this.unsubscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  deletePostParent = index => {
    this.setState({
      messages: this.state.messages.filter((_, i) => i !== index)
    });
  };

  submitEdits = () => {
    this.props.firebase.updatePost(
      this.props.match.params.postId,
      this.props.match.params.clientId,
      this.state.posts,
      this.state.approved
    );
    this.props.history.goBack();
  };

  // Social Handles

  handleFacebook = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];
    posts[index].facebook = !posts[index].facebook;
    this.setState({
      posts: posts
    });
  };

  handleInstagram = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];
    posts[index].instagram = !posts[index].instagram;
    this.setState({
      posts: posts
    });
  };

  handleTwitter = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];
    posts[index].twitter = !posts[index].twitter;
    this.setState({
      posts: posts
    });
  };

  handleLinkedin = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];
    posts[index].linkedin = !posts[index].linkedin;
    this.setState({
      posts: posts
    });
  };

  handleApproval = e => {
    this.setState({
      approved: !this.state.approved
    });
  };

  handleOther = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];
    posts[index].other = !posts[index].other;
    this.setState({
      posts: posts
    });
  };

  handleAd = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];

    posts[index].ad = !posts[index].ad;
    this.setState({
      posts: posts
    });
  };

  handleComplete = index => {
    let posts = [...this.state.posts];
    posts[index].postTime = this.state.currentTime;
    this.setState({
      posts: posts
    });
  };

  handlePostTime = (time, timePicker) => {
    this.setState({
      currentTime: timePicker
    });
  };

  toggleChat = () => {
    if (this.state.updatedMessages == false) {
    }

    this.setState({
      showChat: !this.state.showChat
    });
  };

  submitMessage = e => {
    e.preventDefault();
    alert('submitted');
  };

  handleBudget = e => {
    console.log('event', e);
    // let posts = [...this.state.posts];
    // posts[i].budget = moment(val).format('MM/DD/YYYY');
    // this.setState({
    //   posts: posts
    // });
  };

  // Capture Key

  captureKey = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.firebase.adminSendMessage(
        true,
        moment(new Date()).format('DD/MM/YYYY'), // Date,
        this.formatAMPM(new Date()),
        this.props.match.params.postId, // Client
        this.state.message, // Message
        this.props.match.params.clientId,
        moment().unix(),
        this.state.currentMonth, // Month to count messages,
        this.state.currentYear // Year to count messages
      );
      this.setState({
        message: ''
      });
    }

    this.props.firebase.updateClientNotification(
      this.props.match.params.postId, // Client,
      this.props.match.params.clientId
    );
  };

  handleStartDpChange(val, i) {
    let posts = [...this.state.posts];
    posts[i].budgetStart = moment(val).format('MM/DD/YYYY');
    this.setState({
      posts: posts
    });
  }

  handleEndDpChange(val, i) {
    let posts = [...this.state.posts];
    posts[i].budgetEnd = moment(val).format('MM/DD/YYYY');
    this.setState({
      posts: posts
    });
  }

  handleAd = e => {
    let index = e.target.index;
    let posts = [...this.state.posts];

    posts[index].ad = !posts[index].ad;
    this.setState({
      posts: posts
    });
  };

  addEmoji = e => {
    if (e.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${e.unified}`);
      this.setState({
        message: this.state.message + emojiPic
      });
    } else {
      let sym = e.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({
        message: this.state.message + emojiPic
      });
    }
  };

  setMessage = e => {
    e.preventDefault();
    this.setState({
      message: e.target.value
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

  handleLinks(event) {
    console.log('i handle links', event)
    // let values = [...this.state.values];
    // values[i].value = event.target.value;
    // this.setState({ values });
  }

  createUI() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <input type="text" value={el.value || ''} onChange={this.handleLinks.bind(this, i)} />
        <input type="button" value="remove" onClick={this.removeClick.bind(this, i)} />
      </div>
    ));
  }

  // removeClick(i) {
  //   let values = [...this.state.values];
  //   values.splice(i, 1);
  //   this.setState({ values });
  // }

  addClick(i) {
    // let posts = [...this.state.posts];
    // posts[index].postTime = this.state.currentTime;
    // this.setState({
    //   posts: posts
    // });
    // posts[index].linkedin = !posts[index].linkedin;

    console.log('STATE in ad form', i)
    let posts = [...this.state.posts];
    posts[i].values = posts[i].values
    // this.setState(prevState => ({
    //   values: [...prevState.posts[i].values, { value: null }]
    // }));
  }

  render() {
    console.log('POSTS', this.state.posts);
    const posts = this.state.posts.map((post, index) => {
      let image = this.state.posts[index].images.map((item, index) => {
        return (
          <div key={index}>
            <img src={item} key={item} />
          </div>
        );
      });
      return (
        <div className="d-flex row edit-form-main-wrapper">
          <div className="col-sm-6">
            <Input
              className="outlined-title blue-input"
              label="Post Title"
              name="title"
              index={index}
              value={this.state.posts[index].title}
              onChange={this.handleTitle}
              margin="normal"
            />
            <div className="upload-files-wrapper d-flex flex-wrap">
              {image.length > 0 ? (
                image
              ) : (
                <div id="red-outline-wrapper">
                  <div className="red-center">
                    <input
                      type="file"
                      multiple
                      onChange={this.addFile}
                      className="red-dashed-input"
                    />
                  </div>
                </div>
              )}
            </div>
            <TextArea
              className="blue-input copy-input"
              placeholder="Copy"
              name="copy"
              value={this.state.posts[index].copy}
              onChange={this.handleCopy}
              margin="normal"
              variant="outlined"
              index={index}
            />
          </div>
          <div className="col-sm-6">
            <EditCategoryForm
              clientId={this.props.match.params.postId}
              getSelectedCategory={this.getSelectedCategory}
              category={this.state.selectedCategory}
              currentCat={this.state.selectedCategoryName}
            />
            <div className="d-flex justify-content-between mb-20 edit-social-icons">
              <div>
                <Checkbox
                  type="checkbox"
                  name="facebook"
                  value={this.state.posts[index].facebook}
                  checked={this.state.posts[index].facebook}
                  onChange={this.handleFacebook}
                  index={index}
                />
                <label>Facebook</label>
              </div>
              <div>
                <Checkbox
                  type="checkbox"
                  name="instagram"
                  value={this.state.posts[index].instagram}
                  checked={this.state.posts[index].instagram}
                  onChange={this.handleInstagram}
                  index={index}
                />
                <label>Instagram</label>
              </div>
              <div>
                <Checkbox
                  type="checkbox"
                  name="twitter"
                  value={this.state.posts[index].twitter}
                  checked={this.state.posts[index].twitter}
                  onChange={this.handleTwitter}
                  index={index}
                />
                <label>Twitter</label>
              </div>
              <div>
                <Checkbox
                  type="checkbox"
                  name="linkedin"
                  value={this.state.posts[index].linkedin}
                  checked={this.state.posts[index].linkedin}
                  onChange={this.handleLinkedin}
                  index={index}
                />
                <label>LinkedIn</label>
              </div>
              <div>
                <Checkbox
                  type="checkbox"
                  name="other"
                  value={this.state.posts[index].other}
                  checked={this.state.posts[index].other}
                  onChange={this.handleOther}
                  index={index}
                />
                <label>Other</label>
              </div>
            </div>
            <div className="date-button-wrapper d-flex row justify-content-between">
              <div id="choose-date-wrapper" className="col-sm-4">
                <Collapse className="post-collapse">
                  <Panel header="POST DATE">
                    <DatePicker
                      selected={this.state.dpDate}
                      placeholderText="Post Date"
                      onChange={value => this.handleDPChange(value)}
                      customInput={
                        <CustomCalendarComponent
                          ipDate={this.state.posts[index].ipDate}
                          placeholderText="Post Date"
                          handleIpChange={val => this.handleIpChange(val, index)}
                        />
                      }
                      dateFormat={'MM/dd/yyyy'}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </Panel>
                </Collapse>
              </div>
              <div className="col-sm-4">
                <TimePicker
                  index={index}
                  onOpenChange={() => this.handleComplete(index)}
                  onChange={this.handlePostTime}
                  placeholder="POST TIME"
                  defaultValue={moment(`${this.state.posts[index].postTime}`, 'HH:mm:ss')}
                />
              </div>
              <div className="col-sm-4">
                <Input
                  type="text"
                  placeholder="POST MEDIUM"
                  name="postMedium"
                  className="blue-input"
                  value={this.state.posts[index].postMedium}
                  onChange={this.handlePostMedium}
                  index={index}
                />
              </div>
            </div>
            <div className="mt-20 edit-ad">
              <div className="sponsored-label">
                <Checkbox
                  checked={this.state.posts[index].ad}
                  onChange={this.handleAd}
                  id="ad"
                  index={index}
                />

                <label className="color-blue ad-edit">Ad or Sponsored Post</label>
              </div>
              {this.state.posts[index].ad && (
                <div className="col-md-12 row mt-20 mb-20">
                  <div
                    className="
                  d-flex justify-content-between date-picker-wrapper flex-85 align-items-center
                  inner-form-wrapper2
                  "
                  >
                    <DatePicker
                      selected={new Date(this.state.posts[index].budgetStart)}
                      placeholderText="Post Date"
                      onChange={value => this.handleStartDpChange(value, index)}
                      dateFormat={'MM/dd/yyyy'}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="select-edit"
                    />
                    <span>-</span>
                    <DatePicker
                      selected={new Date(this.state.posts[index].budgetEnd)}
                      placeholderText="Post Date"
                      onChange={value => this.handleEndDpChange(value, index)}
                      dateFormat={'MM/dd/yyyy'}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="select-edit"
                    />
                  </div>
                  <div className="d-flex flex-85 align-items-center mt-20">
                    <label className="budget-text">Budget</label>
                    <input
                      type="text"
                      value={this.state.posts[index].budget}
                      placeholder="$0.00"
                      name="budget"
                      className="budget-input"
                      onChange={this.handleBudget}
                      index={index}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <TextArea
                placeholder="Hashtags"
                value={this.state.posts[index].postHashTag}
                name="postHashTag"
                onChange={this.handleHashTags}
                index={index}
                className="blue-input"
              />
            </div>

            <div>
              {this.state.posts[index].values.map((el, i) => (
                <div key={i}>
                  <div className="d-flex align-self-center ant-link">
                    <Input
                      className="blue-input"
                      placeholder="ADD LINKS"
                      name={`link-${i}`}
                      value={el.value || ''}
                      onChange={e => this.handleLinks(e)}
                      margin="normal"
                      variant="outlined"
                      index={i}
                    />

                    {i == this.state.posts[index].values.length - 1 ? (
                      <button type="button" onClick={() => this.addClick(index)} className="clear-btn">
                        <img src={require('../assets/select.svg')} />
                      </button>
                    ) : (
                      <input type="button" value="remove" onClick={() => this.removeClick(i)} />
                    )}
                  </div>
                </div>
              ))}
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
        <div className="d-flex approval-wrapper">
          <Checkbox
            name="approved"
            value={this.state.approved}
            onChange={this.handleApproval}
            checked={this.state.approved}
            id="approvePost"
          />
          <label className="color-blue">APPROVE POST</label>
        </div>
        {posts}
        <div className="fixed-bottom container position_relative col-md-4">
          {this.state.showChat && (
            <div>
              <div>
                <AdminChatLog
                  deletePost={this.deletePostParent}
                  adminClient={this.props.match.params.postId}
                  messages={this.state.messages}
                />
                <form onSubmit={this.submitMessage}>
                  <textarea
                    onChange={this.setMessage}
                    value={this.state.message}
                    onKeyDown={this.captureKey}
                  />
                </form>
                <span>
                  <Picker onSelect={this.addEmoji} />
                </span>
              </div>
            </div>
          )}
          <button onClick={this.toggleChat} type="button">
            <img src={require('../assets/chatbox.svg')} />
          </button>
        </div>
      </div>
    );
  }
}

export default withFirebase(EditPost);
