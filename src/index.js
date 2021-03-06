import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './components/Calendar/calendar.css';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

import store from './store';

import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render(
    <Provider store={store}>
        <FirebaseContext.Provider value={new Firebase()}>
            <App name="this is a name" />
        </FirebaseContext.Provider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
