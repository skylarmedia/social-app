import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import './index.css';

class AdminChatLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      message: {}
    };
  }

  componentWillMount() {

  }

  render() {

    return (
      <div>
        {this.props.messages &&
          this.props.messages.map(item => {
            return (
              <li className="row align-items-center">
                <img src={`${item.logo}`} className="avatar-chat" />
                <p>{item.message}</p>
              </li>
            );
          })}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages => dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit => dispatch({ type: 'MESSAGES_LIMIT_SET', limit })
});

export default compose(
  withFirebase,
  connect(
    null,
    mapDispatchToProps
  )
)(AdminChatLog);
