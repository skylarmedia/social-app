import React from 'react';
import './index.css';

import { AuthUserContext } from '../Session';

const MenuButton = ({ authUser }) => (

  <AuthUserContext.Consumer>
    {authUser =>
      authUser && localStorage.getItem('loggedIn') == "true" ? <MenuButtonAuth /> : <div></div>
    }
  </AuthUserContext.Consumer>
);




const MenuButtonAuth = () => (
    <div id="menu-button">
        <div className="menu-line"></div>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
    </div>
)

export default MenuButton;