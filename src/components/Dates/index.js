import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Calendar from '../Calendar';
import { Skeleton } from 'antd';
import './index.css';
import CalendarImage from '../CalendarImage';
import { Modal } from 'antd';
import { Popover, Button } from 'antd';
import { Row, Col } from 'antd';

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
      year: new Date().getFullYear(),
      chosenMonth: '',
      categories: [],
      chosenYear: '',
      showCat: true,
      showCalendar: false,
      clientId: '',
      newColors: [],
      isLoading: false,
      removedCategories: [],
      visible: false,
      visibleCategories: false
    };

    this.submitForm = this.submitForm.bind(this);

    this.db = app.functions();
  }

  componentDidMount() {
    this.props.firebase.getUID(this.props.match.params.id).then(snapshot => {
      snapshot.docs.map(item => {
        return this.setState({
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
        return this.setState({
          date: dateArr
        });
      });
    });

    this.props.firebase.getUserUnusedCategories(this.props.match.params.id).then(snapshot => {
      const catArr = [...this.state.categories];
      snapshot.docs.map((category, index) => {
        category.data()['mainId'] = category.id;
        return catArr.push(category.data());
      });
      this.setState({
        categories: catArr,
        currentCategories: catArr
      });
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  //*** START OF CATEGORY METHODS ***/

  hide = () => {
    this.setState({
      visibleCategories: false
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible: true });
  };

  showCat = e => {
    // e.stopPropagation()
    this.setState({
      showCat: !this.state.showCat
    });
  };

  hideCat = e => {
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
      this.props.firebase.addDate(this.props.match.params.id, this.state.month, this.state.year);
      this.setState({
        showAddDate: !this.state.showAddDate,
        date: [...this.state.date, tempDateObj],
        visible: false
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
    this.setState({
      month: e
    });
  };

  handleYear = e => {
    this.setState({
      year: e
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

  sendCategories = cat => {
    this.setState({
      categories: [...this.state.categories, cat],
      visibleCategories: false
    });

    this.props.firebase.sendCategories(this.props.match.params.id, cat);
  };

  render() {
    const renderDates = this.state.date.map((item, index) => (
      <Col span={6} className="position-relative date-map-item" key={index}>
        <Link
          to={`/calendar/${item.year}/${item.month}/${this.props.match.params.id}`}
          className="main-link color-blue"
        >
          <CalendarImage
            year={item.year}
            month={item.month}
            userId={this.props.match.params.id}
            admin={true}
          />
        </Link>
        <div className="d-flex justify-content-between">
          <Link
            to={`/calendar/${item.year}/${item.month}/${this.props.match.params.id}`}
            className="main-link color-blue"
          >
            {this.convert(item.month)} {item.year}
            <br />
          </Link>
          <button onClick={() => this.deleteDate(item.id, index)} className="delete-date">
            <img src={require('../assets/xsvg.svg')} alt="x icon" />
          </button>
        </div>
      </Col>
    ));

    const content = (
      <div class="position-relative">
        <SelectCategory
          className="selected-categoryComponent"
          userId={this.props.match.params.clientId}
          getCategories={this.sendCategories}
          suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow svg" />}
        />
        <div className="position-absolute cat-outter-list">
          <CategoryList colors={this.state.categories} />
        </div>
      </div>
    );
    return this.state.isLoading && this.state.date.length > 0 ? (
      <div className="container row mx-auto date-page">
        <div className="col-sm-3">
          <div className="d-flex  back-wrapper">
            <Link to={`/home`}>
              <img src={require('../assets/back.svg')} alt="back icon"/>
              Back To All Clients
            </Link>
          </div>

          <div id="outter-cat-wrapper" className="position-relative">
            <div>
              <h4 className="color-blue f-16 mt-87">CATEGORIES</h4>
              <div id="trans-cat">
                <div className="position-relative">
                  <Popover
                    content={content}
                    trigger="click"
                    onChange={this.showCat}
                    onVisibleChange={this.hideCat}
                  >
                    <Button className="d-flex color-blue clear-btn align-items-center p-0">
                      <img src={require('../assets/select.svg')} alt="select svg" />
                      <p className="ml-10 color-blue">Create Category</p>
                    </Button>
                  </Popover>
                  {this.state.showCat && <CategoryList colors={this.state.categories} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-9">
          <h2 className="text-center color-blue" id="client-heading">
            Client {this.props.match.params.id} Calendars
          </h2>
          <p className="text-left margin-70 color-blue">Select a month to view it’s calendar.</p>
          <Row gutter={30} id="dates-list">
            {renderDates}
          </Row>
          <Modal
            visible={this.state.visible}
            onOk={this.handleOk}
            className="date-modal"
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.submitForm.bind(this)} className="add-date-btn">
                Submit
              </Button>
            ]}
          >
            <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
              <div className="d-flex justify-content-between inner-date-wrapper">
                <Select
                  onChange={this.handleMonth.bind(this)}
                  className="select-date"
                  id="month-helper"
                  placeholder="MONTH"
                  suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow svg"/>}
                >
                  <Select.Option value="1">January</Select.Option>
                  <Select.Option value="2">February</Select.Option>
                  <Select.Option value="3">March</Select.Option>
                  <Select.Option value="4">April</Select.Option>
                  <Select.Option value="5">May</Select.Option>
                  <Select.Option value="6">June</Select.Option>
                  <Select.Option value="7">July</Select.Option>
                  <Select.Option value="8">August</Select.Option>
                  <Select.Option value="9">September</Select.Option>
                  <Select.Option value="10">October</Select.Option>
                  <Select.Option value="11">November</Select.Option>
                  <Select.Option value="12">December</Select.Option>
                </Select>
                <i class="fas fa-caret-right"></i>
                <Select
                  onChange={this.handleYear.bind(this)}
                  className="select-date"
                  id="month-helper"
                  placeholder="YEAR"
                  suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow svg"/>}
                >
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                </Select>
              </div>
            </form>
          </Modal>
          {this.state.showCalender ? <Calendar impData={this.state} /> : ''}
          <div className="text-center add-btn-wrapper">
            <button onClick={this.showModal} className="add-date-btn">
              Add New
            </button>
          </div>
        </div>
      </div>
    ) : this.state.isLoading && this.state.date.length === 0 ? (
      <div className="row justify-content-between container mx-auto date-page">
        <div className="col-md-3">
          <div className="d-flex  back-wrapper">
            <Link to={`/home`}>
              <img src={require('../assets/back.svg')}  alt="back svg"/>
              Back To All Clients
            </Link>
          </div>
        </div>
        <div className="col-md-8 position-relative">
          <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
            <div className="d-flex justify-content-between date-wrapper month-wrapper">
              <Modal
                visible={this.state.visible}
                onOk={this.handleOk}
                className="date-modal"
                onCancel={this.handleCancel}
                footer={[
                  <Button onClick={this.submitForm.bind(this)} className="add-date-btn">
                    Submit
                  </Button>
                ]}
              >
                <form className="add-date-form" onSubmit={this.submitForm.bind(this)}>
                  DATE!
                  <div className="d-flex justify-content-between inner-date-wrapper">
                    <div className="position-relative">
                      <Select
                        onChange={this.handleMonth.bind(this)}
                        className="select-date"
                        id="month-helper"
                        placeholder="MONTH"
                        suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow svg"/>}
                        >
                        <Select.Option value="1">January</Select.Option>
                        <Select.Option value="2">February</Select.Option>
                        <Select.Option value="3">March</Select.Option>
                        <Select.Option value="4">April</Select.Option>
                        <Select.Option value="5">May</Select.Option>
                        <Select.Option value="6">June</Select.Option>
                        <Select.Option value="7">July</Select.Option>
                        <Select.Option value="8">August</Select.Option>
                        <Select.Option value="9">September</Select.Option>
                        <Select.Option value="10">October</Select.Option>
                        <Select.Option value="11">November</Select.Option>
                        <Select.Option value="12">December</Select.Option>
                      </Select>
                      <i class="fas fa-caret-right"></i>
                    </div>
                    <div className="position-relative">
                      <Select
                        onChange={this.handleYear.bind(this)}
                        className="select-date"
                        id="month-helper"
                        placeholder="YEAR"
                        suffixIcon={<img src={require('../assets/arrow.svg')} alt="arrow svg" />}
                      >
                        <Select.Option value="2019">2019</Select.Option>
                        <Select.Option value="2020">2020</Select.Option>
                      </Select>
                    </div>
                    <i class="fas fa-caret-right"></i>
                  </div>
                </form>
              </Modal>
            </div>
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
              alt="grid"
            />
          </div>
          <div className="text-center arrow-wrapper">
            <img src={require('../assets/curly-arrow.svg')} id="arrow" alt="curly arrow svg" />
          </div>
        </div>
        <div className="col-md-1 margin-btn">
          <button onClick={this.showModal} className="add-date-btn">
            Add New
          </button>
        </div>
      </div>
    ) : (
      <div className="progress-wrapper">
        <Skeleton active />
      </div>
    );
  }
}

export default compose(withFirebase(Dates));
