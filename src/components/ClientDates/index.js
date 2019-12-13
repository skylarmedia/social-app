import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import CalendarImage from '../CalendarImage';

import app from 'firebase/app';

class ClientDates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: []
    };
    this.functions = app.functions();
    this.db = app.firestore();
  }


  componentDidMount() {
    console.log('ClientDate', this.props);

    this.db
      .collection('users')
      .doc(localStorage.getItem('clientName'))
      .collection('dates')
      .where('private', '==', false)
      .get()
      .then(res => {
      console.log('res', res)
      res.docs.map(item => {
        let dateObj = new Object();
        dateObj.month = item.data().month;
        dateObj.name = this.convertToMonth(item.data().month);
        dateObj.year = item.data().year;
        this.setState({
          dates: [...this.state.dates, dateObj]
        });
      });
    });
  }

  convertToMonth = num => {
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
  };

  render() {
    console.log(`state of client ${this.state.dates}`);
    const dates = this.state.dates.map(item => {
      return (
        <li>
          <CalendarImage
            year={item.year}
            month={item.month}
            name={item.name}
            userId={this.props.match.params.id}
            admin={false}
          />
          <Link to={`/client-calendar/${item.year}/${item.month}`}>
          <p>
            {item.name} {item.year}
          </p>
        </Link>
        </li>
      );
    });
    return (
      <div>
        <ul>{dates}</ul>
      </div>
    );
  }
}

export default withFirebase(ClientDates);
