import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import 'firebase/storage';
import TextField from '@material-ui/core/TextField';
import { withAuthorization } from '../Session';
import CircularProgress from '@material-ui/core/CircularProgress';
import './index.css';
import { Modal, Button } from 'antd';
import MainButton from '../MainButton';
import ClientImage from '../ClientImage';

import app from 'firebase/app';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isHidden: false,
      name: '',
      image: '',
      users: [],
      file: null,
      username: '',
      email: '',
      passwordOne: '',
      error: null,
      firestorageRef: this.props.firebase.storageHome,
      adminEmail: '',
      backgroundUrl: '',
      uploadComplete: false,
      loadSpinner: false,
      showButton: false,
      visible: false
    };

    this.baseState = this.state;
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleLogoUpload = this.handleLogoUpload.bind(this);
    this.addFile = this.addFile.bind(this);
    this.confirmArchive = this.confirmArchive.bind(this);
    this.db = app.firestore();
    this.functions = app.functions();
  }

  // Component lifecycle methods

  componentWillMount() {
    this.props.firebase.getClients().then(snapshot => {
      const opened = snapshot.docs;

      let setArr = [...this.state.users];
      opened.map(item => {
        setArr.push(item.data());
      });

      this.setState({
        users: setArr,
        isLoading: !this.state.isLoading
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      file: null,
      username: ''
    });
  }

  toggleAddNew() {
    this.setState({
      isHidden: !this.state.isHidden,
      file: null,
      backgroundUrl: '',
      username: ''
    });
  }

  updateInput = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  addClient = e => {
    e.preventDefault();

    this.setState({
      name: '',
      image: '',
      data: this.state.data,
      isHidden: !this.state.isHidden
    });

    this.props.firebase.getClients().then(snapshot => {
      this.props.getAllClients(snapshot.docs);
    });
  };

  retrieveUsers = () => {
    this.props.firebase.getClients().then(snapshot => {
      this.setState({
        users: snapshot.docs
      });
    });
  };

  handleLogoUpload = event => {
    const file = Array.from(event.target.files);

    this.setState({
      file: file[0]
    });
  };

  addFile = event => {
    this.setState(
      {
        file: event.target.files[0],
        backgroundUrl: '',
        loadSpinner: !this.state.loadSpinner
      },
      () => {
        this.state.firestorageRef
          .ref()
          .child(`${this.state.username}/logo/`)
          .put(this.state.file)
          .then(snapshot => {
            const encodedUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodeURIComponent(
              snapshot.metadata.fullPath
            )}?alt=media`;
            console.log('encoded URL in ');
            this.setState({
              backgroundUrl: encodedUrl,
              uploadComplete: true,
              loadSpinner: !this.state.loadSpinner
            });
          });
      }
    );
  };

  // Ant Design
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  confirmArchive = e => {
    if (e.target.value == 'true') {
      this.props.firebase.archiveClient(localStorage.getItem('archiveId'));
      this.setState(
        {
          users: this.state.users.filter(
            (_, i) => i !== parseInt(localStorage.getItem('tempIndex'))
          )
        },
        () => {
          localStorage.removeItem('tempIndex');
        }
      );
    }
    this.setState({
      showButton: !this.state.showButton
    });
  };

  archiveClient = (user, index) => {
    this.setState({
      showButton: true
    });

    localStorage.setItem('archiveId', user);
    localStorage.setItem('tempIndex', index);
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.firebase.addUser(
      this.state.email,
      this.state.passwordOne,
      this.state.username,
      this.state.backgroundUrl
    );
    const userObj = {};
    userObj.logo = this.state.backgroundUrl;
    userObj.name = this.state.username;
    userObj.urlName = this.state.username.toLowerCase().replace(/ /g, '-');
    this.setState({
      isHidden: !this.state.isHidden,
      users: [...this.state.users, userObj],
      backgroundUrl: '',
      username: '',
      passwordOne: '',
      email: '',
      file: null
    });
  };

  render() {
    console.log(this.state.backgroundUrl, 'encoded URl');
    const backgroundUrlStyle = {
      backgroundImage: `url(${this.state.backgroundUrl})`,
      backgroundSize: 'cover'
    };

    const progressStyles = {
      color: '#ee463a'
    };

    const isInvalid =
      this.state.passwordOne === '' ||
      this.state.email === '' ||
      this.state.username === '' ||
      this.state.uploadComplete === false;

    return (
      <div id="home-page" className="container">
        {this.state.showButton ? (
          <MainButton
            title="Archive Client?"
            subtitle="Are you sure you would like to archive this client?"
            buttonText="Archive"
            confirmArchive={this.confirmArchive.bind(this)}
          />
        ) : (
          ''
        )}
          <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
          <h2 className="text-center welcome">Welcome Home!</h2>

          {this.state.isLoading && this.state.users.length > 0 ? (
            <div>
              <p className="text-center">What client do you want to work on today?</p>
              <div id="client-list" className="row justify-content-between">
                {this.state.users.map((user, index) => {
                  return (
                    <div
                      data-id={user.userId}
                      className="client-wrapper flex-column d-flex"
                      key={index}
                    >
                      <Link to={`/dates/${user.urlName}`}>
                        <ClientImage logo={user.logo} name={user.name} />
                        {/* <img src={user.logo} className="user-background" /> */}
                      </Link>
                      <div class="d-flex align-items-center align-items-center">
                        <div className="x-wrapper">
                          <Link to={`/dates/${user.urlName}`}>{user.name}</Link>
                        </div>
                        <button
                          onClick={() => this.archiveClient(user.urlName, index)}
                          className="archive-x"
                        >
                          x
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div id="add-new-btn-wrapper" className="text-center">
                <button  onClick={this.showModal} className="add-date-btn hidden-add">
                  Add New1
                </button>
              </div>
            </div>
          ) : this.state.isLoading && this.state.users.length == 0 ? (
            <div>
              <p className="text-center para-margin">
                You don’t seem to have any client calendars set up yet. Click below to add one and
                get started!
              </p>
              <div id="add-new-btn-wrapper" className="text-center mt-88">
                <button
                  onClick={this.toggleAddNew.bind(this)}
                  className="add-date-btn empty-add-date"
                >
                  Add New2
                </button>
              </div>
              <div className="empty-state">
                <div className="row justify-content-between">
                  <div className="dashed" />

                  <div className="dashed" />

                  <div className="dashed" />

                  <div className="dashed dashed-wrapper">
                    <img src={require('../assets/round-arrow.png')} class="round-arrow" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="progress-wrapper">
            </div>
          )}

         <Modal 
          visible={this.state.visible}
          onOk={this.handleOk}
          className="home-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.onSubmit} className="add-date-btn">Submit</Button>
          ]}
          >

              <div id="add-new-form-wrapper">
                <form onSubmit={this.onSubmit} id="add-new-form" className="d-flex flex-column">
                  <div
                    id="avatar-upload"
                    className="d-flex align-items-end justify-content-center align-items-center"
                    style={backgroundUrlStyle}
                  >
                    <input type="file" onChange={this.addFile} id="add-file" />
                    {this.state.loadSpinner === true ? (
                      <CircularProgress style={progressStyles} />
                    ) : (
                      ''
                    )}
                  </div>
                  <TextField
                    margin="normal"
                    variant="outlined"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChange}
                    type="text"
                    label="CLIENT_NAME"
                  />
                  <TextField
                    margin="normal"
                    variant="outlined"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    label="CLIENT_EMAIL"
                  />
                  <TextField
                    margin="normal"
                    variant="outlined"
                    name="passwordOne"
                    value={this.state.passwordOne}
                    onChange={this.onChange}
                    type="password"
                    label="PASSWORD"
                  />
                  
                  {this.state.error && <p>{this.state.error.message}</p>}
                </form>
              </div>
            </Modal>
          )}
      </div>  
    );
  }
}

export default withAuthorization(compose(withFirebase))(Home);
