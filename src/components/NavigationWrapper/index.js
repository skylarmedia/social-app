import React, { Component } from 'react';
import './index.css';
import Navigation from '../Navigation';
import { Redirect } from 'react-router-dom';
class NavigationWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      mobile: false
    };
  }

  componentDidMount() {
    if (window.innerWidth < 900) {
      this.setState({
        mobile: true
      });
    }
  }

  render() {
    if (this.state.mobile === true) {
      return <Redirect to="no-mobile" />;
    }
    if (localStorage.getItem('loggedIn') === 'true') {
      return <Navigation />;
    } else {
      return <div></div>;
    }
  }
}

export default NavigationWrapper;
