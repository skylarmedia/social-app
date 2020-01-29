import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ad from '../Ad';
import Icons from '../Icons';

// Make this a dumb component

class ClientCalendarSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      currentPosts: []
    };
  }

  getMonthFromString = mon => {
    return new Date(Date.parse(mon + ' 1, 2012')).getMonth() + 1;
  };

  handleColor = string => {
    if (string !== undefined) {
      return string.split('|||')[1];
    }
  };

  render() {
    let linkMonth = this.getMonthFromString(this.props.month);

    const filtered = this.props.posts.filter(item => {
      return item.data().day === this.props.day;
    });

    const filteredList = filtered.map(item => {
      let selectedCategory;
      if (item.data().color !== '') {
        selectedCategory = item.data().color;
      } else {
        selectedCategory = '#fff';
      }

      let clientTitleStyles = {
        backgroundColor: selectedCategory,
        color: '#002D5B'
      };
      return (
        <div className="outter-client-single">
          <Link
            to={`/view-post/${linkMonth}/${this.props.day}/${item.id}`}
            style={clientTitleStyles}
            className="label-button label-2"
          >
            {item.data().post[0].title}
            <br />
          </Link>
          <Ad ad={item.data().postAd} className="ad-icon" />
          <Icons
            approved={item.data().approved}
            clientNotification={item.data().clientNotification}
          />
        </div>
      );
    });

    return (
      <div className="main-outter-single">
        <div className="outter-cal-wrap">
          <p className="calendar-single-day">{this.props.day}</p>
          {filteredList}
        </div>
      </div>
    );
  }
}

export default ClientCalendarSingle;
