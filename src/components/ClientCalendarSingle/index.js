import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
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
    console.log('CLIENT POSTS', this.props.posts);
    let linkMonth = this.getMonthFromString(this.props.month);

    const filtered = this.props.posts.filter(item => {
      return item.data().day == this.props.day;
    });
    console.log(this.props.posts, 'flitered');

    const filteredList = filtered.map(item => {
      // let friendlyUrl = item.data().title.toLowerCase().replace(/ /g, '-');
      let itemId = item.id;
      let selectedCategory;
      if (item.data().color !== '') {
        selectedCategory = item.data().color;
      } else {
        selectedCategory = '#fff';
      }

      let clientTitleStyles = {
        backgroundColor: selectedCategory,
        height: '38px',
        display: 'inline-block',
        position: 'relative',
        width: '75%',
        marginLeft: '10px',
        paddingLeft: '5px',
        color: '#002D5B'
        /* padding: 10px; */
      };

      console.log('item in filter', item);

      return (
          <Link
            to={`/view-post/${linkMonth}/${this.props.day}/${item.id}`}
            style={clientTitleStyles}
            className="d-inline-block h-15"
          >
            {item.data().post[0].title}
            <br />
            <Icons 
                approved={item.data().approved} 
                ad={item.data().postAd} 
                clientNotification={item.data().clientNotification} 
            />
          </Link>
      );
    });

    return (
      <div className="h-100">
        <p className="calendar-single-day">{this.props.day}</p>
        {filteredList}
      </div>
    );
  }
}

export default ClientCalendarSingle;
