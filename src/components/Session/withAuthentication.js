import React from 'react';
import { Redirect } from 'react-router-dom';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

class WithAuthentication extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: {
        skylarAdmin: 'browser'
      }
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      return authUser.getIdTokenResult().then(idTokenResult => {
        authUser.skylarAdmin = idTokenResult.claims.skylarAdmin;
        authUser.checked = true;
        if (idTokenResult.claims.skylarAdmin) {
          this.setState({
            authUser: authUser
          }, () => {
            return authUser.skylarAdmin;
          });
          
        }else{
          return <Redirect to="/" />
        }
      });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <AuthUserContext.Provider value={{ ...this.state.authUser }}>
        {this.props.children}
      </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(WithAuthentication);
