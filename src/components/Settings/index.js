import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import MainButton from '../MainButton';
import ClientSingle from '../ClientSingle';
import { Modal } from 'antd';
import './index.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      visible: false,
      deleteClient: '',
      deleteIndex: null,
      modalState:false
    };

    this.reactivateClient = this.reactivateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.confirmArchive = this.confirmArchive.bind(this);
  }

  componentWillMount() {
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

  deleteClient = (id, index) => {
    this.setState({
      deleteClient: id,
      deleteIndex: index
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
      visible: false
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  confirmDeleteParent = name => {
    alert('deleted')
    this.setState({
      modalState: false
    })
  }

  showModalParent = () => {
    this.setState({
      modalState: true
    })
  }

  render() {
    return (
      <div>
        <h4 className="text-center">Settings</h4>
        <div className="row container mx-auto settings-client">
          {this.state.clients.map((item, index) => {
            console.log('client item', item);
            return <ClientSingle name={item.name} logo={item.logo} className="col-sm-3" clientId={item.userId} confirmDelete={() => this.confirmDeleteParent} modalState={this.state.modalState} />
          })}
        </div>
      </div>
    );
  }
}

export default compose(withFirebase(Settings));


        {/* <div className="col-sm-3 position-relative" key={index}> */}
                {/* <Modal
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
                <img src={item.logo} /> */}






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
