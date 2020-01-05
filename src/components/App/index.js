import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// CSS IMPORTS

// Admin Components
import NoMobile from '../NoMobile';
// import Settings from '../Settings';
import SignUpPage from '../SignUp';
import Clients from '../Clients';
import Dates from '../Dates';
// import Calendar from '../Calendar';
// import CalendarSingle from '../CalendarSingle';
// import ClientCalendar from '../ClientCalendar';
import ClientViewPost from '../ClientViewPost';
import AdminViewPost from '../AdminViewPost';
import * as ROUTES from '../../constants/routes';
import WithAuthentication from '../Session/withAuthentication';
import './index.css';
import NavigationWrapper from '../NavigationWrapper';
// import AssignCategories from '../AssignCategories';
import Logout from '../Logout';
import ClientDates from '../ClientDates';
import app from 'firebase/app';
const SignInPage = React.lazy(() => import('../SignIn'));
const HomePage = React.lazy(() => import('../Home'));
const isLoading = () => <div>Is Loading</div>;
const AddPost = React.lazy(() => import('../AddPost'));
const EditPost = React.lazy(() => import('../EditPost'));
const AssignCategories = React.lazy(() => import('../AssignCategories'));
const Settings = React.lazy(() => import('../Settings'));
const Calendar = React.lazy(() => import('../Calendar'));
const ClientCalendar = React.lazy(() => import('../ClientCalendar'));
// const SignUpPage = React.lazy(() => import('../SignUp'));
// const SignInPage = React.lazy(() => import('../SignIn'));
// const Clients = React.lazy(() => import('../Clients'));
// const Dates = React.lazy(() => import('../Dates'));
// const Calendar = React.lazy(() => import('../Calendar'));
// const CalendarSingle = React.lazy(() => import('../CalendarSingle'));
// const ClientCalendar = React.lazy(() => import('../ClientCalendar'));
// const ClientViewPost = React.lazy(() => import('../ClientViewPost'));
// const AdminViewPost = React.lazy(() => import('../AdminViewPost'));
// const ClientDates = React.lazy(() => import('../ClientDates'));
// const AssignCategories = React.lazy(() => import('../AssignCategories'));

const App = () => (
  <WithAuthentication>
    <Router>
      <div id="outer-container">
        <div className="d-flex nav-wrapper align-items-center">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <NavigationWrapper />
              <h5>Skylar Media</h5>
            </div>
            <img
              src={require('../assets/skylar-logo.svg')}
              id="sky-logo"
              className="align-self-center"
            />
          </div>
        </div>
        <Suspense fallback={isLoading}>
          <Switch>
            {/* <Route path="/no-mobile" component={NoMobile} /> */}
            <Route exact path={`${process.env.PUBLIC_URL + '/'}`} component={SignInPage} />
            <Route path={`/add-post/:year/:month/:day/:clientId`} component={AddPost} />
            <Route path={`/sign-up`} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.CLIENTS} component={Clients} />
            <Route path={ROUTES.DATES} component={Dates} />
            <Route path="/edit-post/:clientId/:postId" component={EditPost} />
            <Route path="/assign-categories/:year/:month/:id" component={AssignCategories} />
            <Route path="/client-calendar/:year/:month" component={ClientCalendar} />
            <Route exact path="/client/dates" component={ClientDates} />
            <Route exact path="/view-post/:month/:day/:id" component={ClientViewPost} />
            <Route
              path="/admin  -view-post/:month/:day/:title/:client/:itemId"
              component={AdminViewPost}
            />
            <Route path="/logout" component={Logout} />
            <Route path="/calendar/:year/:month/:clientId" component={Calendar} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </Suspense>
        )
      </div>
    </Router>
  </WithAuthentication>
);

const NoMatch = ({ location }) => <div>Sorry this page at {location.pathname} doesn't exist</div>;

export default App;
