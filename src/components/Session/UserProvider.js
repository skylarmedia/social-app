import React, { createContext } from 'react';
import UserContext from './userContext';

class UserContextProvider extends Component {
  state = {
    authUser: null
  };

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      console.log('auth user', authUser);
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return <UserContext.Provider>{this.props.children}</UserContext.Provider>;
  }
}
