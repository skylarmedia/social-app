import React, { Component } from 'react';
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
      let functionObj = {};
      const readMonths = this.functions.httpsCallable('readMonths');
      functionObj.userId = this.props.userId;
      functionObj.month = parseInt(this.props.month);
      readMonths(functionObj).then(res => {
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
        <img src={require('../assets/grouped-single-calendar.svg')} className="cal-img" alt="calendar"/>
      </div>
    );
  }
}

export default withFirebase(CalendarImage);
