import React, { Component } from 'react';

class Icons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icons: [],
      icon: null
    };
  }

  componentWillMount() {
    let iconState = {};
    iconState.approved = this.props.approved;
    iconState.ad = this.props.ad;
    iconState.clientRead = this.props.clientRead;
    this.setState({
      icon: iconState,
      icons: [...this.state.icons, this.props.approved, this.props.ad, this.props.clientRead]
    });
  }

  getIcons = icon => {
    if (icon.approved === true) {
      return <div class="approved-icon icon"></div>;
    }
    if (icon.clientRead === false) {
      return <div class="clientRead-icon icon"></div>;
    }
    if (icon.clientRead === true) {
      return <div class="clientNotRead-icon icon"></div>;
    }
    if (icon.adminNotifcation === true) {
      return <div>RED</div>;
    }
  };

  render() {
    return <React.Fragment>{this.getIcons(this.state.icon)}</React.Fragment>;
  }
}
export default Icons;
