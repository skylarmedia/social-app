import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Calendar from '../Calendar';
import CircularProgress from '@material-ui/core/CircularProgress';
import './index.css';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

// Category List
import SelectCategory from '../SelectCategory';
import CategoryList from '../CategoryList';

class Dates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      showAddDate: false,
      date: [],
      month: 1,
      year: 2019,
      chosenMonth: '',
      categories: [],
      chosenYear: '',
      showCat: false,
      showCalendar: false,
      clientId: '',
      isLoading: false,
      newColors: [],
      isLoading: false,
      removedCategories: [],
      passDates: (month, year) => {
        this.setState({
          chosenMonth: month,
          chosenYear: year,
          showCalendar: true
        });
      }
    };

    this.submitForm = this.submitForm.bind(this);
    this.closeCat = this.closeCat.bind(this);
  }

  componentWillMount() {
    this.props.firebase.getUID(this.props.match.params.id).then(snapshot => {
      snapshot.docs.map(item => {
        this.setState({
          clientId: item.data().userId,
          isLoading: !this.state.isLoading
        });
      });
    });

    this.props.firebase.getDates(this.props.match.params.id).then(snapshot => {
      const list = snapshot.docs;
      list.map(item => {
        const obj = {};
        const dateArr = this.state.date;
        obj['month'] = item.data().month;
        obj['year'] = item.data().year;
        obj['id'] = item.id;
        obj['privacy'] = item.data().privacy;
        dateArr.push(obj);
        this.setState({
          date: dateArr
        });
      });
    });

    this.props.firebase.getUserCategories(this.props.match.params.id).then(snapshot => {
      const catArr = [...this.state.categories];
      // console.log('cat arr', catArr)
      snapshot.docs.map((category, index) => {
        console.log('ID', category.data().categories);
        category.data()['mainId'] = category.id;
        catArr.push(category.data());
        console.log('catArr', catArr);
      });
      this.setState({
        categories: catArr,
        currentCategories: catArr
      });
    });
  }

  //*** START OF CATEGORY METHODS ***/

  removeCategory = (index, name) => {
    this.setState({
      categories: this.state.categories.filter((_, i) => i !== index),
      removedCategories: [...this.state.removedCategories, name]
    });

    this.props.firebase.removeCategoryNew(this.props.match.params.id, name);

    // console.log(this.state.removedCategories, 'removed categories');
  };

  showCategories = e => {
    e.preventDefault();
    this.setState({
      showCat: !this.state.showCat
    });
  };

  //** END OF CATEGORY METHODS ***/

  toggleAddDate() {
    this.setState({
      showAddDate: !this.state.showAddDate
    });
  }

  submitForm = e => {
    e.preventDefault();
    let tempDateObj = {};
    tempDateObj.month = this.state.month;
    tempDateObj.year = this.state.year;

    if (this.state.date.filter(e => e.month === tempDateObj.month).length > 0) {
      alert('Sorry that month is already in use, please select again');
    } else {
      this.props.firebase
        .addDate(this.props.match.params.id, this.state.month, this.state.year)
        .then(() => {
          window.location.reload();
        });
      this.setState({
        showAddDate: !this.state.showAddDate,
        date: [...this.state.date, tempDateObj]
      });
    }
  };

  convert(num) {
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

  handleMonth = e => {
    console.log(e.target.value, 'month event');
    this.setState({
      month: e.target.value
    });
  };

  handleYear = e => {
    console.log(e, 'year event');
    this.setState({
      year: e.target.value
    });
  };

  closeCat = () => {
    this.setState({
      showCat: !this.state.showCat
    });
  };

  deleteDate = (id, index) => {
    if (this.props.match.params.id !== undefined) {
      this.props.firebase.deleteDate(this.props.match.params.id, id);
    }

    this.setState({
      date: this.state.date.filter((_, i) => i !== index)
    });
  };

  sendCategories = (arr, arr2) => {
    const currentCat = [...this.state.categories];
    arr.map(item => {
      currentCat.push(item);
    });

    this.setState({
      showCat: !this.state.showCat,
      categories: currentCat
    });
    this.props.firebase.sendCategories(this.props.match.params.id, arr2);
  };

  render() {

    console.log(this.state, 'CATEGORIES')
    const renderDates = this.state.date.map((item, index) => (
      <div
        className="single-calendar-wrapper d-flex align-items-center justify-content-center"
        index={index}
        key={item.id}
      >
        <button onClick={() => this.deleteDate(item.id, index)} className="delete-date">
          x
        </button>
        <Link to={`/calendar/${item.year}/${item.month}/${this.props.match.params.id}`}>
          {this.convert(item.month)} {item.year}
          <br />
        </Link>
      </div>
    ));

    const selectStyles = {
      backgroundColor: '#fff',
      width: '269px',
      paddingLeft: '20px'
    };

    const formControlStyles = {
      margin: '20px',
      minWidth: 120
    };

    const inputStyles = {
      color: '#fff'
    };

    return this.state.isLoading && this.state.date.length > 0 ? (
      <div class="container">
        <Link to={`dates/${this.props.match.params.clientId}`}>Back To All Clients</Link>
        <h2 className="text-center" id="client-heading">
          Client A-Game’s Calendars
        </h2>
        <div id="outter-cat-wrapper">
          <div>
            <button onClick={this.showCategories} id="add-category-button" class="clear-btn d-flex justify-content-between">
              <span className="plus">+</span><p class="no-margin">Create Category</p>
            </button>
            <CategoryList colors={this.state.categories} removeCategory={this.removeCategory} />
            {this.state.showCat && (
              <div className="category-main-wrapper">
                <button onClick={() => this.closeCat()}>close</button>
                <SelectCategory
                  className="selected-categoryComponent"
                  userId={this.props.match.params.clientId}
                  getCategories={this.sendCategories}
                  removeCategory={() => this.removeCategory}
                />
              </div>
            )}
          </div>
        </div>
        <p className="text-center">Select a month to view it’s calendar.</p>
        <div id="dates-list" className="container row date-wrapper justify-content-center">
          {renderDates}
        </div>
        {this.state.showAddDate ? (
          <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
            <button onClick={this.toggleAddDate.bind(this)} className="toggle-close">
              x
            </button>
            <div className="d-flex justify-content-between inner-date-wrapper">
              <InputLabel htmlFor="month-helper">Month</InputLabel>

              <Select
                onChange={this.handleMonth.bind(this)}
                className="select-date"
                value={this.state.month}
                style={selectStyles}
                id="month-helper"
              >
                <MenuItem value="1">January</MenuItem>
                <MenuItem value="2">February</MenuItem>
                <MenuItem value="3">March</MenuItem>
                <MenuItem value="4">April</MenuItem>
                <MenuItem value="5">May</MenuItem>
                <MenuItem value="6">June</MenuItem>
                <MenuItem value="7">July</MenuItem>
                <MenuItem value="8">August</MenuItem>
                <MenuItem value="9">September</MenuItem>
                <MenuItem value="10">October</MenuItem>
                <MenuItem value="11">November</MenuItem>
                <MenuItem value="12">December</MenuItem>
              </Select>

              <Select
                onChange={this.handleYear.bind(this)}
                style={selectStyles}
                class="select-date"
                id="month-helper"
                value={this.state.year}
              >
                <MenuItem value="2019">2019</MenuItem>
                <MenuItem value="2020">2020</MenuItem>
              </Select>
            </div>
            <input type="submit" value="Submit" className="add-date-btn" />
          </form>
        ) : (
          ''
        )}
        {this.state.showCalender ? <Calendar impData={this.state} /> : ''}
        <div className="text-center">
          <button onClick={this.toggleAddDate.bind(this)} className="add-date-btn">
            Add New
          </button>
        </div>
      </div>
    ) : this.state.isLoading && this.state.date.length == 0 ? (
      <div className="container position-relative">
        {this.state.showAddDate ? (
          <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
            <button onClick={this.toggleAddDate.bind(this)} className="toggle-close">
              x
            </button>
            <div className="d-flex justify-content-between date-wrapper month-wrapper">
              <Select
                onChange={this.handleMonth.bind(this)}
                value={this.state.month}
                style={selectStyles}
              >
                <MenuItem value="1">January</MenuItem>
                <MenuItem value="2">February</MenuItem>
                <MenuItem value="3">March</MenuItem>
                <MenuItem value="4">April</MenuItem>
                <MenuItem value="5">May</MenuItem>
                <MenuItem value="6">June</MenuItem>
                <MenuItem value="7">July</MenuItem>
                <MenuItem value="8">August</MenuItem>
                <MenuItem value="9">September</MenuItem>
                <MenuItem value="10">October</MenuItem>
                <MenuItem value="11">November</MenuItem>
                <MenuItem value="12">December</MenuItem>
              </Select>
              <Select
                onChange={this.handleYear.bind(this)}
                style={selectStyles}
                value={this.state.year}
              >
                Placeholder
                <MenuItem value="2019">2019</MenuItem>
              </Select>
            </div>
            <input
              type="submit"
              value="Submit"
              className="add-date-btn"
              onSubmit={this.submitForm.bind(this)}
            />
          </form>
        ) : (
          ''
        )}
        <h2 className="text-center" id="client-heading">
          Client A-Game’s Calendars
        </h2>
        <img src={require('../assets/repeat-grid.svg')} id="no-date-calendar" />
        <p className="text-center client-text">
          You don’t seem to have any calendars set up yet. Click below to add one and get started!
        </p>
        <div className="text-center arrow-wrapper">
          <button onClick={this.toggleAddDate.bind(this)} className="add-date-btn">
            Add New
          </button>
          <img src={require('../assets/arrow.svg')} id="arrow" />
        </div>
      </div>
    ) : (
      <div className="progress-wrapper">
        <CircularProgress />
      </div>
    );
  }
}

export default compose(withFirebase(Dates));
