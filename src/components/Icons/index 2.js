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
    if(icon.approved == true){
        return <div class="approved-icon icon"></div>
    }
    if(icon.ad == true){
        return <div><img src={require('../assets/ad.svg')} alt="ad-svg" /></div>
    }
    if(icon.clientRead == false){
        return <div class="clientRead-icon icon"></div>
    }
    if(icon.clientRead == true){
        return <div class="clientNotRead-icon icon"></div>
    }
  };

  render() {
    return (
        <div>{this.getIcons(this.state.icon)}Icons</div>
    )
  }
}
export default Icons;
