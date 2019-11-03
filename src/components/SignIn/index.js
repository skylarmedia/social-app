import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './index.css'
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const SignInPage = () => (
  <React.Fragment>
    <div id="sign-in-wrapper" className="d-flex justify-content-center align-items-center flex-column">
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


const currentClientMonth = new Date().getMonth()
const currentClientYear = new Date().getFullYear();

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
      month: currentClientMonth + 1,
      year: currentClientYear
    };
  }


  onSubmit = event => {
    this.setState({
      loading: !this.state.loading
    })
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password).then(value => {
        if (value.docs[0].data().admin == 1) {
          localStorage.setItem('loggedIn', true);
          this.props.history.push({
            pathname: `/home`,
            state: {
              userId: value.docs[0].data().userId
            }
          })
        }
        else {
          localStorage.setItem('userId', value.docs[0].data().urlName)
          this.props.history.push({
            pathname: `/client-calendar/${this.state.year}/${this.state.month}`,
            state: {
              userId: value.docs[0].data().urlName
            }
          })

        }
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };



  render() {

    console.log(this.props, 'props for settings user')
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <React.Fragment>
        <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
        <form onSubmit={this.onSubmit} className="d-flex flex-column align-items-center">
          <TextField
            name="email"
            label="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            margin="normal"
            variant="outlined"
          />
          <TextField
            name="password"
            value={password}
            label="password"
            onChange={this.onChange}
            type="password"
            variant="outlined"
            placeholder="Password"
          />
          <div id="sign-in-button-wrap">
            <Button disabled={isInvalid} type="submit" variant="contained" color="primary" id="sign-in-button">Sign In</Button>
          </div>
          {error && <p>{error.message}</p>}
        </form>
        {
          this.state.loading && (
            <CircularProgress />
          )
        }
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetUserId: authUser =>
    dispatch({ type: 'SET_USER_ID', authUser }),
});

const SignInForm = compose(
  withRouter,
  withFirebase,
  connect(
    null,
    mapDispatchToProps
  ),
)(SignInFormBase);

export default SignInPage;

export { SignInForm };