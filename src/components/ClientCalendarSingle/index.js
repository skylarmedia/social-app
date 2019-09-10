import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';


// Make this a dumb component 

class ClientCalendarSingle extends Component {
    constructor(props) {
        super(props)

        this.state = {
            posts: [],
            currentPosts: []
        }
    }

    getMonthFromString = (mon) => {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
    }

    handleColor = (string) => {
        if (string !== undefined) {
            return string.split('|||')[1]
        }
    }

    render() {

        let linkMonth = this.getMonthFromString(this.props.month);

        const filtered = this.props.posts.filter(item => {
            return item.data().day == this.props.day
        });
        console.log(this.props.posts, 'flitered')

        const filteredList = filtered.map(item => {

            let friendlyUrl = item.data().title.toLowerCase().replace(/ /g, '-');
            let itemId = item.id;

            let selectedCategory = this.handleColor(item.data().selectedCategory);

            let clientTitleStyles = {
                backgroundColor: selectedCategory,
                height: "38px",
                display: "inline-block",
                position: "relative",
                width: "75%",
                marginLeft: "10px",
                paddingLeft: "5px",
                color: "#002D5B"
                /* padding: 10px; */
            }

            return (
                <div>
                    <Link to={`/view-post/${linkMonth}/${this.props.day}/${friendlyUrl}`} style={clientTitleStyles} className="">{item.data().title}{item.data}{selectedCategory}< br />
                        {item.data().clientRead != false ? '' : <img src={require('../assets/not-read.svg')} className="not-read" />}
                        {
                            item.data().approved ? <img src={require('../assets/check.svg')} className="check" /> : ''
                        }
                    </Link>

                </div>
            )
        }

        )

        return (
            <div>
                <p className="calendar-single-day">{this.props.day}</p>
                {filteredList}
            </div >
        )
    }
}

export default ClientCalendarSingle;