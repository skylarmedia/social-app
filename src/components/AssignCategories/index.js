import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';

class AssignCategories extends Component{
    constructor(){
        super();
    }

    componentDidMount(){
        this
    }

    render(){
        return(
            <div>
                Assign Categories
            </div>
        )
    }
}

export default compose(
    withFirebase
)(AssignCategories)