import React from 'react';
import { Route } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { message, Spin } from 'antd';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthUserContext.Consumer>
    {isAuth => {
      if (isAuth.skylarAdmin) {
        if (isAuth.skylarAdmin === true) {
          return (
            <Route
              render={props => {
                return <Component {...props} />;
              }}
              {...rest}
            />
          );
        } else {
          window.location.href = "/";
        }
      }
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
