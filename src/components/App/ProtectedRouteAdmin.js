import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../Session';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthUserContext.Consumer>
    {isAuth => {
      console.log('is Auth', isAuth)
      return (
        <Route
          render={props => {
            console.log('inside auth is', isAuth)
            return isAuth.skylarAdmin ? <Component {...props} /> : <Redirect to="/" />;
          }}
          {...rest}
        />
      );
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
