import React, { Suspense } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
// importfrom '../CalendarSingle';
import { withFirebase } from '../Firebase';
import { compose } from 'redux';
import { Switch } from 'antd';
import Legend from '../Legend';
import ListMode from '../ListMode';
import firebase from 'firebase';
const CalendarSingle = React.lazy(() => import('../CalendarSingle'));

const parts = window.location.search.substr(1).split('&');

const $_GET = {};
for (var i = 0; i < parts.length; i++) {
  var temp = parts[i].split('=');
  $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCalendarTable: true,
      showMonthTable: false,
      dateObject: moment(`${this.props.match.params.year}-${this.props.match.params.month}`),
      allmonths: moment.months(),
      showYearNav: false,
      selectedDay: null,
      clientId: '',
      currentMonth: 0,
      currentYear: 0,
      posts: [],
      private: true,
      privateId: null,
      selectedCategories: [],
      grid: true
    };

    this.showCategories = this.showCategories.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.unassignCategory = this.unassignCategory.bind(this);
    this.db = firebase.firestore();
  }

  weekdayshort = moment.weekdaysShort();

  gridMode() {
    this.setState({
      grid: true
    });
  }

  listMode() {
    this.setState({
      grid: false
    });
  }

  componentDidMount() {
    this.db
      .collection('users')
      .doc(this.props.match.params.clientId)
      .collection('categories')
      .where('selected', '==', true)
      .where('months', 'array-contains', parseInt(this.props.match.params.month))
      .get()
      .then(snapshot => {
        console.log('SNAP CAT', snapshot, snapshot.size);
        snapshot.docs.map(item => {
          this.setState({
            selectedCategories: [...this.state.selectedCategories, item.data()]
          });
        });
      });

    this.db
      .collection('users')
      .doc(this.props.match.params.clientId)
      .collection('dates')
      .where('month', '==', this.props.match.params.month)
      .where('year', '==', this.props.match.params.year)
      .get()
      .then(snapshot => {
        console.log('privacy', snapshot);
        snapshot.docs.map(item => {
          this.setState({
            private: snapshot.docs[0].data().private,
            privateId: snapshot.docs[0].id
          });
        });
      });

    this.props.firebase.getSocialPosts(this.props.match.params.clientId).then(snapshot => {
      this.setState({
        posts: snapshot.docs,
        isLoading: !this.state.isLoading,
        clientId: this.props.match.params.clientId
      });
    });
  }

  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format('Y');
  };
  currentDay = () => {
    return this.state.dateObject.format('D');
  };
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject)
      .startOf('month')
      .format('d'); // Day of week 0...1..5...6
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format('MMMM');
  };

  showMonth = (e, month) => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  setMonth = month => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('month', monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };

  MonthList = props => {
    let months = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d, i) => {
      return <tr key={i}>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };
  showYearEditor = () => {
    this.setState({
      showYearNav: true,
      showCalendarTable: !this.state.showCalendarTable
    });
  };

  onPrev = () => {
    let curr = '';
    if (this.state.showMonthTable == true) {
      curr = 'year';
    } else {
      curr = 'month';
    }
    this.setState({
      dateObject: this.state.dateObject.subtract(1, curr)
    });

    this.props.history.push(
      `/calendar/2019/${parseInt(this.props.match.params.month) - 1}/${
        this.props.match.params.clientId
      }`
    );
  };
  onNext = () => {
    let curr = '';
    if (this.state.showMonthTable == true) {
      curr = 'year';
    } else {
      curr = 'month';
    }

    this.props.history.push(
      `/calendar/2019/${parseInt(this.props.match.params.month) + 1}/${
        this.props.match.params.clientId
      }`
    );
    this.props.firebase
      .getSocialPosts(this.props.match.params.clientId, this.props.match.params.month)
      .then(snapshot => {
        this.setState({
          posts: snapshot.docs
        });
      });
    this.setState({
      dateObject: this.state.dateObject.add(1, curr)
    });
  };

  unassignCategory = (name, index) => {
    this.setState({
      selectedCategories: this.state.selectedCategories.filter((_, i) => i !== index)
    });

    this.props.firebase.unassignCategory(this.props.match.params.clientId, name);
  };

  setYear = year => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('year', year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearNav: !this.state.showYearNav,
      showMonthTable: !this.state.showMonthTable
    });
  };
  onYearChange = e => {
    this.setYear(e.target.value);
  };
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY'));
      currentDate = moment(currentDate).add(1, 'year');
    }
    return dateArray;
  }
  YearTable = props => {
    let months = [];
    let nextten = moment()
      .set('year', props)
      .add('year', 12)
      .format('Y');

    let tenyear = this.getDates(props, nextten);

    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      return <tr key={i}>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Yeah</th>
          </tr>
        </thead>
        <tbody>{yearlist}</tbody>
      </table>
    );
  };

  onDayClick = (e, d) => {
    this.setState(
      {
        selectedDay: d
      },
      () => {}
    );
  };

  getClientId = () => {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get('clientId');

    return c;
  };

  showCategories = e => {
    e.preventDefault();
    this.setState({
      showCat: !this.state.showCat
    });
  };

  handleSwitch = () => {
    this.setState(
      {
        private: !this.state.private
      },
      () => {
        this.db
          .collection('users')
          .doc(this.props.match.params.clientId)
          .collection('dates')
          .doc(this.state.privateId)
          .update({
            private: this.state.private
          });
      }
    );
  };

  render() {
    let weekdayshortname = this.weekdayshort.map(day => {
      return <th key={day}>{day}</th>;
    });
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{''}</td>);
    }
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay = d == this.currentDay() ? 'today' : '';
      daysInMonth.push(
        <td key={d} className={`calendar-day TEST ${currentDay}`}>
          <CalendarSingle
            day={d}
            posts={this.state.posts}
            month={this.props.match.params.month}
            clientId={this.props.match.params.clientId}
            history={this.props.history}
          />
          <Link
            to={`/add-post/2019/${this.props.match.params.month}/${d}/${this.props.match.params.clientId}`}
            className="add-post-link"
          >
            +
          </Link>
        </td>
      );
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr className="days-in-month" key={i}>{d}</tr>;
    });

    return (
      <React.Fragment>
        <div>
          <div className="container">
            <Link
              to={`/home`}
              className="back-link"
              className="d-flex align-items-center"
              id="main-backlink"
            >
              <img src={require('../assets/back.svg')} />
              Back to All Calendar Months
            </Link>
          </div>
          <div className="calendar-heading container mx-auto">
            <h2 className="text-center">Client {this.props.match.params.clientId} Calendar </h2>
            <p className="text-center">
              {this.month()} {this.year()}
            </p>
          </div>
          <div id="calendar-wing">
          <img src={require('../assets/skylar_Icon_wingPortion.svg')} id="wing-logo" />
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-10 container row mx-auto p-0">
              <div>
                <button onClick={() => this.listMode()} className="clear-btn">
                  {this.state.grid ? (
                    <img src={require('../assets/list-non-active.svg')} />
                  ) : (
                    <img src={require('../assets/listmode.svg')} />
                  )}
                </button>
                <button onClick={() => this.gridMode()} className="clear-btn">
                  {this.state.grid ? (
                    <img src={require('../assets/grid.svg')} />
                  ) : (
                    <img src={require('../assets/grid-non-active.svg')} />
                  )}
                </button>
              </div>
              <Switch
                value={this.state.private}
                checked={this.state.private}
                onChange={this.handleSwitch}
              />
            </div>
            (
            <div className="tail-datetime-calendar container">
              <div
                className={this.state.grid == true ? 'container calendar-navi mx-auto' : 'hidden'}
              ></div>
              <div className="calendar-date">
                {this.state.showYearNav && <this.YearTable props={this.year()} />}
                {this.state.showMonthTable && <this.MonthList data={moment.months()} />}
              </div>
              {this.state.showCalendarTable && this.state.grid && (
                <div className="calendar-date container mx-auto">
                  <table className="calendar-day">
                    <thead>
                      <tr id="weekdays">{weekdayshortname}</tr>
                    </thead>
                    <tbody>{daysinmonth}</tbody>
                  </table>
                </div>
              )}
            </div>

            {!this.state.grid && (
              <ListMode
                user={this.props.match.params.clientId}
                month={this.props.match.params.month}
                year={this.props.match.params.year}
              />
            )}
          </div>
        </div>
        <Legend
          month={this.props.match.params.month}
          year={this.props.match.params.year}
          selectedCategories={this.state.selectedCategories}
          removeCategory={this.unassignCategory}
          client={this.props.match.params.clientId}
        />
      </React.Fragment>
    );
  }
}
export default compose(
  withFirebase
  // ,withAuthorization(condition)
)(Calendar);
