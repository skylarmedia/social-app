import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import HiddenCalendarSingle from '../HiddenCalendarSingle';
import './index.css';
import Icons from '../Icons';

class CalendarSingle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      showCalendarModule: false
    };
  }

  componentDidMount() {}

  toggleShowCalendarModule = () => {};

  toggleShowCalendarModule = () => {
    this.setState({
      showCalendarModule: !this.state.showCalendarModule
    });
  };

  truncate = input => (input.length > 200 ? `${input.substring(0, 200)}...` : input);

  render() {
    return (
      <div className="calendar-popup-wrapper">
        <p className="calendar-single-day">{this.props.day}</p>
        <br />
        {this.props.posts.map((item, index) => {
          if (item.data().month == this.props.month) {
            if (item.data().day === this.props.day) {
              return (
                <div class="hidden-calendar-wrapper d-flex flex-column">
                  {item.data().draft}
                  {/* {item.data().approved ? (
                    <img src={require('../assets/check.svg')} className="check" />
                  ) : (
                    ''
                  )} */}

                  <HiddenCalendarSingle
                    title={item.data().post[0].title}
                    facebook={item.data().post[0].facebook}
                    instagram={item.data().post[0].instagram}
                    linkedin={item.data().post[0].linkedin}
                    twitter={item.data().post[0].twitter}
                    other={item.data().post[0].other}
                    postDate={item.data().post[0].postDate}
                    ipDate={item.data().post[0].ipDate}
                    copy={item.data().post[0].copy}
                    hashtags={item.data().post[0].postHashTag}
                    postId={item.id}
                    clientId={this.props.clientId}
                    images={item.data().post[0].images}
                    time={item.data().time}
                    links={item.data().links}
                    day={item.data().day}
                    month={item.data().month}
                    itemId={item.id}
                    push={this.props.history}
                    selectedCategory={item.data().color}
                    adminRead={item.data().adminRead}
                    ad={item.data().post[0].ad}
                    approved={item.data().approved}
                    clientRead={item.data().clientRead}
                    clientNotifcation={item.data().clientNotifcation}
                  />
                </div>
              );
            }
          }
        })}
      </div>
    );
  }
}

export default compose(withFirebase(CalendarSingle));
