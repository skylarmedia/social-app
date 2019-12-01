import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Calendar from '../Calendar';
import CircularProgress from '@material-ui/core/CircularProgress';
import './index.css';
import InputLabel from '@material-ui/core/InputLabel';
import CalendarImage from '../CalendarImage';
import { Modal, Button } from 'antd';

// Category List
import SelectCategory from '../SelectCategory';
import CategoryList from '../CategoryList';

import app from 'firebase/app';

import { Select } from 'antd';

const { Option } = Select;

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
      visible:false,
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

    this.db = app.functions();
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

    

    this.props.firebase.getUserUnusedCategories(this.props.match.params.id).then(snapshot => {
      console.log('snapshot in cat,', snapshot);
      console.log('rpos match parms', this.props.match.params.id);
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

  showModal = () => {
    alert('ran')
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  //*** START OF CATEGORY METHODS ***/

  removeCategory = (index, name) => {
    this.setState({
      categories: this.state.categories.filter((_, i) => i !== index),
      removedCategories: [...this.state.removedCategories, name]
    });

    this.props.firebase.removeCategoryNew(this.props.match.params.id, name);
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
    const renderDates = this.state.date.map((item, index) => (
      <div className="position-relative date-map-item " key={index}>
        <CalendarImage
          year={item.year}
          month={item.month}
          userId={this.props.match.params.id}
          admin={true}
        />
        <div className="d-flex justify-content-between">
          <Link
            to={`/calendar/${item.year}/${item.month}/${this.props.match.params.id}`}
            className="main-link"
          >
            {this.convert(item.month)} {item.year}
            <br />
          </Link>
          <button onClick={() => this.deleteDate(item.id, index)} className="delete-date">
            <img src={require('../assets/xsvg.svg')} />
          </button>
        </div>
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
      <div className="container row mx-auto date-page">
        <div className="col-sm-3">
          <div className="d-flex  back-wrapper">
            <img src={require('../assets/back.svg')} />
            <Link to={`dates/${this.props.match.params.clientId}`} className="back-link">
              Back To All Clients
            </Link>
          </div>

          <div id="outter-cat-wrapper">
            <div>
              <button
                onClick={this.showCategories}
                id="add-category-button"
                className="clear-btn d-flex"
              >
                <img src={require('../assets/select.svg')} />
                <p className="no-margin">Create Category</p>
              </button>

              {this.state.showCat && (
                <div className="category-main-wrapper">
                  <button onClick={() => this.closeCat()}>close</button>
                  <SelectCategory
                    className="selected-categoryComponent"
                    userId={this.props.match.params.clientId}
                    getCategories={this.sendCategories}
                    removeCategory={() => this.removeCategory}
                  />
                  <CategoryList
                    colors={this.state.categories}
                    removeCategory={this.removeCategory}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-9">
          <h2 className="text-center" id="client-heading">
            Client {this.props.match.params.clientId} Calendars
          </h2>
          <p className="text-left margin-40">Select a month to view it’s calendar.</p>
          <div id="dates-list" className="d-flex date-wrapper">
            {renderDates}
          </div>
          <Modal 
          visible={this.state.visible}
          onOk={this.handleOk}
          className="home-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.onSubmit} className="add-date-btn">Submit</Button>
          ]}>
            <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
              DATE!
              <div className="d-flex justify-content-between inner-date-wrapper">
                <InputLabel htmlFor="month-helper">Month</InputLabel>

                <Select
                  onChange={this.handleMonth.bind(this)}
                  className="select-date"
                  value={this.state.month}
                  id="month-helper"
                  placeholder="MONTH"
                >
                  <Option value="1">January</Option>
                  <Option value="2">February</Option>
                  <Option value="3">March</Option>
                  <Option value="4">April</Option>
                  <Option value="5">May</Option>
                  <Option value="6">June</Option>
                  <Option value="7">July</Option>
                  <Option value="8">August</Option>
                  <Option value="9">September</Option>
                  <Option value="10">October</Option>
                  <Option value="11">November</Option>
                  <Option value="12">December</Option>
                </Select>

                <Select
                  onChange={this.handleYear.bind(this)}
                  style={selectStyles}
                  className="select-date"
                  id="month-helper"
                  value={this.state.year}
                  placeholder="YEAR"
                >
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                </Select>
              </div>
              <input type="submit" value="Submit" className="add-date-btn" />
            </form>
            </Modal>
          {this.state.showCalender ? <Calendar impData={this.state} /> : ''}
          <div className="text-center add-btn-wrapper">
            <button onClick={this.showModal.bind(this)} className="add-date-btn">
              Add New1
            </button>
          </div>
        </div>
      </div>
    ) : this.state.isLoading && this.state.date.length == 0 ? (
      <div className="row justify-content-between container mx-auto date-page">
        <div className="col-md-3">
          <div className="d-flex  back-wrapper">
            <img src={require('../assets/back.svg')} />
            <Link to={`dates/${this.props.match.params.clientId}`} className="back-link">
              Back To All Clients
            </Link>
          </div>
        </div>
        <div className="col-md-8 position-relative">
 
            <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
              <button onClick={this.toggleAddDate.bind(this)} className="toggle-close">
                x
              </button>
              ADD DATE 2
              <div className="d-flex justify-content-between date-wrapper month-wrapper">
                <Select
                  onChange={this.handleMonth.bind(this)}
                  value={this.state.month}
                  placeholder="MONTH"
                >
                  <Option value="1">January</Option>
                  <Option value="2">February</Option>
                  <Option value="3">March</Option>
                  <Option value="4">April</Option>
                  <Option value="5">May</Option>
                  <Option value="6">June</Option>
                  <Option value="7">July</Option>
                  <Option value="8">August</Option>
                  <Option value="9">September</Option>
                  <Option value="10">October</Option>
                  <Option value="11">November</Option>
                  <Option value="12">December</Option>
                </Select>
                <Select
                  onChange={this.handleYear.bind(this)}
                  value={this.state.year}
                  placeholder="YEAR"
                >
                  Placeholder
                  <Option value="2019">2019</Option>
                </Select>
              </div>
              <input
                type="submit"
                value="Submit"
                className="add-date-btn"
                onSubmit={this.submitForm.bind(this)}
              />
            </form>
          <h2 className="text-center" id="client-heading">
            Client A-Game’s Calendars
          </h2>
          <p>
            You don’t seem to have any calendars set up yet. Click below to add one and <br />
            get started!
          </p>
          <div className="text-center">
            <img
              src={require('../assets/single-grid.svg')}
              id="no-date-calendar"
              className="col-md-4"
            />
          </div>
          <div className="text-center arrow-wrapper">
            <img src={require('../assets/curly-arrow.svg')} id="arrow" />
          </div>
        </div>
        <div className="col-md-1 margin-btn">
          <button onClick={this.showModal} className="add-date-btn">
            Add New1 
          </button>
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
