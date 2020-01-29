import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Clients extends Component {
  render() {
    return (
      <div>
        <Link to="/add-new">Add New</Link>
      </div>
    );
  }
}

export default Clients;
