import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { withFirebase } from '../Firebase';

import { AuthUserContext } from '../Session';
import { spring, AnimatedSwitch } from 'react-router-transition';



// Admin Components

import HomePage from '../Home';
import Settings from '../Settings';
import AddPost from '../AddPost';
import EditPost from '../EditPost';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import Clients from '../Clients';
import Dates from '../Dates';
import Calendar from '../Calendar';
import CalendarSingle from '../CalendarSingle';
import ClientCalendar from '../ClientCalendar';
import ClientViewPost from '../ClientViewPost';
import HiddenCalendarSingle from '../HiddenCalendarSingle';
import AdminViewPost from '../AdminViewPost';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import './index.css';
import NavigationWrapper from '../NavigationWrapper';
import AssignCategories from '../AssignCategories';
import Logout from '../Logout';
import ClientDates from '../ClientDates';

const App = () => {

  function mapStyles(styles) {
    return {
      opacity: styles.opacity,
      transform: `scale(${styles.scale})`,
    };
  }
  
  // wrap the `spring` helper to use a bouncy config
  function bounce(val) {
    return spring(val, {
      stiffness: 330,
      damping: 22,
    });
  }
  
  // child matches will...
  const bounceTransition = {
    // start in a transparent, upscaled state
    atEnter: {
      opacity: 0,
      scale: 1.2,
    },
    // leave in a transparent, downscaled state
    atLeave: {
      opacity: bounce(0),
      scale: bounce(0.8),
    },
    // and rest at an opaque, normally-scaled state
    atActive: {
      opacity: bounce(1),
      scale: bounce(1),
    },
  };

  return(
    (
      <Router basename={'/social-app-deploy'}>
      <div id="outer-container">
        <div className="d-flex nav-wrapper align-items-center">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <NavigationWrapper />
              <h5>Skylar Media</h5>
            </div>
            <img src={require('../assets/skylar-logo.svg')} id="sky-logo" className="align-self-center" />
          </div>
         
        </div>
        <Switch>
          <Route exact path={`${process.env.PUBLIC_URL + '/'}`} component={SignInPage} />
          <Route path={`/add-post/:year/:month/:day/:clientId`} component={AddPost} />
          <Route path={`/sign-up`} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.CLIENTS} component={Clients} />
          <Route path={ROUTES.DATES} component={Dates} />
          <Route path="/edit-post/:clientId/:postId" component={EditPost} />
          <Route path="/assign-categories/:year/:month/:id" component={AssignCategories} />
          <Route exact path={`/calendar-single/:year/:month/:day`} component={CalendarSingle} />
          <Route path="/client-calendar/:year/:month" component={ClientCalendar} />
          <Route exact path="/client/:id/dates" component={ClientDates}/>
          <Route
            exact
            path="/view-post/:month/:day/:id"
            component={ClientViewPost}
            
            />
          />
          <Route
            path="/admin-view-post/:month/:day/:title/:client/:itemId"
            component={AdminViewPost}
          />
          <Route path="/logout" component={Logout} />
          <Route path="/calendar/:year/:month/:clientId" component={Calendar} />
          <Route path="/settings" component={Settings} />
          <Route component={NoMatch} />
        </Switch>
        )
      </div>
    </Router>
    )
  )
}

const NoMatch = ({ location }) => <div>Sorry this page at {location.pathname} doesn't exist</div>;

export default withAuthentication(App);
