import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Input } from 'antd';
import app from 'firebase/app';
import ClientSingle from '../ClientSingle';
import { Modal } from 'antd';
import './index.css';
import EditClients from '../EditClients';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      visible: false,
      deleteClient: '',
      deleteIndex: null,
      modalState: false,
      email: '',
      password: '',
      error: null,
      allClients: [],
      chosenClient: {},
      passwordModal: false,
      mainPassword: '',
      passwordTwo: '',
      username:''
    };

    this.reactivateClient = this.reactivateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.confirmArchive = this.confirmArchive.bind(this);

    this.auth = app.auth();
    this.functions = app.functions();
    this.db = app.firestore();
  }

  componentDidMount() {
    this.db
      .collection('users')
      .get()
      .then(snapshot => {
        let allClients = [...this.state.allClients];
        snapshot.docs.map(item => {
          return allClients.push(item.data());
        });
        this.setState({
          allClients: allClients
        });
      });

    this.props.firebase.getArchivedClients().then(snapshot => {
      let archivedClients = [...this.state.clients];
      snapshot.docs.filter(item => {
        archivedClients.push(item.data());
        return this.setState({
          clients: archivedClients
        });
      });
    });
  }

  confirmArchive = e => {
    if (e.target.value === 'true') {
      this.props.firebase.deleteClient(this.state.deleteClient);
      this.setState({
        clients: this.state.clients.filter((_, i) => i !== this.state.deleteIndex)
      });
    }
    this.setState({
      showDelete: !this.state.showDelete
    });
  };

  reactivateClient = (id, index) => {
    this.props.firebase.reactivateClient(id);
    this.setState({
      clients: this.state.clients.filter((_, i) => i !== index)
    });
  };

  getClientParent = (client, type) => {
    if (type === 'password') {
      this.setState({
        chosenClient: client,
        passwordModal: true
      });
    } else {
      this.setState({
        chosenClient: client,
        usernameModal: true
      });
    }
  };

  deleteClient = (id, index) => {
    this.setState({
      deleteClient: id,
      deleteIndex: index
    });
  };

  submitDeletion = () => {
    const auth = this.auth;
    if (
      this.state.password === localStorage.getItem('key') &&
      auth.currentUser.email === this.state.username
    ) {
      const deleteByUid = this.functions.httpsCallable('deleteByUid');
      let data = {};
      data.uid = localStorage.getItem('tempDeleteUserId');
      data.name = localStorage.getItem('tempDeleteUser');
      deleteByUid(data);
      this.setState({
        visible: false,
        clients: this.state.clients.filter(
          (_, i) => i !== parseInt(localStorage.getItem('tempIndex'))
        )
      });
    } else {
      this.setState({
        error: 'Sorry there was an error with your submission'
      });
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  confirmDeleteParent = (id, name, index) => {
    // Save user ID in localStorage to send up with
    localStorage.setItem('tempDeleteUser', name);
    localStorage.setItem('tempDeleteUserId', id);
    localStorage.setItem('tempIndex', index);
    this.setState({
      visible: true
    });
  };

  // Password Methods

  handlePasswordCancel = () => {
    this.setState({
      passwordModal: false
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changePassword = e => {
    e.preventDefault();
    const changeClientPassword = this.functions.httpsCallable('changeClientPassword');
    let functionObj = {};
    functionObj.uid = this.state.chosenClient.uid;
    functionObj.password = this.state.mainPassword;
    changeClientPassword(functionObj);
    this.setState({
      passwordModal: false
    });
  };

  //  Username Methods

  handleUsernameCancel = () => {
    this.setState({
      usernameModal: false
    });
  };

  changeUser = (e) => {
    e.preventDefault();
    const changeUsername = this.functions.httpsCallable('changeUsername');
    let functionObj = {};
    functionObj.uid = this.state.chosenClient.uid;
    functionObj.username = this.state.username;
    functionObj.oldUsername = this.state.chosenClient.name;
    changeUsername(functionObj);
    this.setState({
      usernameModal: false,
    });
  }

  render() {
    return (
      <div>
        {/* START PASSWORD MODAL  */}
        <Modal
          visible={this.state.usernameModal}
          onCancel={this.handleUsernameCancel}
          footer={null}
          wrapClassName="modal-wrapper message-modal"
        >
          <h2 className="p-blue f-20 text-center">Change Password</h2>
          <p className="text-center p-blue">{this.state.chosenClient.name}</p>
          <Input
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            type="text"
            placeholder="New Username"
            className="mb-10 blue-input m-320"
          />
          <button type="button" className="add-date-btn mt-20" onClick={this.changeUser}>Change Username</button>
        </Modal>
        {/* START PASSWORD MODAL  */}
        <Modal
          visible={this.state.passwordModal}
          onCancel={this.handlePasswordCancel}
          footer={null}
          wrapClassName="modal-wrapper message-modal"
        >
          <h2 className="p-blue f-20 text-center">Change Password</h2>
          <p className="text-center p-blue">{this.state.chosenClient.name}</p>
          <p className="text-center p-blue">{this.state.chosenClient.email}</p>
          <Input
            name="mainPassword"
            value={this.state.mainPassword}
            onChange={this.onChange}
            type="text"
            placeholder="PASSWORD"
            className="mb-10 blue-input m-320"
          />
          <Input
            name="passwordTwo"
            value={this.state.passwordTwo}
            onChange={this.onChange}
            type="text"
            placeholder="VERIFY PASSWORD"
            className="mb-10 blue-input m-320"
          />
          <button type="button" onClick={this.changePassword} className="clear-btn add-date-btn">
            Change Password
          </button>
        </Modal>
        {/* END PASSWORD MODAL  */}

        {/*  START DELETE MODAL  */}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName="message-modal"
          footer={[
            <div>
              <button
                type="button"
                onClick={this.handleCancel}
                className="red-btn delete-btn-main"
              >
                CANCEL
              </button>
              <button
                type="button"
                className="red-border-btn delete-btn-main"
                onClick={this.submitDeletion}
              >
                DELETE
              </button>
            </div>
          ]}
        >
          <div>
            <h6 className="f-20 color-blue text-center">Delete Client?</h6>
            <p className="color-blue text-center">
              To delete this client permanently please enter your credentials. Remember this action
              cannot be un-done.
            </p>
            <Input
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              type="text"
              placeholder="EMAIL"
              className="mb-10 blue-input m-320"
            />
            <Input
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              type="password"
              className="mb-10 blue-input m-320"
              placeholder="PASSWORD"
            />
            {this.state.error && <span className="color-red">{this.state.error}</span>}
          </div>
        </Modal>
        {/*  END DELETE MODAL  */}

        <h4 className="text-center f-20 mb-20 p-blue mt-35">Settings</h4>
        <div className="row container mx-auto">
          <div className="col-md-12">
            <h2 className="p-blue">Edit Client Info</h2>
            <p className="p-blue">
              Select a client below to re-set their username and/or password.
            </p>
            {this.state.allClients.map((client, index) => (
              <EditClients client={client} getClient={this.getClientParent} key={index} />
            ))}
          </div>
        </div>
        <h4 className="text-center f-20 mb-20 mt-35">Archived Clients</h4>
        <div className="row container mx-auto settings-client">
          {this.state.clients.map((item, index) => {
            return (
              <div className="col-sm-3" key={index}>
                <ClientSingle
                  name={item.name}
                  logo={item.logo}
                  clientId={item.uid}
                  modalState={this.state.modalState}
                  className="w-100"
                  confirmDelete={this.confirmDeleteParent}
                  index={index}
                />
                <button
                  onClick={() => this.reactivateClient(item.name, index)}
                  className="clear-btn text-center color-blue w-100"
                  type="button"
                >
                  <u>Reactivate Client</u>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default compose(withFirebase(Settings));
