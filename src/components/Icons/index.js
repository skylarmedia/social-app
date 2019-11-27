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
    let iconState = new Object();
    iconState.approved = this.props.approved
    iconState.ad = this.props.ad
    iconState.clientRead = this.props.clientRead
    this.setState({
      icon: iconState,
      icons: [...this.state.icons, this.props.approved, this.props.ad, this.props.clientRead]
    });
  }

  getIcons = (icon) => {
    console.log('ICON APPROVED', icon.approved)
    if(icon.approved == true){
        return <div class="approved-icon icon"></div>
    }
    if(icon.postAd == true){
        return <div><img src={require('../assets/ad.svg')} /></div>
    }
    if(icon.clientRead == false){
        return <div class="clientRead-icon icon"></div>
    }
    if(icon.clientRead == true){
        return <div class="clientNotRead-icon icon"></div>
    }
    if(icon.adminNotifcation == true){
      return <div >RED</div>
  }
  };

  render() {
    console.log('this icons', this.state.icon);
    return (
        <div>{this.getIcons(this.state.icon)}Icons</div>
    )
  }
}
export default Icons;
