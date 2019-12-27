import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
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


const mapDispatchToProps = dispatch => ({
    onSetMessage: message => dispatch({ type: 'MESSAGE_SENT', message }),
});


export default compose(
    withFirebase,
    connect(
        null,
        mapDispatchToProps
    )
)(ChatBox)