import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import 'firebase/storage';
import { withAuthorization } from '../Session';
import CircularProgress from '@material-ui/core/CircularProgress';
import './index.css';
import { Modal, Button } from 'antd';
import ClientImage from '../ClientImage';
import { Row, Col } from 'antd';
import { Checkbox } from 'antd';
import { Input } from 'antd';
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
      visible: false,
      admin: false,
      visible2: false
    };

    this.baseState = this.state;
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleLogoUpload = this.handleLogoUpload.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.db = app.firestore();
    this.functions = app.functions();
    this.auth = app.auth();
  }

  // Component lifecycle methods

  componentDidMount() {
    this.props.firebase.getClients().then(snapshot => {
      const opened = snapshot.docs;
      let setArr = [...this.state.users];
      opened.map(item => {
        console.log('snapshot item', snapshot);
        setArr.push(item.data());
      });

      this.setState({
        users: setArr,
        isLoading: !this.state.isLoading
      });
    });
  }

  handleAdmin = () => {
    this.setState({
      admin: !this.state.admin
    });
  };

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
        loadSpinner: !this.state.loadSpinner
      },
      () => {
        console.log('USER ', this.state.username);
        this.state.firestorageRef
          .ref()
          .child(`${this.state.username}/logo/`)
          .put(this.state.file)
          .then(snapshot => {
            const encodedUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodeURIComponent(
              snapshot.metadata.fullPath
            )}?alt=media`;
            console.log('encoded URL in', encodedUrl);
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
      visible: true,
      username: '',
      backgroundUrl: '',
      passwordOne: '',
      email: ''
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  // Start Archive Modal
  showModal2 = () => {
    this.setState({
      visible2: true
    });
  };

  handleOk2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };

  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };

  // End Archive Modal

  confirmArchive = e => {
    this.props.firebase.archiveClient(localStorage.getItem('archiveId'));
    this.setState(
      {
        visible2: false,
        users: this.state.users.filter((_, i) => i !== parseInt(localStorage.getItem('tempIndex')))
      },
      () => {
        localStorage.removeItem('tempIndex');
      }
    );
  };

  archiveClient = (user, index) => {
    this.setState({
      visible2: true
    });

    localStorage.setItem('archiveId', user);
    localStorage.setItem('tempIndex', index);
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.state.firestorageRef
      .ref()
      .child(`${this.state.username}/logo/`)
      .put(this.state.file)
      .then(
        snapshot => {
          const encodedUrl = `https://firebasestorage.googleapis.com/v0/b/skylar-social-17190.appspot.com/o/${encodeURIComponent(
            snapshot.metadata.fullPath
          )}?alt=media`;
          console.log('encoded URL in', encodedUrl);
          const userObj = {};
          userObj.logo = this.state.backgroundUrl;
          userObj.name = this.state.username;
          userObj.urlName = this.state.username.toLowerCase().replace(/ /g, '-');
          console.log(`URL STATE ${this.state.backgroundUrl}`);

          this.auth
            .createUserWithEmailAndPassword(this.state.email, this.state.passwordOne)
            .then(user => {
              console.log(`user Obj`, user);
              this.db
                .collection('users')
                .doc(this.state.username)
                .set({
                  name: this.state.username,
                  logo: this.state.backgroundUrl,
                  userId: user.user.uid,
                  admin: this.state.admin,
                  email: this.state.email,
                  urlName: this.state.username.toLowerCase().replace(/ /g, '-'),
                  archived: false,
                  uid: user.user.uid
                });
              if (this.state.admin === true) {
                console.log('user Uid', user.user.uid);
                const createAdmin = this.functions.httpsCallable('createAdmin');
                const currentUser = new Object();
                currentUser.uid = user.user.uid;
                createAdmin(currentUser);
              }
            });

          // this.props.firebase.addUser(
          //   this.state.email,
          //   this.state.passwordOne,
          //   this.state.username,
          //   this.state.backgroundUrl
          // );

          this.setState({
            loadSpinner: false,
            visible: false,
            users: [...this.state.users, userObj],
            passwordOne: '',
            email: '',
            file: null
          });
        },
        () => {
          this.setState({});
        }
      );
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
        <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
        <h2 className="text-center welcome">Welcome Home!</h2>
        <Link to="/settings">GO TO SETTINGS TEMPORARY</Link>
        {this.state.isLoading && this.state.users.length > 0 ? (
          <div>
            <p className="text-center">What client do you want to work on today?</p>
            <Row gutter={30} id="client-list">
              {this.state.users.map((user, index) => {
                console.log('Loggeged User', user);
                return (
                  <Col
                    data-id={user.userId}
                    className="gutter-row client-wrapper flex-column d-flex mb-20"
                    span={6}
                    key={index}
                  >
                    <Modal
                      visible={this.state.visible2}
                      onOk={this.handleOk2}
                      onCancel={this.handleCancel2}
                      wrapClassName="message-modal"
                      footer={[
                        <React.Fragment>
                          <button
                            value={false}
                            onClick={this.handleCancel2}
                            className="main-button red-button"
                            type="button"
                          >
                            CANCEL
                          </button>
                          <button
                            value={true}
                            onClick={this.confirmArchive}
                            className="main-button white-button color-red"
                            type="button"
                          >
                            ARCHIVE
                          </button>
                        </React.Fragment>
                      ]}
                    >
                      <h6>Archive Client?</h6>
                      <p>Are you sure you would like to archive this client?</p>
                    </Modal>
                    <Link to={`/dates/${user.urlName}`}>
                      <ClientImage logo={user.logo} name={user.name} />
                    </Link>
                    <div className="d-flex align-items-center align-items-center">
                      <div className="position-relative x-wrapper mt-20 d-flex justify-content-center align-items-center w-100">
                        <Link to={`/dates/${user.urlName}`}>{user.name}</Link>
                        <button
                          onClick={() => this.archiveClient(user.urlName, index)}
                          className="archive-x"
                          type="button"
                        >
                          x
                        </button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            <div id="add-new-btn-wrapper" className="text-center">
              <button type="button" onClick={this.showModal} className="add-date-btn hidden-add">
                Add New
              </button>
            </div>
          </div>
        ) : this.state.isLoading && this.state.users.length == 0 ? (
          <div>
            <p className="text-center para-margin">
              You don’t seem to have any client calendars set up yet. Click below to add one and get
              started!
            </p>
            <div id="add-new-btn-wrapper" className="text-center mt-88">
              <button
                type="button"
                onClick={this.showModal}
                className="add-date-btn empty-add-date"
              >
                Add New
              </button>
            </div>
            <div className="empty-state">
              <div className="row justify-content-between">
                <div className="dashed" />

                <div className="dashed" />

                <div className="dashed" />

                <div className="dashed dashed-wrapper">
                  <img src={require('../assets/round-arrow.png')} className="round-arrow" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="progress-wrapper"></div>
        )}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          className="home-modal"
          onCancel={this.handleCancel}
          footer={[
            <button
              onClick={this.onSubmit}
              disabled={isInvalid}
              className="add-date-btn"
              type="button"
            >
              Submit
            </button>
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
                {this.state.loadSpinner === true ? <CircularProgress style={progressStyles} /> : ''}
              </div>
              <div className="mb-20">
                <Checkbox
                  onChange={this.handleAdmin}
                  name="admin"
                  value={this.state.admin}
                  id="admin"
                />
                <label className="margin-label ml-10 mt-10 color-white" for="admin">
                  Admin
                </label>
              </div>
              <Input
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                type="text"
                placeholder="CLIENT_NAME"
              />
              <Input
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="CLIENT_EMAIL"
              />
              <Input
                name="passwordOne"
                value={this.state.passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="PASSWORD"
              />

              {this.state.error && <p>{this.state.error.message}</p>}
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withAuthorization(compose(withFirebase))(Home);
