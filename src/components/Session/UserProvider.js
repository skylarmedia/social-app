import React, { createContext } from 'react';
import UserContext from './userContext';

class UserContextProvider extends Component {
  state = {
    authUser: null
  };

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <UserContext.Provider value='test'>{this.props.children}</UserContext.Provider>
    );
  }
}

export default UserContextProvider;