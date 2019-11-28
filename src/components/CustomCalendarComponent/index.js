import React from 'react';
export default class CustomCalendarComponent extends React.Component {
  render() {
    return (
      <div>
        <input
          onClick={this.props.onClick}
          value={this.props.ipDate}
          onChange={e => this.props.handleIpChange(e.target.value)}
          type="input"
        />
      </div>
    );
  }
}
