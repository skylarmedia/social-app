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

  closeDelete = clientId => {
    this.props.confirmDelete(clientId);
    this.setState({
      open: false
    });
  };

  showModal = () => {
    alert('ran');
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
    const { logo, name, clientId } = this.props;
    const styles = {
      backgroundImage: `url(${logo})`
    };

    const maskStyle = {
      backgroundColor: 'rgba(0,0,0,9.5)'
    };

    return (
      <div className="col-sm-3 mb-20">
        <div style={styles} className="bg-image">
          <Modal
            visible={this.state.open}
            maskStyle={maskStyle}
            onCancel={this.handleCancel}
            wrapClassName="modal-wrapper"
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
                  onClick={() => this.closeDelete(clientId)}
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
              <div></div>
            </div>
          </Modal>
          <button className="clear-btn top-delete color-blue f-16" onClick={() => this.showModal()}>
            x
          </button>
        </div>
        <p>{name}</p>
      </div>
    );
  }
}

export default ClientSingle;
