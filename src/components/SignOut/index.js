import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => {
  function triggerSignout(){
    firebase.doSignOut();
    localStorage.clear();
  }
  return (
    <button type="button" onClick={triggerSignout} className="sign-out-btn">
      Sign Out
    </button>
  );
};

export default withFirebase(SignOutButton);
