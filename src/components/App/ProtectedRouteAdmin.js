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
        } else if (isAuth.skylarAdmin === false) {
        }
      }else{
        return (
          <div className="mt-20 text-center">
            <Spin size="large" />
          </div>
        )
      }
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
