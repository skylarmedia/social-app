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
    this.db = app.functions();
  }

  componentWillMount() {
    console.log('props firebase', this.props);
    // Function Call to Firebase Server

    if (this.props) {
      let functionObj = new Object();
      const readMonths = this.db.httpsCallable('readMonths');
      functionObj.userId = this.props.userId
      functionObj.month = this.props.month
      readMonths(functionObj).then(res => {
          console.log("RESPONSE GOTTEN")
        this.setState({
          size: res.data._size
        });
      });
    }
  }

  render() {
    return (
      <div>
        <p>{this.state.size}</p>
        <img src={require('../assets/grouped-single-calendar.svg')} class="cal-img" />
        <Link to={`/client-calendar/${this.props.year}/${this.props.month}`}>
          <p>
            {this.props.name} {this.props.year}
          </p>
        </Link>
      </div>
    );
  }
}

export default withFirebase(CalendarImage);
