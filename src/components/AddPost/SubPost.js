import React, { Component } from 'react';
import { TimePicker } from 'antd';
import { Checkbox } from 'antd';
import CustomCalendarComponent from '../CustomCalendarComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { withFirebase } from '../Firebase';
import moment from 'moment';
import EmojiField from 'emoji-picker-textfield';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { Collapse } from 'antd';
import ImagePosts from '../ImagePosts';
import { Input } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;


class SubPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      copy: '',
      postDate: new Date(),
      currentPost: [],
      showDatePicker: true,
      postTime: null,
      postMedium: '',
      ad: false,
      postHashTag: '',
      values: [{ value: null }],
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false,
      other: false,

      dpDate: moment().toDate(),
      ipDate: moment().format('MM/DD/YYYY'),

      startDpDate: moment().toDate(),
      startIpDate: moment().format('MM/DD/YYYY'),

      endDpDate: moment().toDate(),
      endIpDate: moment().format('MM/DD/YYYY'),

      completed: true,
      filesArr: [],
      file: [],
      metaImageFiles: [],
      showEmoji: false,
      budget: '',

      toggleDate: false,
      toggleTime: false
    };

    this.addForm = this.addForm.bind(this);
    this.handleSocialCheck = this.handleSocialCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDate = this.showDate.bind(this);
    this.handlePostTime = this.handlePostTime.bind(this);
    this.addFile = this.addFile.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.handleBudget = this.handleBudget.bind(this);
    this.openIcons = this.openIcons.bind(this);
  }

  // Beginning of upload methods

  uploadFiles = fb => {
    this.state.file.map((file, i) => {
      const storageRef = this.props.firebase.storage;
      const metadata = {
        contentType: file.type
      };
      return storageRef
        .child('images/' + file.name)
        .put(file, metadata)
        .then(snapshot => {
          const encodedUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodeURIComponent(
            snapshot.metadata.fullPath
          )}?alt=media`;
          this.setState({
            metaImageFiles: [...this.state.metaImageFiles, encodedUrl]
          });
        });
    });
  };

  toggleDate() {
    this.setState({
      toggleDate: !this.state.toggleDate
    });
  }

  toggleTime() {
    this.setState({
      toggleTime: !this.state.toggleTime
    });
  }

  addFile = event => {
    const file = Array.from(event.target.files);
    if (file.length === 1) {
      const emptyFileArr = [];
      file.map(innerFile => {
        return emptyFileArr.push(innerFile);
      });

      this.setState(
        {
          file: emptyFileArr
        },
        () => {
          this.uploadFiles(this.props.firebase);
        }
      );
    } else if (file.length > 1) {
      var emptyFileArr = [];
      file.map(innerFile => {
        return emptyFileArr.push(innerFile);
      });

      this.setState(
        {
          file: emptyFileArr
        },
        () => {
          this.uploadFiles();
        }
      );
    }
  };

  // End of upload methods

  openIcons = () => {
    this.setState({
      showEmoji: !this.state.showEmoji
    });
  };

  onSubmitForm = e => {
    e.preventDefault();
  };

  componentDidUpdate(prevProps) {
    if (this.props.completed !== prevProps.completed) {
      let postObj = {};
      postObj['title'] = this.state.title;
      postObj['copy'] = this.state.copy;
      postObj['postTime'] = this.state.postTime;
      postObj['postMedium'] = this.state.postMedium;
      postObj['ad'] = this.state.ad;
      postObj['postHashTag'] = this.state.postHashTag;
      postObj['values'] = this.state.values;
      postObj['facebook'] = this.state.facebook;
      postObj['twitter'] = this.state.twitter;
      postObj['instagram'] = this.state.instagram;
      postObj['linkedin'] = this.state.linkedin;
      postObj['other'] = this.state.other;
      postObj['postDate'] = this.state.dpDate;
      postObj['ipDate'] = this.state.ipDate;
      postObj['budgetStart'] = this.state.startIpDate;
      postObj['budgetEnd'] = this.state.endIpDate;
      postObj['budget'] = this.state.budget;
      postObj['images'] = this.state.metaImageFiles;

      this.props.triggerValues(postObj);
    }
  }

  addEmoji = e => {
    if (e.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${e.unified}`);
      this.setState({
        copy: this.state.copy + emojiPic
      });
    } else {
      let sym = e.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({
        copy: this.state.copy + emojiPic
      });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handlePostDate = date => {
    let postDateFormatted = date.toLocaleDateString('en-US');
    this.setState({
      postDate: postDateFormatted
    });
  };

  showDate = e => {
    e.preventDefault();
    this.setState({
      showDate: !this.showDate
    });
  };

  // BEGINNING OF EMOJI METHODS

  inputComponent = props => {
    return <EmojiField name="my-input" onChange={props.onChange} fieldType="input" />;
  };

  textAreaComponent = props => {
    return <EmojiField name="my-textarea" onChange={props.onChange} />;
  };
  addForm() {
    let postArr = {};
    postArr['title'] = this.state.title;
    postArr['copy'] = this.state.copy;
    postArr['postTime'] = this.state.postTime;
    postArr['postMedium'] = this.state.postMedium;
    postArr['ad'] = this.state.ad;
    postArr['postHashtag'] = this.state.postHashtag;
    postArr['values'] = this.state.values;
    postArr['facebook'] = this.state.facebook;
    postArr['twitter'] = this.state.twitter;
    postArr['instagram'] = this.state.instagram;
    postArr['linkedin'] = this.state.linkedin;
    postArr['other'] = this.state.other;
    postArr['postDate'] = this.state.dpDate;
    postArr['ipDate'] = this.state.ipDate;
    postArr['budget'] = this.state.budget;
  }

  handleSocialCheck(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  // BEGINNING OF SOCIAL METHODS

  handleFacebook = () => {
    this.setState({
      facebook: !this.state.facebook
    });
  };

  handleInstagram = () => {
    this.setState({
      instagram: !this.state.instagram
    });
  };

  handleTwitter = () => {
    this.setState({
      twitter: !this.state.twitter
    });
  };

  handleLinkedin = () => {
    this.setState({
      linkedin: !this.state.linkedin
    });
  };

  handleOther = () => {
    this.setState({
      other: !this.state.other
    });
  };

  // END OF SOCIAL METHODS

  handlePostTime = (time, timeString) => {
    this.setState({
      postTime: timeString
    });
  };

  // Beginning Of Link Methods

  createUI() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <input type="text" value={el.value || ''} onChange={this.handleLinks.bind(this, i)} />
        <input type="button" value="remove" onClick={this.removeClick.bind(this, i)} />
      </div>
    ));
  }

  removeImageParent = index => {
    this.setState({
      metaImageFiles: this.state.metaImageFiles.filter((_, i) => i !== index)
    });
  };

  handleLinks(i, event) {
    let values = [...this.state.values];
    values[i].value = event.target.value;
    this.setState({ values });
  }

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, { value: null }]
    }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  // End of Link Methods

  handleAd = e => {
    this.setState(
      {
        ad: !this.state.ad
      },
      () => {
        console.log('ad state', this.state.ad);
      }
    );
  };

  handleDPChange(val) {
    this.setState({ dpDate: val, ipDate: moment(val).format('MM/DD/YYYY') });
  }

  handleIpChange(val) {
    let d = moment(val, 'MM/DD/YYYY');
    if (d.isValid()) {
      this.setState({ dpDate: d.toDate() });
    }
    this.setState({ Date: val });
  }

  handleEndDpChange(val) {
    this.setState({ endDpDate: val, endIpDate: moment(val).format('MM/DD/YYYY') }, () => {
      console.log('ip', this.state.edDpDate, this.state.endIpDate);
    });
  }

  handleEndIpChange(val) {
    let d = moment(val, 'MM/DD/YYYY');
    if (d.isValid()) {
      this.setState({ endDpDate: d.toDate() });
    }
    this.setState({ endIpDate: val });
  }

  handleStartDpChange(val) {
    this.setState({
      startDpDate: val,
      startIpDate: moment(val).format('MM/DD/YYYY')
    });
  }

  handleBudget = e => {
    this.setState({
      budget: e.target.value
    });
  };

  handleStartIpChange(val) {
    let d = moment(val, 'MM/DD/YYYY');
    if (d.isValid()) {
      this.setState({ startDpDate: d.toDate() });
    }
    this.setState({ startIpDate: val });
  }

  createForms() {
    return this.state.subPosts.map((el, i) => (
      <div className="form-wrapper d-flex" key={i}>
        <div className="inner-form-wrapper">
          <SubPost i={i} subPosts={this.state.subPosts} />
        </div>
      </div>
    ));
  }

  getType = url => {
    if (url !== 'No Files') {
      var checkUrl = new URL(url);

      var query_string = checkUrl.search;

      var search_params = new URLSearchParams(query_string);

      var type = search_params.get('type');

      return type;
    }
  };

  render() {
    const genExtra = () => <img src={require('../assets/arrow.svg')} alt="arrow icon" />;
    return (
      <div className="d-flex row">
        <div className="col-sm-6">
          <Input
            className="blue-input"
            placeholder="POST TITLE *"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
          />

          {this.state.metaImageFiles.length > 0 ? (
            <div>
              <div className="d-flex flex-wrap">
                <ImagePosts imageSrc={this.state.metaImageFiles} className="upload-files-wrapper" removeImage={this.removeImageParent}/>
              </div>
              <input type="file" multiple onChange={this.addFile} id="render-input" />
            </div>
          ) : (
            <div className="red-main-outter flex-wrap d-flex">
              <div id="red-outline-wrapper" className="w-100">
                <div className="red-center">
                  <input
                    type="file"
                    multiple
                    onChange={this.addFile}
                    className="red-dashed-input"
                  />
                </div>
              </div>
              <div className="small-red-wrapper"></div>
              <div className="small-red-wrapper"></div>
              <div className="small-red-wrapper"></div>
            </div>
          )}
          <div className="copy-wrapper">
            <TextArea
              className="blue-input mt-30"
              placeholder="COPY"
              name="copy"
              value={this.state.copy}
              onChange={this.handleChange}
              margin="normal"
              rows={6}
              variant="outlined"
            />
            <button onClick={this.openIcons} className="smile-wrapper clear-btn" type="button">
              <i className="fa fa-smile-o" aria-hidden="true"></i>
            </button>
          </div>
          {this.state.showEmoji && (
            <span>
              <Picker onSelect={this.addEmoji.bind(this)} />
            </span>
          )}
        </div>
        <div className="inner-form-wrapper1 col-sm-6">
          <div className="d-flex justify-content-between mb-20">
            <div>
              <Checkbox
                onChange={this.handleFacebook}
                name="facebook"
                value={this.state.facebook}
                id={`facebook-${this.props.i}`}
              />
              <label className="margin-label" for={`facebook-${this.props.i}`}>
                Facebook
              </label>
            </div>
            <div>
              <Checkbox
                onChange={this.handleInstagram}
                name="instagram"
                value={this.state.instagram}
                id={`instagram-${this.props.i}`}
              />
              <label className="margin-label" for={`instagram-${this.props.i}`}>
                Instagram
              </label>
            </div>
            <div>
              <Checkbox
                onChange={this.handleTwitter}
                name="twitter"
                value={this.state.twitter}
                id={`twitter-${this.props.i}`}
              />
              <label className="margin-label" for={`twitter-${this.props.i}`}>
                {' '}
                Twitter
              </label>
            </div>
            <div>
              <Checkbox
                onChange={this.handleLinkedin}
                name="linkedin"
                value={this.state.linkedin}
                id={`linkedin-${this.props.i}`}
              />
              <label className="margin-label" for={`linkedin-${this.props.i}`}>
                LinkedIn
              </label>
            </div>
            <div>
              <Checkbox
                onChange={this.handleOther}
                name="other"
                value={this.state.other}
                id={`other-${this.props.i}`}
              />
              <label className="margin-label" for={`other-${this.props.i}`}>
                Other
              </label>
            </div>
          </div>
          <div className="date-button-wrapper d-flex row justify-content-between">
            <div id="choose-date-wrapper" className="col-sm-4">
              <Collapse>
                <Panel header={this.state.ipDate} extra={genExtra()} showArrow={false}>
                  <DatePicker
                    placeholderText="Post Date"
                    onChange={value => this.handleDPChange(value)}
                    customInput={
                      <CustomCalendarComponent
                        ipDate={this.state.ipDate}
                        placeholderText="Post Date"
                        handleIpChange={val => this.handleIpChange(val)}
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
                onChange={this.handlePostTime}
                className="toggle-btn"
                defaultValue={moment('12:00:23', 'HH:mm:ss')} 
              />
            </div>
            <div className="col-sm-4">
              <Input
                className="outlined-title no-margin medium-title"
                name="postMedium"
                value={this.state.postMedium}
                onChange={this.handleChange}
                margin="normal"
                variant="outlined"
                placeholder="POST MEDIUM"
              />
            </div>
          </div>

          <div className="sponsored-label mb-20">
            <Checkbox
              onChange={this.handleAd}
              name="other"
              checked={this.state.ad}
              id={`ad-${this.props.i}`}
            />
            <label for={`ad-${this.props.i}`}>Ad or Sponsored Post</label>
          </div>

          {this.state.ad && (
            <div className="col-md-12 row mt-20 mb-20">
              <div className="d-flex justify-content-between date-picker-wrapper flex-85 align-items-center">
                <DatePicker
                  selected={this.state.startDpDate}
                  placeholderText="Post Date"
                  onChange={value => this.handleStartDpChange(value)}
                  dateFormat={'MM/dd/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <span>-</span>
                <DatePicker
                  selected={this.state.endDpDate}
                  onChange={value => this.handleEndDpChange(value)}
                  customInput={
                    <CustomCalendarComponent
                      ipDate={this.state.endIpDate}
                      handleIpChange={val => this.handleEndIpChange(val)}
                      placeholderText="Post Date"
                    />
                  }
                  placeholderText="Post Date"
                  dateFormat={'MM/dd/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
              <div className="d-flex flex-85 align-items-center mt-20">
                <label className="budget-text">Budget</label>
                <input
                  type="text"
                  placeholder="$0.00"
                  className="budget-input"
                  onChange={this.handleBudget.bind(this)}
                />
              </div>
            </div>
          )}

          <div>
            <TextArea
              className="outlined-hash w-100 blue-input"
              placeholder="HASHTAGS"
              name="postHashTag"
              value={this.state.postHashTag}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div>
            {this.state.values.map((el, i) => (
              <div key={i}>
                <div className="d-flex align-self-center ant-link">
                  <Input
                    className="blue-input"
                    placeholder="ADD LINKS"
                    value={el.value || ''}
                    onChange={e => this.handleLinks(i, e)}
                    margin="normal"
                    variant="outlined"
                  />

                  {i === this.state.values.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => this.addClick()}
                      className="clear-btn ml-7"
                    >
                      <img src={require('../assets/select.svg')} alt="select icon" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => this.removeClick(i)} className="clear-btn">
                      <img src={require('../assets/x.png')} alt="x icon" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(SubPost);
