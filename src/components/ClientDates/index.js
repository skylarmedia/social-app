import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class ClientDates extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        console.log('ClientDate', this.props)
    }

    render(){
        return(
            <div>Client Works</div>
        )
    }
}

export default withFirebase(ClientDates)