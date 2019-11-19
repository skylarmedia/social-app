import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
class CalendarImage extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            size:0
        }
    }
    
    componentWillMount(){
        console.log('props firebase', this.props)
        if(this.props){
            this.props.firebase.getMessagesWithId(this.props.userId, this.props.month)
            .then(snapshot => {
                this.setState({
                    size:snapshot.size
                })
            })
        }
        
    }

    render(){

        return(
            <div>
                <p>{this.state.size}</p>
                <img src={require('../assets/grouped-single-calendar.svg')} class="cal-img" />
                <Link to={`/client-calendar/${this.props.year}/${this.props.month}`}><p>{this.props.name} {this.props.year}</p></Link>
            </div>
        )
    }
}


export default withFirebase(CalendarImage);