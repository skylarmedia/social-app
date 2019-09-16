import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import FileUploader from 'react-firebase-file-uploader';
import TimePicker from 'antd/es/time-picker';
import 'antd/dist/antd.css';
import { SketchPicker } from 'react-color';
import * as ROUTES from '../../constants/routes';
import { bigIntLiteral } from '@babel/types';
import './index.css';
import TextField from '@material-ui/core/TextField';
import EditCategoryForm from '../EditCategoryForm';
import moment from 'moment';


import EmojiField from 'emoji-picker-textfield';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

//Date Picker for DD-MM-YYYY

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomCalendarComponent from '../CustomCalendarComponent';

// const momentDateFormat = "MM/DD/YYYY";

// Time Picker

// const { TimePicker } = 'antd/es/time-picker';
// import DatePicker as TimePicker from 'antd/es/date-picker'; // for js
// import 'antd/es/date-picker/style/css'; // for css

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class AddPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subPosts: [{ subPosts: null }],
      social: [],
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
      ipDate: moment().format('MM/DD/YYYY')
    };

    this.addForm = this.addForm.bind(this);
    this.handleSocialCheck = this.handleSocialCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDate = this.showDate.bind(this);
    this.handlePostTime = this.handlePostTime.bind(this);
  }

  onSubmitForm = e => {
    e.preventDefault();

    // console.log(this.props.match.params.clientId);

    let lastPost = {};
    // postArr.push(this.state.title, this.state.copy)
    lastPost['title'] = this.state.title;
    lastPost['copy'] = this.state.copy;
    lastPost['postTime'] = this.state.postTime;
    lastPost['postMedium'] = this.state.postMedium;
    lastPost['ad'] = this.state.ad;
    lastPost['postHashtag'] = this.state.postHashtag;
    lastPost['values'] = this.state.values;
    lastPost['facebook'] = this.state.facebook;
    lastPost['twitter'] = this.state.twitter;
    lastPost['instagram'] = this.state.instagram;
    lastPost['linkedin'] = this.state.linkedin;
    lastPost['other'] = this.state.other;
    lastPost['postDate'] = this.state.postDate;

    this.setState(
      prevState => ({
        subPosts: [...prevState.subPosts, lastPost]
      }),
      () => {
        const friendlyUrl = this.state.title.toLowerCase().replace(/ /g, '-');
        const formMonth = this.state.calendarMonth;
        const clientId = this.props.match.params.clientId;

        this.props.firebase.addPost(clientId, this.state.subPosts);
      }
    );

    // this.props.firebase.addPost(
    //   clientId,
    //   this.state.title,
    //   this.state.copy,
    //   this.state.hashtags,
    //   this.state.time,
    //   parseInt(this.props.match.params.day),
    //   parseInt(this.props.match.params.month),
    //   this.state.values,
    //   this.state.metaImageFiles,
    //   friendlyUrl,
    //   false,
    //   this.state.selectedCategory
    // );

    // this.props.history.push(
    //   `/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`
    // );
  };

  //   // File upload methods

  //   addFile = event => {
  //     const file = Array.from(event.target.files);

  //     if (file.length === 1) {
  //       this.setState({
  //         file: [...this.state.file],
  //         file
  //       });
  //     } else if (file.length > 1) {
  //       const emptyFileArr = [];
  //       file.map(innerFile => {
  //         emptyFileArr.push(innerFile);
  //       });

  //       this.setState({
  //         file: emptyFileArr
  //       }, () => {
  //         this.uploadFiles();
  //         alert('uploaded')
  //         console.log('statefile', this.state.file)
  //       });
  //     }
  //   };

  //   showState = e => {
  //     e.preventDefault();
  //     console.log(this.state);
  //   };

  //   monthNumToName = monthnum => {
  //     var months = [
  //       'January',
  //       'February',
  //       'March',
  //       'April',
  //       'May',
  //       'June',
  //       'July',
  //       'August',
  //       'September',
  //       'October',
  //       'November',
  //       'December'
  //     ];

  //     return months[monthnum - 1] || '';
  //   };

  addEmoji = (e) => {
    //console.log(e.unified)
    if (e.unified.length <= 5) {
        let emojiPic = String.fromCodePoint(`0x${e.unified}`)
        this.setState({
            copy: this.state.copy + emojiPic
        })
    } else {

        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        //console.log(codesArray.length)
        //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]

        let emojiPic = String.fromCodePoint(...codesArray)
        this.setState({
            copy: this.state.copy + emojiPic
        })
    }
}

  handleChange = e => {
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
    postArr['postDate'] = this.state.postDate;

    // .set('title', this.state.title)
    // .set('copy', this.state.copy)
    // .set('postTime', this.state.postTime)
    // .set('postMedium', this.state.postMedium)
    // .set('ad', this.state.ad)
    // .set('postHashtag', this.state.postHashTag)
    // .set('values', this.state.values)
    // .set('facebook', this.state.facebook)
    // .set('twitter', this.state.twitter)
    // .set('linkedin', this.state.linkedin)
    // .set('instagram', this.state.instagram)
    // .set('other', this.state.other)
    // .set('postDate', this.state.ipDate)

    // subPosts: [{ subPosts: null }],
    // social: [],
    // title: '',
    // copy: '',
    // postDate: new Date(),
    // currentPost: new Map(),
    // showDatePicker: true,
    // postTime: null,
    // postMedium: '',
    // ad: false,
    // postHashTag: '',
    // values: [{ value: null }],
    // facebook: false,
    // twitter: false,
    // instagram: false,
    // linkedin:false,
    // other:false,
    // dpDate: moment().toDate(),
    // ipDate: moment().format('MM/DD/YYYY')

    this.setState(prevState => ({
      subPosts: [...prevState.subPosts, postArr]
    }));

    // console.log('STATE AFTER ADD FORM title', this.state.currentPost.get('title'))
    // console.log('STATE AFTER ADD copy', this.state.currentPost.get('copy'))
  }

  // handleSocialCheck = e => {

  //   this.setState({
  //     [e.target.name]: `${!this.state}.${e.target.name}`
  //   }, (e) => {
  //     console.log('state in arr', this.state)
  //   });
  // };

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

  getSelectedCategory = event => {
    this.setState({
      selectedCategory: event.target.value
    });
  };

  handlePostTime = (time, timeString) => {
    this.setState(
      {
        postTime: timeString
      },
      () => {
        console.log(timeString);
        console.log('Time string', this.state.postTime);
      }
    );
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
    this.setState({ ipDate: val });
  }

  createForms() {
    return this.state.subPosts.map((el, i) => (
      <div className="form-wrapper d-flex" key={i}>
        <div className="inner-form-wrapper col-sm-6">
          <TextField
            className="outlined-title"
            label="Post Title"
            name="title"
            value={this.state.value}
            onChange={this.handleChange}
            required
            margin="normal"
            variant="outlined"
          />
          <span>
                    <Picker onSelect={this.addEmoji.bind(this)} />
                </span>
          <TextField
            className="outlined-copy"
            label="Copy"
            name="copy"
            multiline
            value={this.state.value}
            onChange={this.handleChange}
            required
            margin="normal"
            value={this.state.value}
            variant="outlined"
          />
        </div>
        <div className="inner-form-wrapper col-sm-6">
          <div className="category-wrapper">
            {i < 1 && (
              <EditCategoryForm
                clientId={this.props.match.params.clientId}
                getSelectedCategory={this.getSelectedCategory}
                category={this.state.selectedCategory}
              />
            )}
          </div>
          <div className="d-flex">
            <input
              type="checkbox"
              name="approved"
              value="approved"
              onChange={this.handleApproval}
              id="approvePost"
            />
            <label for="approvePost">APPROVE POST</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="facebook"
              value={this.state.facebook}
              onChange={this.handleFacebook}
              id="facebook"
              checked={this.state.checked}
            />
            <label for="facebook">Facebook</label>
            <input
              type="checkbox"
              name="instagram"
              value={this.state.instagram}
              onChange={this.handleInstagram}
              id="instagram"
            />
            <label for="instagram">Instagram</label>
            <input
              type="checkbox"
              name="twitter"
              value={this.state.twitter}
              onChange={this.handleTwitter}
              id="twitter"
            />
            <label for="twitter">Twitter</label>
            <input
              type="checkbox"
              name="linkedin"
              value={this.state.linkedin}
              onChange={this.handleLinkedin}
              id="linkedin"
            />
            <label for="linkedin">LinkedIn</label>
            <input
              type="checkbox"
              name="other"
              value={this.state.other}
              onChange={this.handleOther}
              id="other"
            />
            <label for="other">Other</label>
          </div>
          <div class="date-button-wrapper d-flex">
            {this.state.showDatePicker && (
              <div id="choose-date-wrapper">
                <DatePicker
                  selected={this.state.dpDate}
                  onChange={value => this.handleDPChange(value)}
                  customInput={
                    <CustomCalendarComponent
                      ipDate={this.state.ipDate}
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
            <input type="checkbox" checked={this.state.checked} onChange={this.handleAd} id="ad" />
            <label for="ad">Ad or Sponsored Post</label>
          </div>
          <div>
            <textarea
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
        </div>
      </div>
    ));
  }

  render() {
    const buttonStyles = {
      backgroundColor: '#EF463B',
      borderColor: '#007bff',
      width: '40px',
      height: '40px'
    };
    console.log('state for render', this.state);
    return (
      <React.Fragment>
        <div className="add-post">
          <p className="heading text-center add-post-heading">
            Client {this.props.match.params.clientId} Calendar
            <br />
          </p>
          <div className="grey-background">
            <div className="container">
              <form onSubmit={this.onSubmitForm}>
                {this.createForms()}
                <input type="button" value="Add Platform" onClick={() => this.addForm()} />
                <div className="text-center">
                  <input type="submit" value="Submit" className="add-date-btn" />
                </div>
              </form>
            </div>
          </div>
          <EditCategoryForm
            clientId={this.props.match.params.clientId}
            getSelectedCategory={this.getSelectedCategory}
            category={this.state.selectedCategory}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(AddPost));
