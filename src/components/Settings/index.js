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
      editClients: [],
      chosenClient: {},
      editModal: false
    };

    this.reactivateClient = this.reactivateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.confirmArchive = this.confirmArchive.bind(this);

    this.auth = app.auth();
    this.functions = app.functions();
    this.db = app.firestore();
  }

  componentDidMount() {

    // this.db
    // .collection('users')
    // .get()
    // .then(snapshot => {
    //   let editClients = [...this.state.editClients];
    //   snapshot.docs.map(item => {
    //     editClients.push(item.data());
    //     this.setState({
    //       editClients: editClients
    //     });
    //   });
    // });


    this.props.firebase.getArchivedClients().then(snapshot => {
      let archivedClients = [...this.state.clients];
      snapshot.docs.map(item => {
        archivedClients.push(item.data());
      });
      this.setState({
        clients: archivedClients
      });
    });
  }

  confirmArchive = e => {
    if (e.target.value == 'true') {
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

  getClientParent = client => {
    this.setState({
      chosenClient: client,
      editModal: true
    });
  };

  deleteClient = (id, index) => {
    this.setState({
      deleteClient: id,
      deleteIndex: index
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancelEdit = e => {
    this.setState({
      editModal: false
    });
  };

  submitDeletion = () => {
    const auth = this.auth;
    console.log(this.state.username);
    if (
      this.state.password === localStorage.getItem('key') &&
      auth.currentUser.email === this.state.username
    ) {
      const deleteByUid = this.functions.httpsCallable('deleteByUid');
      let data = new Object();
      data.uid = localStorage.getItem('tempDeleteUserId');
      data.name = localStorage.getItem('tempDeleteUser');
      deleteByUid(data).then(res => {
        console.log(`response: ${res}`);
      });
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <Modal
          visible={this.state.editModal}
          onOk={this.handleOkEdit}
          onCancel={this.handleCancelEdit}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
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
                type="button"
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
        <h4 className="text-center f-20 mb-20">Settings</h4>
        <div className="row container mx-auto">
          <div className="col-md-12">
            <h2>Edit Client Info</h2>
            <p>Select a client below to re-set their username and/or password.</p>
            <EditClients clients={this.state.editClients} getClient={this.getClientParent} />
          </div>
        </div>
        <h4 className="text-center f-20 mb-20">Archived Clients</h4>
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

{
  /* <div className="col-sm-3 position-relative" key={index}> */
}
{
  /* <Modal
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <MainButton
                    title="Delete Client?"
                    subtitle="Are you sure you would like to delete this client? This action is permanent and cannot be un-done."
                    buttonText="Delete"
                  />
                </Modal>

                <button
                  onClick={() => this.showModal()}
                  className="clear-btn top-delete color-blue f-16"
                >
                  x
                </button>
                <img src={item.logo} /> */
}

{
  /* <p className="text-center">{item.name}</p> */
}
{
  /* <button
                  onClick={() => this.reactivateClient(item.name, index)}
                  className="clear-btn text-center color-blue w-100"
                >
                  <u>Reactivate Client</u>
                </button> */
}
{
  /* </div> */
}
