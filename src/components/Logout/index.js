import React from 'react';
import { withFirebase } from '../Firebase';

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

export default withFirebase(Logout)