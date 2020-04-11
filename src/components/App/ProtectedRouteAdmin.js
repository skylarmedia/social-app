import React from 'react';
import { Route } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { message } from 'antd';

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
        message.error('You do not have access to view this page, you will be redirected back to the home page');
        setTimeout(function(){
          window.location.href = "/";
        });
      }
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
