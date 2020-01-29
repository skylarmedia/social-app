import React, { Component } from 'react';
import './index.css';
import Navigation from '../Navigation';
import NavigationNonAuth from '../NavigationNonAuth';
import { Redirect } from 'react-router-dom';
import { AuthUserContext } from '../Session';
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
    return (
      <AuthUserContext.Consumer>
        {authUser => {
          if (authUser.skylarAdmin === true) {
            return <Navigation />;
          }
          if (authUser.skylarAdmin === false) {
            return <NavigationNonAuth />;
          } else {
            return;
          }
        }}
      </AuthUserContext.Consumer>
    );
  }
}

export default NavigationWrapper;
