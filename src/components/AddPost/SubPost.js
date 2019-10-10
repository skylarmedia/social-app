import React, { Component } from 'react';
import TimePicker from 'antd/es/time-picker';
import EditCategoryForm from '../EditCategoryForm';
import CustomCalendarComponent from '../CustomCalendarComponent';
import DatePicker from 'react-datepicker';

import { withFirebase } from '../Firebase';
import { compose } from 'redux';

import moment from 'moment';
import TextField from '@material-ui/core/TextField';

import EmojiField from 'emoji-picker-textfield';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import { connect } from 'react-redux';
import { pushPosts } from '../actions/actions';

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
      showEmoji: false
    };

    this.addForm = this.addForm.bind(this);
    this.handleSocialCheck = this.handleSocialCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDate = this.showDate.bind(this);
    this.handlePostTime = this.handlePostTime.bind(this);
    this.addFile = this.addFile.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.openIcons = this.openIcons.bind(this);
  }

  // Beginning of upload methods

  uploadFiles = (fb) => {
    this.state.file.map((file, i )=> {
      console.log('storage', this.props.firebase.storage);
      console.log('file', file.type)
      const storageRef = this.props.firebase.storage;
      const storageParent = this.props.firebase.storageParent;
      const metadata = {
        contentType: file.type
      }

      storageRef.child('images/' + file.name).put(file, metadata).then(snapshot => {
        const encodedUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodeURIComponent(snapshot.metadata.fullPath)}?alt=media`;
        this.setState({
          metaImageFiles: [...this.state.metaImageFiles, encodedUrl]
        })
      })

      console.log('store', this.props.firebase.storage, this.props.firebase.storageParent)
    });
  };

  addFile = event => {
    const file = Array.from(event.target.files);
    console.log('add file method', event);
    if (file.length == 1) {
      var emptyFileArr = [];
      file.map(innerFile => {
        emptyFileArr.push(innerFile);
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
        emptyFileArr.push(innerFile);
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
    // Typical usage (don't forget to compare props):
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
 
      console.log('updated component props', this.state)
      postObj['images'] = this.state.metaImageFiles

      this.props.triggerValues(postObj);
    }
  }

  addEmoji = e => {
    //console.log(e.unified)
    if (e.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${e.unified}`);
      this.setState({
        copy: this.state.copy + emojiPic
      });
    } else {
      let sym = e.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));
      //console.log(codesArray.length)
      //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({
        copy: this.state.copy + emojiPic
      });
    }
  };

  handleChange = e => {
    console.log('CHANGE', e.target.value);
    console.log('COPY STATe', this.state);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handlePostDate = date => {
    let postDateFormatted = date.toLocaleDateString('en-US');
    console.log(postDateFormatted);
    // let postDate = date.toLocale/DateString('en-US');
    this.setState(
      {
        postDate: postDateFormatted
      },
      () => {
        console.log('DATE IN METHOD', this.state.postDate);
      }
    );

    console.log('post date', this.state.postDate.toLocaleDateString('en-US'));
  };

  showDate = e => {
    e.preventDefault();
    this.setState({
      showDate: !this.showDate
    });
  };

  // BEGINNING OF EMOJI METHODS

  inputComponent = props => {
    // you need to explicitly pass 'fieldType="input"'.
    return <EmojiField name="my-input" onChange={props.onChange} fieldType="input" />;
  };

  textAreaComponent = props => {
    // defaults to textarea, no need to pass fieldType
    return <EmojiField name="my-textarea" onChange={props.onChange} />;
  };

  // END OF EMOJI METHODS

  addForm() {
    let postArr = {};
    // postArr.push(this.state.title, this.state.copy)
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
    console.log('budget start', this.state.startIpDate)
    console.log('budget end', this.state.endIpDate);

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
    console.log('TIME', time);
    console.log('TIMEString', timeString);
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
    this.setState({ startDpDate: val, startIpDate: moment(val).format('MM/DD/YYYY') }, () => {
      console.log('ip', this.state.startDpDate, this.state.startIpDate);
    });
  }

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
    console.log('this PROPS ', this.props);
    const renderMedia = this.state.metaImageFiles.map(item => {
      console.log("item", item)
      if (this.getType(item) == 'video') {
        return (
          <video height="200" width="200" controls>
            <source src={item} />
          </video>
        );
      } else {
        return <img src={item} />;
      }
    });
    return (
      <div className="d-flex">
        <div className="col-sm-6">
          <TextField
            className="outlined-title"
            label="Post Title"
            name="title"
            value={this.state.value}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />

          <div id="red-outline-wrapper">
            <div class="red-center">
              <input type="file" multiple onChange={this.addFile} className="red-dashed-input" />
            </div>
          </div>

          <div className="upload-files-wrapper">
            {renderMedia}
            <div />
            <input type="file" multiple onChange={this.addFile} />
          </div>
          <div className="copy-wrapper">
            <TextField
              className="outlined-copy"
              label="Copy"
              name="copy"
              multiline
              value={this.state.copy}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
            <button onClick={this.openIcons} className="smile-wrapper">
              <img src={require('../assets/smile.png')} className="smile-logo" />
            </button>
          </div>
          {this.state.showEmoji && (
            <span>
              <Picker onSelect={this.addEmoji.bind(this)} />
            </span>
          )}
        </div>
        <div className="inner-form-wrapper1 col-sm-6">
          <div>
            <input
              type="checkbox"
              name="facebook"
              value={this.state.facebook}
              onChange={this.handleFacebook}
              id="facebook"
              className="custom-check"
              checked={this.state.checked}
            />
            <label for="facebook">Facebook</label>
            <input
              type="checkbox"
              name="instagram"
              value={this.state.instagram}
              onChange={this.handleInstagram}
              className="custom-check"
              id="instagram"
            />
            <label for="instagram">Instagram</label>
            <input
              type="checkbox"
              name="twitter"
              value={this.state.twitter}
              onChange={this.handleTwitter}
              className="custom-check"
              id="twitter"
            />
            <label for="twitter">Twitter</label>
            <input
              type="checkbox"
              name="linkedin"
              value={this.state.linkedin}
              onChange={this.handleLinkedin}
              className="custom-check"
              id="linkedin"
            />
            <label for="linkedin">LinkedIn</label>
            <input
              type="checkbox"
              name="other"
              value={this.state.other}
              onChange={this.handleOther}
              className="custom-check"
              id="other"
            />
            <label for="other">Other</label>
          </div>
          <div class="date-button-wrapper d-flex">
            {this.state.showDatePicker && (
              <div id="choose-date-wrapper">
                <DatePicker
                  selected={this.state.startDate}
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
              </div>
            )}
            <div>
              <TimePicker onChange={this.handlePostTime} />
            </div>
            <div>
              <input
                type="text"
                placeholder="POST MEDIUM"
                name="postMedium"
                value={this.state.postMedium}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* date-button-wrapper */}
          <div>
            <input type="checkbox" checked={this.state.ad} onChange={this.handleAd} id="ad" />
            <label for="ad">Ad or Sponsored Post</label>

            {this.state.ad && (
              <div>
                <DatePicker
                  selected={this.state.startDpDate}
                  placeholderText="Post Date"
                  onChange={value => this.handleStartDpChange(value)}
                  customInput={
                    <CustomCalendarComponent
                      ipDate={this.state.startIpDate}
                      placeholderText="Post Date"
                      handleIpChange={val => this.handleStartIpChange(val)}
                    />
                  }
                  dateFormat={'MM/dd/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />

                <p>BREAK</p>
                <DatePicker
                  selected={this.state.endDpDate}
                  onChange={value => this.handleEndDpChange(value)}
                  customInput={
                    <CustomCalendarComponent
                      ipDate={this.state.endIpDate}
                      handleIpChange={val => this.handleEndIpChange(val)}
                      placeholderText="Post Date"
                    />}
                    placeholderText="Post Date"
                  dateFormat={'MM/dd/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            )}
          </div>
          <div>
            <textarea
              placeholder="Hashtags"
              value={this.state.postHashTag}
              name="postHashTag"
              onChange={this.handleChange}
            />
          </div>
          <div>
            {this.state.values.map((el, i) => (
              <div key={i}>
                <input type="text" value={el.value || ''} onChange={e => this.handleLinks(i, e)} />
                <input type="button" value="remove" onClick={() => this.removeClick(i)} />
              </div>
            ))}
            <input type="button" value="add more" onClick={() => this.addClick()} />
          </div>
          <input type="button" value="Add Platform" onClick={() => this.addForm()} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {};

export default withFirebase(
  connect(
    null,
    mapDispatchToProps
  )(SubPost)
);
