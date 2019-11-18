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

  componentDidMount() {
    console.log('item message', this.props.messages);
  }

  render() {
    const { messages } = this.props;
    return (
      <div className="d-flex justify-content-end">
        {messages &&
          this.props.messages.map(item => {
            if (item.role == 'admin') {
              return <div class="admin-message-wrap">{item.message}</div>;
            } else {
              return <div class="client-message-wrapper">${item.message}</div>;
            }
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
