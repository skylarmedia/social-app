import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../Session';

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
          alert('false');
        }
      }else{
        return <div>Loading</div>
      }
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
