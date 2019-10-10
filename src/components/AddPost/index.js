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
import SubPost from './SubPost';

import EmojiField from 'emoji-picker-textfield';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

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
      postArr: [],
      completed: false,
      tempHold: [],
      draft: false,
      created: true,
      selectedCategory: '',
      year: this.props.match.params.year,
      month: this.props.match.params.month,
      day: this.props.match.params.day,
      selectedCategoryName: '',
      approved: false
    };

    this.addForm = this.addForm.bind(this);
    this.handleSocialCheck = this.handleSocialCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showDate = this.showDate.bind(this);
    this.handlePostTime = this.handlePostTime.bind(this);
    // this.getValues = this.getValues.bind(this);
    this.receivedValues = this.receivedValues.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    // this.myRef = React.createRef();
    // this.getSelectedCategory = this.getSelectedCategory.bind(this)
  }

  onSubmitForm = e => {
    e.preventDefault();
    this.setState({
      completed: !this.state.completed
    });
  };

  triggerValues = state => {
    this.setState(
      previousState => ({
        tempHold: [...previousState.tempHold, state]
      }),
      () => {
        console.log(' TEMP HOLD ONE', this.state.tempHold[0]);
      }
    );
  };

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
    return <EmojiField name="my-input" onChange={props.onChange} fieldType="input" />;
  };

  textAreaComponent = props => {
    // defaults to textarea, no need to pass fieldType
    return <EmojiField name="my-textarea" onChange={props.onChange} />;
  };

  // END OF EMOJI METHODS

  addForm() {
    this.setState(prevState => ({
      subPosts: [...prevState.subPosts, null]
    }));
  }

  addPostToFirebase = () => {
    this.props.firebase.addPost(this.props.match.params.clientId, this.state.postArr);
  };

  handleSocialCheck(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  receivedValues = postObj => {
    this.setState({ postArr: [...this.state.postArr, postObj] }, () => {
      console.log('POST ARR', this.state);
    });
  };

  handleApproval = () => {
    this.setState({
      approved: !this.state.approved
    }, () => {
      alert(this.state.approved)
    });
  };

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

  getSelectedCategory = (color, name) => {
    console.log(color, name);
    this.setState({
      selectedCategory: color,
      selectedCategoryName: name
    });
  };

  saveDraft = () => {
    this.setState({
      draft: true
    });

    // alert(this.state.draft);
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
        <div className="main-form-wrapper">
          <SubPost
            i={i}
            ref={this.getValues}
            triggerValues={this.triggerValues}
            ref="child"
            completed={this.state.completed}
            id={this.props.match.params.clientId}
            month={this.props.match.params.month}
            day={this.props.match.params.day}
            year={this.props.match.params.year}
          />
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

    if (this.state.subPosts.length == this.state.tempHold.length) {
      // Add Back
      this.props.firebase
        .addPost(
          this.props.match.params.clientId,
          this.state.tempHold,
          this.state.draft,
          this.state.selectedCategory,
          parseInt(this.state.year),
          parseInt(this.state.month),
          parseInt(this.state.day),
          this.state.selectedCategoryName,
          this.state.approved
        )
        .then(() => {
          // this.props.history.push(
          //   `/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`
          // );
        });
    }
    console.log('state for render', this.state);
    // console.log('parent props', this.props)
    return (
      <React.Fragment>
        <div className="add-post">
          <EditCategoryForm
            clientId={this.props.match.params.clientId}
            getSelectedCategory={this.getSelectedCategory}
            category={this.state.selectedCategory}
            month={this.props.match.params.month}
          />
          <p className="heading text-center add-post-heading">
            Client {this.props.match.params.clientId} Calendar
            <br />
          </p>
          <div className="grey-background">
            <div className="container">
              <form onSubmit={this.onSubmitForm}>
                <div className="d-flex">
                  <input
                    type="checkbox"
                    name="approved"
                    value={this.state.approved}
                    onChange={this.handleApproval}
                    id="approvePost"
                  />
                  <label for="approvePost">APPROVE POST</label>
                </div>
                {this.createForms()}
                <input type="button" value="Add Platform" onClick={() => this.addForm()} />
                <div className="text-center">
                  <button className="save-draft-btn" onClick={this.saveDraft.bind(this)}>
                    SAVE DRAFT
                  </button>
                  <input type="submit" value="Submit" className="add-date-btn" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default compose(withFirebase(AddPost));
