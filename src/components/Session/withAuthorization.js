import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { Redirect } from 'react-router-dom';

const withAuthorization = condition => Component => {
  console.log('useru context', AuthUserContext);
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser ? this.setState({ authUser }) : console.log('not allowed');
      });
    }

    componentWillUnmount() {
      //   this.listener();
    }

    notAdmin = e => {
      alert('not authorized');
      // this.props.history.push(`/`);
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => {
            console.log('auth user', authUser);
            if (authUser && localStorage.getItem('skylarAdmin') === 'true') {
              return <Component {...this.props} />;
            } else {
              return <Redirect to="/" />;
            }
          }}
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
