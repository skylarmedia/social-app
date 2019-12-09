import React, { Component } from 'react';

const EditClients = props => {
  const { clients, getClient } = props;
  return (
    <div className="d-flex flex-column align-items-start">
      {clients.map(item => (
        <button type="button" onClick={getClient(item)} className="clear-btn p-0 mb-10"><u>{item.name}</u></button>
      ))}
    </div>
  );
};

export default EditClients;
