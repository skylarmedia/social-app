import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Button } from 'antd';

import './index.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => {
  let downCaret = document.querySelector('.anticon-down');
  console.log('down', downCaret);
  return <NavigationAuth authUser={authUser} id="page-wrap" />;
};

const NavigationAuth = props => {
  const [drawerState, toggleDrawer] = useState(false);
  var elem = document.querySelector('.anticon-down');
  console.log(elem);

  return (
    <div>
      <Button type="primary" onClick={() => toggleDrawer(true)} className="burger-button">
        <span className="bm-burger-bars"></span>
        <span className="bm-burger-bars"></span>
        <span className="bm-burger-bars"></span>
      </Button>
      <Drawer
        placement="left"
        closable={false}
        onClose={() => toggleDrawer(false)}
        visible={drawerState}
      >
        <div>
          <div id="auth-nav-wrapper">
            <ul id="nav-id">
              <li>
                <img src={require('../assets/people.png')} />
                <Link to={ROUTES.HOME}>CLIENTS/HOME</Link>
              </li>
              <li>
                <img src={require('../assets/lock.png')} />
                <SignOutButton />
              </li>
              <li id="settings-btn">
                <img src={require('../assets/settings.png')} />
                <Link to={ROUTES.SETTINGS}>Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
};


export default Navigation;
