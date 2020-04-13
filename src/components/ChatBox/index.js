import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: ''
    };

  }

  static getDerivedStateFromProps(props, state) {
    if (props.authUser !== state.authUser) {
      return {
        authUser: props.authUser
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.authUser !== prevState.authUser) {
      this.setState({
        authUser: this.props.authUser
      });
    }
  }



  render() {
    return (
      <div>
        <form onSubmit={this.submitMessage}>
          <textarea onChange={this.setMessage} value={this.state.message} onKeyDown={this.captureKey}/>
        </form>
        <span>

        </span>
      </div>
    );
  }
}


export default compose(
    withFirebase
)(ChatBox)