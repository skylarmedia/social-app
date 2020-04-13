import React, { Component } from 'react';
import EditCategoryForm from '../EditCategoryForm';
import { Picker } from 'emoji-mart';
import AdminChatLog from '../ChatLog';
import './index.css';
import { Input, Spin, Checkbox, Popover, Button, Collapse, Row, Col, message } from 'antd';
import CustomCalendarComponent from '../CustomCalendarComponent';
import DatePicker from 'react-datepicker';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
import 'emoji-mart/css/emoji-mart.css';
import { withFirebase } from '../Firebase';
import app from 'firebase/app';
import ImagePosts from '../ImagePosts';
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
      showIcons: true,
      message: '',
      messages: [],
      currentMonth: null,
      currentYear: null,
      updatedMessages: false,
      postId: null,
      selectedCategory: null,
      selectedCategoryName: null,
      visible: false,
      color: null
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

  handleVisibleChange = visible => {
    this.setState({ visible });
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

  unsubscribe = () =>
    this.db
      .collection('chats')
      .doc(this.props.match.params.postId)
      .collection('messages')
      .where('postId', '==', this.props.match.params.clientId)
      .onSnapshot(snap => {
        const messageArr = [...this.state.messages];
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            messageArr.push(change.doc.data());
            this.setState({
              messages: messageArr
            });
          }
        });
      });

  componentDidMount() {
    const updateAdminMessages = this.functions.httpsCallable('updateAdminMessages');
    let functionObj = {};
    functionObj.postId = this.props.match.params.clientId;
    functionObj.userId = this.props.match.params.postId;
    updateAdminMessages(functionObj);

    this.props.firebase
      .editPostFirebase(this.props.match.params.clientId, this.props.match.params.postId)
      .then(item => {
        if (this.state.posts.length === 0) {
          this.setState({
            posts: item.data().post,
            selectedCategoryName: item.data().selectedCategoryName,
            approved: item.data().approved,
            currentMonth: item.data().month,
            currentYear: item.data().year,
            postId: item.id,
            color: item.data().color
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
    if (this.state.updatedMessages === false) {
    }

    this.setState({
      showChat: !this.state.showChat
    });
  };

  submitMessage = e => {
    e.preventDefault();
  };

  handleBudget = e => {};

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
        this.state.currentYear, // Year to count messages
        null
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

  getSelectedCategoryParent = (color, name) => {
    this.setState({
      selectedCategory: color,
      selectedCategoryName: name
    });
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

  clearMessages = (id) => {
    const clearClientMessages = this.functions.httpsCallable('clearClientMessages');
    const clearObj = {};
    clearObj.id = id;
    clearObj.postId = this.state.postId;
    clearClientMessages(clearObj);
    this.setState({
      messages: []
    });
  };

  createUI() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <input type="text" value={el.value || ''} onChange={this.handleLinks.bind(this, i)} />
        <input type="button" value="remove" onClick={this.removeClick.bind(this, i)} />
      </div>
    ));
  }

  toggleIcon = e => {
    this.setState({
      showIcons: !this.state.showIcons
    });
  };

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  addClick(i) {
    this.setState(prevState => ({
      values: [...prevState.posts[i].values, { value: null }]
    }));
  }

  saveDraft = () => {
    this.db
      .collection('users')
      .doc(this.props.match.params.postId)
      .collection('posts')
      .doc(this.props.match.params.clientId)
      .update({
        draft: true
      })
      .then(() => {
        this.props.history.push(
          `/calendar/${this.state.currentYear}/${this.state.currentMonth}/${this.props.match.params.postId}`
        );
      });
  };

  deletePost = () => {
    this.db
      .collection('users')
      .doc(this.props.match.params.postId)
      .collection('posts')
      .doc(this.props.match.params.clientId)
      .delete()
      .then(() => {
        message.success("Post Successfully Deleted");
        this.props.history.push(
          `/calendar/${this.state.currentYear}/${this.state.currentMonth}/${this.props.match.params.postId}`
        );
      }, err => {
        message.success("Failed Deleting Post");
      });
  };

  render() {
    const genExtra = () => <img src={require('../assets/arrow.svg')} alt="arrow icon" />;
    const posts = this.state.posts.map((post, index) => {
      return (
        <React.Fragment key={index}>
          <div className="edit-form-main-wrapper" key={index}>
            <Row className="container d-flex row mx-auto p-0" gutter={30}>
              <Col span={12}>
                <Input
                  className="outlined-title blue-input"
                  label="Post Title"
                  name="title"
                  index={index}
                  value={this.state.posts[index].title}
                  onChange={this.handleTitle}
                  margin="normal"
                />
                <div>
                  {this.state.posts[index].images.length > 0 ? (
                    <ImagePosts
                      imageSrc={this.state.posts[index].images}
                      className="upload-files-wrapper"
                    />
                  ) : (
                    <div id="red-outline-wrapper" className="w-100 mb-20">
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
              </Col>
              <Col span={12}>
                <div className="d-flex justify-content-between mb-20 edit-social-icons">
                  <div>
                    <Checkbox
                      type="checkbox"
                      name="facebook"
                      value={this.state.posts[index].facebook}
                      checked={this.state.posts[index].facebook}
                      onChange={this.handleFacebook}
                      index={index}
                      id={`facebook-${index}`}
                    />
                    <label for={`facebook-${index}`}>Facebook</label>
                  </div>
                  <div>
                    <Checkbox
                      type="checkbox"
                      name="instagram"
                      value={this.state.posts[index].instagram}
                      checked={this.state.posts[index].instagram}
                      onChange={this.handleInstagram}
                      index={index}
                      id={`instagram-${index}`}
                    />
                    <label for={`instagram-${index}`}>Instagram</label>
                  </div>
                  <div>
                    <Checkbox
                      type="checkbox"
                      name="twitter"
                      value={this.state.posts[index].twitter}
                      checked={this.state.posts[index].twitter}
                      onChange={this.handleTwitter}
                      index={index}
                      id={`twitter-${index}`}
                    />
                    <label for={`twitter-${index}`}>Twitter</label>
                  </div>
                  <div>
                    <Checkbox
                      type="checkbox"
                      name="linkedin"
                      value={this.state.posts[index].linkedin}
                      checked={this.state.posts[index].linkedin}
                      onChange={this.handleLinkedin}
                      index={index}
                      id={`linkedin-${index}`}
                    />
                    <label for={`linkedin-${index}`}>LinkedIn</label>
                  </div>
                  <div>
                    <Checkbox
                      type="checkbox"
                      name="other"
                      value={this.state.posts[index].other}
                      checked={this.state.posts[index].other}
                      onChange={this.handleOther}
                      index={index}
                      id={`other-${index}`}
                    />
                    <label id={`other-${index}`}>Other</label>
                  </div>
                </div>
                <div className="date-button-wrapper d-flex row justify-content-between">
                  <div id="choose-date-wrapper" className="col-sm-4">
                    <Collapse className="post-collapse">
                      <Panel header="POST DATE" extra={genExtra()} showArrow={false}>
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
                      id={`ad-${index}`}
                      index={index}
                    />

                    <label className="color-blue ad-edit" for={`ad-${index}`}>
                      Ad or Sponsored Post
                    </label>
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

                        {i === this.state.posts[index].values.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => this.addClick(index)}
                            className="clear-btn"
                          >
                            <img src={require('../assets/select.svg')} alt="select icon" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => this.removeClick(i)}
                            className="clear-btn"
                          >
                            <img src={require('../assets/x.png')} alt="x-icon" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
              <Row className="edit-btn-wrapper" gutter={10}>
                <Col>
                  <button onClick={this.saveDraft} className="save-draft-btn color-red">
                    SAVE DRAFT
                  </button>
                </Col>
                <Col>
                  <button onClick={this.submitEdits} className={'add-date-btn'}>
                    SAVE
                  </button>
                </Col>
                <Col span={24} className="mt-30 text-center">
                  <button type="button" className="clear-btn p-blue" onClick={this.deletePost}>
                    <u>Delete Post</u>
                  </button>
                </Col>
              </Row>
            </Row>
          </div>
        </React.Fragment>
      );
    });
    let content = (
      <button
        type="button"
        className="clear-btn d-flex"
        onClick={() =>
          this.clearMessages(this.props.match.params.postId, this.props.match.params.clientId)
        }
      >
        <i className="fas fa-trash"></i>
        <span className="ml-10">CLEAR</span>
      </button>
    );

    return (
      <div className="add-post edit-post">
        <p className="heading text-center add-post-heading p-blue">
          Client {this.props.match.params.postId} Calendar
          <br />
        </p>
        <div className="">
          <div className="d-flex approval-wrapper">
            <div className="container d-flex align-items-center">
              <EditCategoryForm
                clientId={this.props.match.params.postId}
                getSelectedCategory={this.getSelectedCategoryParent}
                category={this.state.selectedCategory}
                currentCat={this.state.selectedCategoryName}
                color={this.state.color}
              />
              <Checkbox
                name="approved"
                value={this.state.approved}
                onChange={this.handleApproval}
                checked={this.state.approved}
                id="approvePost"
              />
              <label className="color-blue m-0" htmlFor="approvePost">
                APPROVE POST
              </label>
            </div>
          </div>
          {this.state.posts.length > 0 ? posts : <div class="text-center mt-20"><Spin size="large" /></div>}
        </div>
        <div className="fixed-bottom container position_relative col-md-4">
          <div hidden={this.state.showChat}>
            <div className="d-flex flex-column align-items-end">
              <div className="inner-chat-log bg-white position-relative">
                <AdminChatLog
                  deletePost={this.deletePostParent}
                  adminClient={this.props.match.params.postId}
                  messages={this.state.messages}
                />
                <form onSubmit={this.submitMessage} className="d-flex mt-30 position-relative">
                  <textarea
                    onChange={this.setMessage}
                    value={this.state.message}
                    onKeyDown={this.captureKey}
                  />
                  <button
                    type="button"
                    onClick={this.toggleIcon.bind(this)}
                    className="clear-btn position-absolute happy-btn"
                  >
                    <i className="fas fa-smile-beam"></i>
                  </button>
                  <Popover
                    placement="topRight"
                    content={content}
                    trigger="click"
                    className="position-absolute"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <Button className="clear-btn clear-message-button position-absolute send-clear">
                      <i className="fas fa-ellipsis-v"></i>
                    </Button>
                  </Popover>
                </form>
              </div>
              <span className={this.state.showIcons ? 'hidden' : 'not-hidden'}>
                <Picker onSelect={this.addEmoji} />
              </span>
            </div>
          </div>

          <button onClick={this.toggleChat} type="button" className="clear-btn">
            <img src={require('../assets/chatbox.svg')} alt="chatbox icon" />
          </button>
        </div>
      </div>
    );
  }
}

export default withFirebase(EditPost);
