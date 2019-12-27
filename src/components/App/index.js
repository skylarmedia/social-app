import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Admin Components
import NoMobile from '../NoMobile';
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
import AdminViewPost from '../AdminViewPost';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import './index.css';
import NavigationWrapper from '../NavigationWrapper';
import AssignCategories from '../AssignCategories';
import Logout from '../Logout';
import ClientDates from '../ClientDates';
import app from 'firebase/app';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null
    };
    this.auth = app.auth();
  }

  componentDidMount() {
    // this.props.firebase.auth.onAuthStateChanged(authUser => {
    //   authUser
    //     ? this.setState({ authUser })
    //     : this.setState({ authUser: null });
    // });
    this.auth.onAuthStateChanged(authUser => {
      authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
    });
    console.log('auth user', this.state.authUser);
  }
  render() {
    return (
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
          <Switch>
            <Route path="/no-mobile" component={NoMobile} />
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
            <Route exact path="/client/dates"
            render={(props) => <ClientDates {...props} authUser={this.state.authUser} />}
            />
            <Route exact path="/view-post/:month/:day/:id" component={ClientViewPost} />
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
    );
  }
}

const NoMatch = ({ location }) => <div>Sorry this page at {location.pathname} doesn't exist</div>;

export default App;

// OLD LAZT LOAD
// import React, { Suspense } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { withFirebase } from '../Firebase';

// import { AuthUserContext } from '../Session';
// import { spring, AnimatedSwitch } from 'react-router-transition';
// import * as ROUTES from '../../constants/routes';
// import { withAuthentication } from '../Session';
// import './index.css';
// import NavigationWrapper from '../NavigationWrapper';
// import Logout from '../Logout';
// import NoMobile from '../NoMobile';

// const Settings = React.lazy(() => import('../Settings'));
// const AddPost = React.lazy(() => import('../AddPost'));
// const EditPost = React.lazy(() => import('../EditPost'));
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

// // Lazy Loading

// const Home = React.lazy(() => import('../Home'));

// const isLoading = () => <div>Is Loading</div>;

// const App = () => {
//   return (
//     <Router basename={'/social-app-deploy'}>
//       <div id="outer-container">
//         <div className="d-flex nav-wrapper align-items-center">
//           <div className="d-flex justify-content-between w-100">
//             <div className="d-flex align-items-center">
//               <NavigationWrapper />
//               <h5>Skylar Media</h5>
//             </div>
//             <img
//               src={require('../assets/skylar-logo.svg')}
//               id="sky-logo"
//               className="align-self-center"
//             />
//           </div>
//         </div>
//         <Switch>
//           <Suspense fallback={isLoading}>
//             <Route path="/no-mobile" component={NoMobile} />
//             <Route exact path={`${process.env.PUBLIC_URL + '/'}`}>
//               <SignInPage />
//             </Route>
//             <Route path={`/add-post/:year/:month/:day/:clientId`}>
//               <AddPost />
//             </Route>
//             <Route path={`/sign-up`} component={SignUpPage} />

//             <Route path={ROUTES.SIGN_IN}>
//               <SignInPage />
//             </Route>

//             <Route exact path={ROUTES.HOME}>
//               <Home />
//             </Route>

//             <Route path={ROUTES.CLIENTS}>
//               <Clients />
//             </Route>

//             <Route path={ROUTES.DATES}>
//               <Dates />
//             </Route>

//             <Route path="/edit-post/:clientId/:postId">
//               <EditPost />
//             </Route>

//             <Route path="/assign-categories/:year/:month/:id">
//               <AssignCategories />
//             </Route>

//             <Route path="/client-calendar/:year/:month">
//               <ClientCalendar />
//             </Route>

//             <Route exact path="/client/:id/dates">
//               <ClientDates />
//             </Route>

//             <Route exact path="/view-post/:month/:day/:id">
//               <ClientViewPost />
//             </Route>
//             <Route path="/admin-view-post/:month/:day/:title/:client/:itemId">
//               <AdminViewPost />
//             </Route>
//             <Route path="/logout">
//               <Logout />
//             </Route>
//             <Route path="/calendar/:year/:month/:clientId">
//               <Calendar />
//             </Route>
//             <Route path="/settings">
//               <Settings />
//             </Route>
//             <Route component={NoMatch} />
//           </Suspense>
//         </Switch>
//         )
//       </div>
//     </Router>
//   );
// };

// const NoMatch = ({ location }) => <div>Sorry this page at {location.pathname} doesn't exist</div>;

// export default withAuthentication(App);
