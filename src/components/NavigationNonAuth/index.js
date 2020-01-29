import React, { useState } from 'react';
import { Drawer, Button } from 'antd';

import './index.css';

import SignOutButton from '../SignOut';

const NavigationNonAuth = () => {
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
                <img src={require('../assets/lock.png')} alt="lock icon" />
                <SignOutButton />
              </li>
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default NavigationNonAuth;
