import React, { useState } from 'react';
import { Popover } from 'antd';

const EditClients = props => {
  const { client, getClient } = props;
  const [popupState, togglePopup] = useState(false)
  console.log('clients', client);

  function runFile (type){
    getClient(client, type);
    togglePopup(false);
  }
  return (
    <div className="d-flex flex-column align-items-start">
      <button type="button" onClick={() => togglePopup(true)} className="clear-btn p-0 mb-10 p-blue">
        <u>{client.name}</u>
      </button>
      <Popover
        content={
          <React.Fragment>
          <button type="button" onClick={() => runFile('password')} className="clear-btn d-block">Change Password</button>
          <button type="button" onClick={() => runFile('username')} className="clear-btn d-block">Change Username</button>
          </React.Fragment>
          }
        trigger="click"
        visible={popupState}
        onVisibleChange={() => togglePopup(false)}
      > 
      </Popover>
    </div>
  );
};

export default EditClients;
