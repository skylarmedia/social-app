import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import './index.css'

let timer = 0;
let delay = 200;
let prevent = false;

class HiddenCalendarSingle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isHiddenCalendar: false,
            clientId: '',
            image: ''
        }

        this.toggleIsHidden = this.toggleIsHidden.bind(this);
    }

    componentWillMount() {
        var url_string = window.location.href  //window.location.href
        var url = new URL(url_string);
        var c = url.searchParams.get("clientId");

        this.setState({
            clientId: c
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(prevProps, 'prev props');
    }

    toggleIsHidden = () => {
        let me = this;
        timer = setTimeout(function () {
            if (!prevent) {
                me.doClickAction();
            }
            prevent = false;
        }, delay);
    }

    doClickAction() {
        this.setState({
            isHiddenCalendar: !this.state.isHiddenCalendar
        })
    }

    doDoubleClickAction() {
        let friendlyUrl = this.props.title.replace(/ /g, '-').toLowerCase();
        this.props.push.push(`/admin-view-post/${this.props.month}/${this.props.day}/${friendlyUrl}/${this.props.clientId}/${this.props.itemId}`);
    }

    handleDoubleClick() {
        clearTimeout(timer);
        prevent = true;
        this.doDoubleClickAction();
    }

    truncate = (input) => input.length > 200 ? `${input.substring(0, 200)}...` : input;

    handleColor = (string) => {
        if (string !== undefined) {
            return string.split('|||')[1]
        }
    }


    render() {
        const friendlyUrlTitle = this.props.title.replace(/\s+/g, '-') + '-' + this.props.month + '-' + this.props.day
        const hiddenPost = () => (
            <div>
                <h4 className="text-center">{this.props.title}</h4>
                <p>{this.truncate(this.props.copy)}</p>
                <p>{this.props.time}</p>
                <p className="mb-0">{this.props.hashtags.map(item => (
                    <span>#{item} </span>
                ))}</p>
                <Link to={`/edit-post/${this.props.month}/${this.props.day}/${this.props.itemId}/${this.props.clientId}`}>Edit Post</Link>
            </div >
        )

        const buttonStyle = {
            background: this.handleColor(this.props.selectedCategory)
        }
        return (
            <React.Fragment>
                <TransitionGroup component={null}>
                    <button onClick={this.toggleIsHidden} onDoubleClick={this.handleDoubleClick.bind(this)} style={buttonStyle} className="label-button">{this.props.title}
                        {this.props.adminRead != false ? '' : <img src={require('../assets/not-read.svg')} className="not-read" />}
                    </button>
                    {this.state.isHiddenCalendar && (
                        <CSSTransition classNames="dialog" timeout={300}>
                            <div class="hidden-post">
                                {hiddenPost()}
                            </div>
                        </CSSTransition>
                    )

                    }
                </TransitionGroup>
            </React.Fragment>
        )
    }


}

export default compose(
    withFirebase(HiddenCalendarSingle)
)