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
                console.log('authUser in protected route', authUser)
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

// export const ProtectedRoute = ({ component: Component, ...rest }) => {
//   return (
//     <AuthUserContext.Consumer>
//       {(isAuth) => {
//         console.log('is Auth', isAuth);
//         return (
//           <Route { ...isAuth} render={props => (isAuth ? <Component {...props} /> : <Redirect to="/" />)} />
//         );
//       }}
//     </AuthUserContext.Consumer>
//   );
// };
