import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';


  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
          if(authUser){
            return authUser.getIdTokenResult().then(idTokenResult => {
              authUser.skylarAdmin = idTokenResult.claims.skylarAdmin
              this.setState({
                authUser: authUser
              })
              return authUser.skylarAdmin
            })
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={{...this.state.authUser}}>
          {this.props.children}
        </AuthUserContext.Provider>
      );
    }
  }

export default withFirebase(WithAuthentication);