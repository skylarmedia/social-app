import React from 'react';
import { Link } from 'react-router-dom';

import './index.css'

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (

  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} id="page-wrap" /> : <NavigationNonAuth id="page-wrap" />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = (props) => (
  <div id="auth-nav-wrapper">
    <ul id="nav-id">
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.SETTINGS}>Settings</Link></li>
      <li>
        <SignOutButton />
      </li>
    </ul>
    {/* <div>
      <img src={props.authUser.photoURL} className="nav-avatar" />
      <p>{props.authUser.displayName}</p>
    </div> */}
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;