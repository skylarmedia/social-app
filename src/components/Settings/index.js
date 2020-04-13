import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import app from 'firebase/app';
import ClientSingle from '../ClientSingle';
import { Modal, message, Input, Spin } from 'antd';
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
      username: ''
    };

    this.reactivateClient = this.reactivateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.confirmArchive = this.confirmArchive.bind(this);

    this.auth = app.auth();
    this.functions = app.functions();
    this.db = app.firestore();
  }

  getAuthClients(){
    const getClients = this.functions.httpsCallable('GetAuthUsers');
    getClients().then(res => {
      this.setState({
        allClients: res.data.users
      });
    });

  }

  componentDidMount() {
   this.getAuthClients();
   this.getArchivedClients();
  }

  getArchivedClients(){
    this.props.firebase.getArchivedClients().then(snapshot => {
      let archivedClients = [...this.state.clients];
      snapshot.docs.filter(item => {
        console.log('item data', item.data());
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
  };

  reactivateClient = (id, index) => {
    this.props.firebase.reactivateClient(id);
    this.setState({
      clients: this.state.clients.filter((_, i) => i !== index)
    });
  };

  getClientParent = (client, type, index) => {
    switch(type){
      case 'delete':
        const deleteByUid = this.functions.httpsCallable('deleteByUid');
        let data = {};
        data.uid = client.uid;
        data.name = client.displayName;
        deleteByUid(data);
        this.props.firebase.deleteClient(client.displayName)
        .then(() => {
          this.setState({
            allClients: this.state.allClients.filter((_, i) => i !== index),
            clients: this.state.clients.filter((item) => {
              console.log('filter', item);
             return item.name !== client.displayName && item.Archived === true;
            })
          });
          message.success("Successfully Deleted Client");
          this.getArchivedClients();
        });
        break;
      case 'username':
        this.setState({
          chosenClient: client,
          usernameModal: true
        });
        break;
      case 'password':
        this.setState({
          chosenClient: client,
          passwordModal: true
        });
      break;
    }
  };

  deleteClient = (id, index) => {
    this.setState({
      deleteClient: id,
      deleteIndex: index
    });
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
    // Save user ID in localStorage to set up next modal
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
    functionObj.uid = this.state.chosenClient;
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

  changeUser = e => {
    e.preventDefault();
    const changeUsername = this.functions.httpsCallable('changeUsername');
    let functionObj = {};
    functionObj.uid = this.state.chosenClient.uid;
    functionObj.username = this.state.username;
    functionObj.oldUsername = this.state.chosenClient.displayName;
    changeUsername(functionObj).then(() => {
      this.setState(
        {
          usernameModal: false,
          allClients: []
        },
        () => {
          const getClients = this.functions.httpsCallable('GetAuthUsers');
          getClients().then(res => {
            this.setState({
              allClients: res.data.users
            });
          });
        }
      );
      message.success("Succesfully Changed Username");
    }, err => {
      return err;
    })
  };

  render() {
    const disabledUserChange = this.state.chosenClient.name === '';
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
          <button
            type="button"
            className="mt-20"
            onClick={this.changeUser}
            disabled={disabledUserChange}
          >
            Change Username
          </button>
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
          <button type="button" onClick={this.changePassword}>
            Change Password
          </button>
        </Modal>
        {/* END PASSWORD MODAL  */}


        <h4 className="text-center f-20 mb-20 p-blue mt-35">Settings</h4>
        <div className="row container mx-auto">
          <div className="col-md-12">
            <h2 className="p-blue">Edit Client Info</h2>
            <p className="p-blue">
              Select a client below to re-set their username and/or password.
            </p>

            {this.state.allClients.length > 0 ? this.state.allClients.map((client, index) => (
              <EditClients
                client={client}
                getClient={this.getClientParent}
                key={index}
                index={index}
                className="col-md-6"
              />
            )) : <div className="mt-20 text-center"><Spin size="large" /></div>}
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
