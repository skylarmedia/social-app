import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './index.css';
import { Input } from 'antd';
import { withFirebase } from '../Firebase';
import { Spin, Icon } from 'antd';
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

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

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
      loading: true
    });
    const { email, password } = this.state;
    this.props.firebase.doSignInWithEmailAndPassword(email, password).then(value => {
      const getUid = this.functions.httpsCallable('getUid');
      const currentEmail = {};
      currentEmail.email = email;
      getUid(currentEmail).then(res => {
        if (res.data.customClaims !==  null && res.data.customClaims.skylarAdmin === true) {
          localStorage.clear();
          localStorage.setItem('skylarAdmin', true);
          localStorage.setItem('key', password);
          this.props.history.push('/home');
        } else {
          localStorage.clear();
          localStorage.setItem('clientUid', res.data.uid)
          localStorage.setItem('clientName', res.data.displayName.toLowerCase().replace(/ /g, '-'))
          this.props.history.push({
            pathname: `/client/dates`
          });
        }
      });
    })
    .finally(() => {
      this.setState({
        loading:false
      })
    })
    .catch(err => {
      console.log('err', err);
      this.setState({
        error:err
      })
    })
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <React.Fragment>
        <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" alt="wing logo"/>
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
            {error && <p>{error.message}</p>}
            <button
              disabled={isInvalid}
              type="submit"
              className="add-date-btn"
              id="sign-in-button"
            >
              Sign In
            </button>
          </div>
        </form>
        {this.state.loading && <Spin indicator={antIcon} />}
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
