import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import FileUploader from 'react-firebase-file-uploader';
import TimePicker from 'react-time-picker';
import { SketchPicker } from 'react-color';
import * as ROUTES from '../../constants/routes';
import { bigIntLiteral } from '@babel/types';
import './index.css';
import TextField from '@material-ui/core/TextField';
import EditCategoryForm from '../EditCategoryForm';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class AddPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      copy: '',
      values: [],
      time: '10:00',
      hashtags: [],
      filesArr: [],
      image: '',
      imageURL: '',
      progress: 0,
      showCategoryState: false,
      pushColor: '',
      pushColorText: '',
      clientId: '',
      calendarDay: 0,
      calendarMonth: 0,
      calendarYear: 2019,
      postId: '',
      file: [],
      metaImageFiles: ['No Files'],
      selectedCategory: 'No Category|||#fff'
    };

    this.handleTitle = this.handleTitle.bind(this);
    this.renderAddLinks = this.renderAddLinks.bind(this);
    this.fileChangeHandler = this.fileChangeHandler.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.showCategory = this.showCategory.bind(this);
    this.handleColorText = this.handleColorText.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.addFile = this.addFile.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.addHash = this.addHash.bind(this);
    this.removeHash = this.removeHash.bind(this);
  }

  componentDidMount() {
    console.log(this.props, 'addpost');

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get('clientId');
    const day = parseInt(url.searchParams.get('day'));
    const month = parseInt(url.searchParams.get('month'));
    console.log(c, ' this is the client Id after it has mounted');

    this.setState({
      clientId: c,
      calendarDay: day,
      calendarMonth: month
    });
  }

  renderAddLinks() {
    document.getElementById('link-container');

    this.setState(prevState => ({ inputs: [...prevState.inputs, ''] }));
  }

  fileChangeHandler = event => {
    const {
      target: { files }
    } = event;
    const filesToStore = this.state.filesArr;

    this.setState({ files: filesToStore });
  };

  handleChangeText(i, event) {
    let colors = [...this.state.colors];
    colors[i] = event.target.value;
    this.setState({ colors });
  }

  handleColorText = e => {
    this.setState({
      pushColorText: e.target.value
    });
  };

  getSelectedCategory = event => {
    this.setState({
      selectedCategory: event.target.value
    });
  };

  createUI() {
    return this.state.values.map((el, i) => (
      <div key={i} className="d-flex align-items-center">
        <TextField
          type="text"
          value={el || ''}
          onChange={this.handleChange.bind(this, i)}
          className="outlined-title hash-field"
          margin="normal"
          variant="outlined"
        />
        <input
          type="button"
          value="x"
          onClick={this.removeClick.bind(this, i)}
          className="remove-hash"
        />
      </div>
    ));
  }

  createHashtags() {
    return this.state.hashtags.map((el, i) => (
      <div key={i} className="d-flex align-items-center">
        <TextField
          type="text"
          value={el || ''}
          onChange={this.handleHash.bind(this, i)}
          className="outlined-title hash-field"
          margin="normal"
          variant="outlined"
        />
        <input
          type="button"
          value="x"
          onClick={this.removeHash.bind(this, i)}
          className="remove-hash"
        />
      </div>
    ));
  }

  handleChange(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
  }

  handleHash(i, event) {
    let hashtags = [...this.state.hashtags];
    hashtags[i] = event.target.value;
    this.setState({ hashtags });
  }

  addHash() {
    this.setState(prevState => ({ hashtags: [...prevState.hashtags, ''] }));
  }

  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ''] }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  removeHash(i) {
    let hashtags = [...this.state.hashtags];
    hashtags.splice(i, 1);
    this.setState({ hashtags });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.values.join(', '));
    event.preventDefault();
  }

  onChange = time => this.setState({ time });

  submitFile(e) {
    e.preventDefault();
    this.props.firebase.getStorage.child('images');
  }

  showCategory = e => {
    e.preventDefault();

    this.setState({
      showCategoryState: !this.state.showCategoryState
    });
  };

  handleTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  handleCopy = e => {
    this.setState({
      copy: e.target.value
    });
  };

  handleHashtags = e => {
    this.setState({
      hashtags: e.target.value
    });
  };

  onChangeTime = e => {
    this.setState({
      time: e
    });
  };

  onSubmitForm = e => {
    e.preventDefault();

    console.log(this.props.match.params.clientId);

    const friendlyUrl = this.state.title.toLowerCase().replace(/ /g, '-');
    const formMonth = this.state.calendarMonth;
    const clientId = this.props.match.params.clientId;
    this.props.firebase.addPost(
      clientId,
      this.state.title,
      this.state.copy,
      this.state.hashtags,
      this.state.time,
      parseInt(this.props.match.params.day),
      parseInt(this.props.match.params.month),
      this.state.values,
      this.state.metaImageFiles,
      friendlyUrl,
      false,
      this.state.selectedCategory
    );

    this.props.history.push(
      `/calendar/2019/${this.props.match.params.month}/${this.props.match.params.clientId}`
    );
  };

  // File upload methods

  addFile = event => {
    const file = Array.from(event.target.files);

    if (file.length === 1) {
      this.setState({
        file: [...this.state.file],
        file
      });
    } else if (file.length > 1) {
      const emptyFileArr = [];
      file.map(innerFile => {
        emptyFileArr.push(innerFile);
      });

      this.setState({
        file: emptyFileArr
      }, () => {
        this.uploadFiles();
        alert('uploaded')
        console.log('statefile', this.state.file)
      });
    }
  };

  uploadFiles = () => {
    // e.preventDefault();
    const firestorageRef = this.props.firebase.storage;
    const imageRefs = [];
    this.state.file.forEach(file => {
      console.log('FILE NAME', file.name)
      var type;

      switch (file.type) {
        case 'video/mp4':
          type = 'video';
          break;
        case 'image/png':
          type = 'image';
          break;
        case 'image/jpeg':
          type = 'image';
          break;
        default:
          type = '';
      }
      var encodedURL =
        encodeURIComponent(this.state.clientId) +
        encodeURIComponent('/') +
        this.state.calendarMonth +
        encodeURIComponent('-') +
        this.state.calendarDay +
        encodeURIComponent('/') +
        file.name +
        '?alt=media&type=' +
        type;
      var imageUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodedURL}`;
      imageRefs.push(imageUrl);

      firestorageRef
        .ref()
        .child(
          `${this.state.clientId}/${this.state.calendarMonth}-${this.state.calendarDay}/${
            file.name
          }`
        )
        .put(file);
    });
    this.setState({
      metaImageFiles: imageRefs
    }, () => {
        console.log('META FILES', this.state.metaImageFiles)
    });
  };

  showState = e => {
    e.preventDefault();
    console.log(this.state);
  };

  monthNumToName = monthnum => {
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return months[monthnum - 1] || '';
  };

  render() {
    const buttonStyles = {
      backgroundColor: '#EF463B',
      borderColor: '#007bff',
      width: '40px',
      height: '40px'
    };

    const renderMedia = this.state.metaImageFiles.map(media => {
      // alert(media)
    });

    return (
      <React.Fragment>
        <div className="add-post">
          <p className="heading text-center add-post-heading">
            Client {this.props.match.params.clientId} Calendar
            <br />
            {this.monthNumToName(parseInt(this.props.match.params.month))}{' '}
            {this.props.match.params.year} - Add Post
          </p>
          <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
          <div className="grey-background">
            <div className="container">
              <form onSubmit={this.onSubmitForm}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="outter-form-wrap d-flex">
                    <div className="col-sm-6">
                      <div className="d-flex align-items-end justify-content-between">
                        <TextField
                          className="outlined-title"
                          label="Post Title"
                          name="title"
                          value={this.state.value}
                          onChange={this.handleTitle}
                          required
                          margin="normal"
                          variant="outlined"
                        />
                        {/* <TimePicker onChange={this.onChangeTime} value={this.state.time} /> */}
                      </div>
                      <div className="upload-files-wrapper">
                        <div></div>
                        <input type="file" multiple onChange={this.addFile} />
                        <button onClick={this.uploadFiles}>Upload Files</button>
                      </div>
                      <br />
                      <TextField
                        className="outlined-copy"
                        label="Copy"
                        name="copy"
                        multiline
                        value={this.state.value}
                        onChange={this.handleTitle}
                        required
                        margin="normal"
                        value={this.state.value}
                        onChange={this.handleCopy}
                        variant="outlined"
                      />
                    </div>
                    <div className="col-sm-6">
                      <p className="heading">Hashtags:</p>
                      {this.createHashtags()}
                      <Fab
                        color="red"
                        aria-label="Add"
                        onClick={this.addHash.bind(this)}
                        style={buttonStyles}
                      >
                        <AddIcon />
                      </Fab>
                      {/* <input type='button' value='Add Hashtags' className="add-date-btn" /> */}
                      <br />
                      <p className="heading">Links:</p>
                      {this.createUI()}
                      <Fab
                        color="red"
                        aria-label="Add"
                        onClick={this.addClick.bind(this)}
                        style={buttonStyles}
                      >
                        <AddIcon />
                      </Fab>
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
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
