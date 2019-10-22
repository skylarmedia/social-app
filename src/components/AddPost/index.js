import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import 'antd/dist/antd.css';
import './index.css';
import EditCategoryForm from '../EditCategoryForm';
import moment from 'moment';
import SubPost from './SubPost';

import EmojiField from 'emoji-picker-textfield';
import 'emoji-mart/css/emoji-mart.css';
import 'react-datepicker/dist/react-datepicker.css';

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
    this.receivedValues = this.receivedValues.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
  }

  onSubmitForm = e => {
    e.preventDefault();
    this.setState({
      completed: !this.state.completed
    });
  };

  triggerValues = state => {
    this.setState(previousState => ({
      tempHold: [...previousState.tempHold, state]
    }));
  };

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
    this.setState({ postArr: [...this.state.postArr, postObj] }, () => {});
  };

  handleApproval = () => {
    alert('ran');
    this.setState({
      approved: !this.state.approved
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
    this.setState({
      selectedCategory: color,
      selectedCategoryName: name
    });
  };

  saveDraft = () => {
    this.setState({
      draft: true
    });
  };

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
    this.setState({
      ad: !this.state.ad
    });
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
          this.props.history.push(
            `/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`
          );
        });
    }
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

                <button onClick={() => this.addForm()} class="clear-btn" type="button">
                  <img src={require('../assets/select.svg')} />
                  <span>Add Platform</span>
                </button>
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
