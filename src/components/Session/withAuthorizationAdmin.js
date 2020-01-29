
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorizationAdmin = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser.email == 'sky5@hotamil.com'
                        ? this.setState({ authUser })
                        : this.props.history.push(`/`);
                },
            );
        }


        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : <div>NOT AUTHORIZED</div>
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(withAuthorizationAdmin);
};

export default withAuthorizationAdmin;
