import React, { Component, useState } from 'react';
import { Modal } from 'antd';
import MainButton from '../MainButton';

class ClientSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  closeDelete = (clientId, name) => {
  
    this.setState({
      open: false
    }, () => {
      this.props.confirmDelete(clientId, name, this.props.index);
    });
  };

  showModal = () => {
    this.setState({
      open: true
    });
  };

  handleCancel = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { logo, name, clientId, index } = this.props;
    const styles = {
      backgroundImage: `url(${logo})`
    };

    const maskStyle = {
      backgroundColor: 'rgba(0,0,0,9.5)'
    };

    return (
      <div className="">
        <div style={styles} className="bg-image">
          <Modal
            visible={this.state.open}
            maskStyle={maskStyle}
            onCancel={this.handleCancel}
            wrapClassName="modal-wrapper message-modal"
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
                  onClick={() => this.closeDelete(clientId, name)}
                >
                  DELETE
                </button>
              </div>
            ]}
          >
            <div className="inner-btn">
              <h6 className="f-20 color-blue text-center">Delete Client?</h6>
              <p className="color-blue text-center">
                Are you sure you would like to delete this client? This action is permanent and
                cannot be un-done.
              </p>
            </div>
          </Modal>
          <button className="clear-btn top-delete color-blue f-16" onClick={() => this.showModal()} type="button">
            x
          </button>
        </div>
        <p className="text-center mt-5px mb-10">{name}</p>
      </div>
    );
  }
}

export default ClientSingle;
