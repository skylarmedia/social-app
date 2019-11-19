import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import CalendarImage from '../CalendarImage';

class ClientDates extends Component{
    constructor(props){
        super(props);

        this.state = {
            dates: []
        }

        
    }

    // async componentDidMount(){
    // let month = await t
    // console.log('month data', this.month())
    // }



    componentDidMount(){
        console.log('ClientDate', this.props)



        this.props.firebase.getClientMonths(this.props.match.params.id)
        .then(res => {
            const emptyArr = [];
            
            res.docs.map(item => {
                
                // const total = this.getMessageLoad(this.props.match.params.id, item.data().month)
                // console.log('TOTAL', total)
                console.log('item', item.version)
                let dateObj = new Object();
                dateObj.month = item.data().month;
                dateObj.name = this.convertToMonth(item.data().month);
                dateObj.year = item.data().year;
                // getValue()
                // dateObj.total = total
                console.log('DATE OBJ', dateObj)
                
                this.setState({
                    dates:[...this.state.dates, dateObj]
                });
                
                    console.log(`item data mmyy`, item.data().month, item.data().year)
            
        
            });
        })
    }

    convertToMonth = (num) => {
        num = num - 1;
        const monthArr = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];
    
        const month = monthArr[num];
        return month;
      }

    render(){
        console.log(`state of client ${this.state.dates}`)
        const dates = this.state.dates.map(item => {
            let total = typeof('object') ? '' : item.total
            return(
                <li>
                    <CalendarImage year={item.year} month={item.month} name={item.name} total={total} userId={this.props.match.params.id} />
                </li>
            )
        })
        return(
            <div>
                <p>Client Works</p>
                <ul>
                    {dates}
                </ul>
                
            </div>
        )
    }
}

export default withFirebase(ClientDates)