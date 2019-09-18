import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import HiddenCalendarSingle from '../HiddenCalendarSingle';
import './index.css'

class CalendarSingle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            showCalendarModule: false
        }

        // this.toggleShowCalendarModule = this.toggleShowCalendarModule.bind
    }


    componentDidMount() {

    }


    toggleShowCalendarModule = () => {

        alert('ran');
        // this.setState({
        //     showCalendarModule: !this.state.showCalendarModule
        // })
    }


    toggleShowCalendarModule = () => {
        this.setState({
            showCalendarModule: !this.state.showCalendarModule
        })
    }

    truncate = (input) => input.length > 200 ? `${input.substring(0, 200)}...` : input;




    render() {

        // const hiddenPost = this.props.posts




        return (
            <div className="calendar-popup-wrapper">
                <p className="calendar-single-day">{this.props.day}</p><br />
                {this.props.posts.map((item, index) => {
                    if (item.data().month == this.props.month) {
                        if (item.data().day === this.props.day) {
                            console.log('ITEM IN CALENDAR', item.data())
                            return (
                                <div class="hidden-calendar-wrapper d-flex flex-column">
                                    { item.data().draft }
                                    {
                                        item.data().approved ?
                                            <img src={require('../assets/check.svg')} className="check" />
                                            :
                                            ''
                                    }

                                    {
                                        item.data().adminRead ? '' : <img src={require('../assets/not-read.svg')} className="not-read" />
                                    }
                                    {/* <h4>{item.data().post[0].title}</h4> */}
                                    
                                    {/* <div>
                                        {item.data().post[0].facebook && (
                                            <p>Facebook1</p>
                                        )}
                                        {item.data().post[0].instagram && (
                                            <p>Instagram</p>
                                        )}
                                        {item.data().post[0].linkedin && (
                                            <p>LinkedIn</p>
                                        )}
                                        {item.data().post[0].twitter && (
                                            <p>Twitter</p>
                                        )}
                                        {item.data().post[0].other && (
                                            <p>Other</p>
                                        )}
                                    </div> */}



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

                                        time={item.data().time} 
                                        links={item.data().links} 
                                        day={item.data().day} 
                                        month={item.data().month} 
                                        itemId={item.id} 
                                        push={this.props.history} 
                                       
                                        selectedCategory={item.data().selectedCategory} 
                                        adminRead={item.data().adminRead}
                                    />
                                </div>
                            )
                        }
                    }

                })}

            </div>
        )
    }
}

export default compose(
    withFirebase(CalendarSingle)
);