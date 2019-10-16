import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';



class Logout extends React.Component{
    
    componentWillMount(){
        this.props.firebase.logout()
    }
    render(){
        return(
            <div>
            LOGOUT
            </div>
        )
    }
}

export default compose(
    withFirebase
)(Logout)