import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './index.css';
import Navigation from '../Navigation';

class NavigationWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }

  compenentDidMount(){
    let downCaret =  document.querySelector('.anticon-down')
    console.log('down', downCaret);
    
  }

  render() {
    if (localStorage.getItem('loggedIn') == "true") {
      return (
          <Navigation />
      );
    }else{
        return (
            <div></div>
        )
    }
  }
}

export default NavigationWrapper;
