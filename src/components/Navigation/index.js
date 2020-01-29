import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Button } from 'antd';

import './index.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => {
  return <NavigationAuth authUser={authUser} id="page-wrap" />;
};

const NavigationAuth = props => {
  const [drawerState, toggleDrawer] = useState(false);
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
                <img src={require('../assets/people.png')} alt="people icon"/>
                <Link to={ROUTES.HOME}>CLIENTS/HOME</Link>
              </li>
              <li>
                <img src={require('../assets/lock.png')} alt="lock icon"/>
                <SignOutButton />
              </li>
              <li id="settings-btn">
                <img src={require('../assets/settings.png')} alt="settings icon"/>
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
