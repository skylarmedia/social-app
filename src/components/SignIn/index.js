import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './index.css';
import { Input } from 'antd';
import TextField from '@material-ui/core/TextField';
import { withFirebase } from '../Firebase';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import app from 'firebase/app';

const SignInPage = () => (
  <React.Fragment>
    <div
      id="sign-in-wrapper"
      className="d-flex justify-content-center align-items-center flex-column"
    >
      <SignInForm />
    </div>
  </React.Fragment>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false
};

const currentClientMonth = new Date().getMonth();
const currentClientYear = new Date().getFullYear();

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
      month: currentClientMonth + 1,
      year: currentClientYear
    };

    this.functions = app.functions();
  }

  onSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: false
    });
    const { email, password } = this.state;
    this.props.firebase.doSignInWithEmailAndPassword(email, password).then(value => {
      console.log(`value in console: ${value}`);
      const getUid = this.functions.httpsCallable('getUid');
      const currentEmail = new Object();
      currentEmail.email = email;
      getUid(currentEmail).then(res => {
        console.log('RES PROPS', res);
        if (res.data.isAdmin === true) {
          localStorage.setItem('skylarAdmin', true);
          localStorage.setItem('key', password);
          this.props.history.push('/home');
        } else {
          this.props.history.push({
            pathname: `/client/${localStorage.getItem('userId')}/dates`,
            state: {
              userId: value.docs[0].data().urlName
            }
          });
        }
      });
    });

    //   if (value.docs[0].data().admin == 1) {
    //     localStorage.setItem('loggedIn', true);
    //     this.props.history.push({
    //       pathname: `/home`,
    //       state: {
    //         userId: value.docs[0].data().userId
    //       }
    //     })
    //   }
    //   else {
    //     console.log('return value in signIn', value);
    //     localStorage.setItem('userId', value.docs[0].data().urlName)
    //     this.props.history.push({
    //       pathname: `/client/${localStorage.getItem('userId')}/dates`,
    //       state: {
    //         userId: value.docs[0].data().urlName
    //       }
    //     });

    //   }
    // })
    // .catch(error => {
    //   this.setState({ error });
    // });

    // event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    console.log(this.props, 'props for settings user');
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <React.Fragment>
        <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
        Version.8
        <form onSubmit={this.onSubmit} className="d-flex flex-column align-items-center">
          <Input
            name="email"
            label="email"
            value={email}
            className="blue-input mb-10 f-16"
            onChange={this.onChange}
            type="text"
            placeholder="EMAIL"
            margin="normal"
            variant="outlined"
          />
          <Input
            name="password"
            value={password}
            className="blue-input f-16"
            label="password"
            onChange={this.onChange}
            type="password"
            variant="outlined"
            placeholder="PASSWORD"
          />
          <div id="sign-in-button-wrap">
            <Button
              disabled={isInvalid}
              type="submit"
              variant="contained"
              color="primary"
              id="sign-in-button"
            >
              Sign In
            </Button>
          </div>
          {error && <p>{error.message}</p>}
        </form>
        {this.state.loading && <CircularProgress />}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetUserId: authUser => dispatch({ type: 'SET_USER_ID', authUser })
});

const SignInForm = compose(
  withRouter,
  withFirebase,
  connect(
    null,
    mapDispatchToProps
  )
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
