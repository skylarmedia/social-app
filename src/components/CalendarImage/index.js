import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import app from 'firebase/app';
class CalendarImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0
    };
    this.functions = app.functions();
  }

  componentDidMount() {
    console.log('FUNCTION OBJ EMPTY' );
      let functionObj = new Object();
      const readMonths = this.functions.httpsCallable('readMonths');
      functionObj.userId = this.props.userId;
      functionObj.month = parseInt(this.props.month);
      console.log('FUNCTION OBJ', functionObj);
      readMonths(functionObj).then(res => {
        console.log('res user client', res);
        this.setState({
          size: res.data._size
        });
      });

    // if (this.props.admin == false) {

    // }else{
    //   let functionObj = new Object();
    //   const readMonthsAdmin = this.db.httpsCallable('readMonthsAdmin');
    //   functionObj.userId = this.props.userId
    //   functionObj.month = this.props.month
    //   readMonthsAdmin(functionObj).then(res => {
    //     this.setState({
    //       size: res.data._size
    //     });
    //   });
    // }
  }

  render() {
    return (
      <div className="position-relative">
        <p className="position-absolute bg-red size-int f-16 d-inline-flex justify-content-center align-items-center">{this.state.size}</p>
        <img src={require('../assets/grouped-single-calendar.svg')} className="cal-img" />
      </div>
    );
  }
}

export default withFirebase(CalendarImage);
