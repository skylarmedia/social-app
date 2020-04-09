import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../Session';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthUserContext.Consumer>
    {isAuth => {
      if (isAuth.skylarAdmin) {
        console.log('IS AUTH', isAuth);
        return (
            <Route
              render={props => {
                if(isAuth.skylarAdmin === true){
                  return <Component {...props} />;
                }else{
                  return <Redirect to="/" />
                }
              }}
              {...rest}
            />
          );
      }
    }}
  </AuthUserContext.Consumer>
);

export default ProtectedRoute;
