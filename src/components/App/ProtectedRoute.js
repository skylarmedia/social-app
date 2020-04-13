import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../Session';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <AuthUserContext.Consumer>
      {authUser => {
        console.log('Auth User in protected route', authUser);
        return (
          <Route
            {...rest}
            render={props => {
              if (authUser.skylarAdmin === true) {
                return <Component {...props} />;
              } else {

                return (
                  <Redirect
                    to={{
                      pathname: '/',
                      state: {
                        from: props.location
                      }
                    }}
                  />
                );
              }
            }}
          />
        );
      }}
    </AuthUserContext.Consumer>
  );
};