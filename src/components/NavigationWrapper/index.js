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
    return(
      <AuthUserContext.Consumer>
          {authUser => {
            console.log('auth user in header', authUser)
            return(
              <React.Fragment>
                {authUser.skylarAdmin ? <Navigation /> :
                <NavigationNonAuth />
                }
              </React.Fragment>
            )
          }}
      </AuthUserContext.Consumer>
    )

    // if (localStorage.getItem('skylarAdmin') === 'true') {
    //   return <Navigation />;
    // } else {
    //   return <div></div>;
    // }
  }
}

export default NavigationWrapper;
