import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import CalendarImage from '../CalendarImage';
import { Row, Col } from 'antd';
import app from 'firebase/app';
import CategoryList from '../CategoryList';
import { AuthUserContext } from '../Session';

class ClientDates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: [],
      categories: []
    };
    this.functions = app.functions();
    this.db = app.firestore();
  }

  componentDidMount() {
    console.log('ClientDate', this.props, this.state);

    this.db
      .collection('users')
      .doc(localStorage.getItem('clientName'))
      .collection('dates')
      .where('private', '==', false)
      .get()
      .then(res => {
        res.docs.map(item => {
          let dateObj = {};
          dateObj.month = item.data().month;
          dateObj.name = this.convertToMonth(item.data().month);
          dateObj.year = item.data().year;
          return this.setState({
            dates: [...this.state.dates, dateObj]
          });
        });
      });

    this.props.firebase
      .getUserUnusedCategories(localStorage.getItem('clientName'))
      .then(snapshot => {
        const catArr = [...this.state.categories];
        snapshot.docs.map((category, index) => {
          category.data()['mainId'] = category.id;
          return catArr.push(category.data());
        }, () => {
          this.setState({
            categories: catArr
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
    const dates = this.state.dates.map((item, index) => {
      return (
        <AuthUserContext.Consumer>
          {auth => {
            console.log('AUTH CALENDAR', auth);
            return (
              <Col span={6} key={index}>
                <Link to={`/client-calendar/${item.year}/${item.month}`}>
                  <CalendarImage
                    year={item.year}
                    month={item.month}
                    name={item.name}
                    userId={auth.displayName}
                    admin={false}
                  />
                  <p className="p-blue text-center">
                    {item.name} {item.year}
                  </p>
                </Link>
              </Col>
            );
          }}
        </AuthUserContext.Consumer>
      );
    });
    return (
      <AuthUserContext.Consumer>
        {authUser => {
          return (
            <React.Fragment>
              <h6 className="f-20 text-center margin-h2">
                Client {localStorage.getItem('p-blue')} Calendar
              </h6>
              <Row gutter={30} className="container mx-auto">
                <Col span={6}>
                  <span className="f-16 p-blue mb-20 d-inline-block">Categories</span>
                  <CategoryList colors={this.state.categories} />
                </Col>
                <Col span={18}>
                  <p className="mb-40 p-blue">Select a month to view it’s calendar.</p>
                  <Row gutter={30} className="p-blue">
                    {dates}
                  </Row>
                </Col>
              </Row>
            </React.Fragment>
          );
        }}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(ClientDates);
