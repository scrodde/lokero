import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';

import './Reactotron.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import createHistory from 'history/createMemoryHistory';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';
import KeepAwake from 'react-native-keep-awake';
import Reactotron  from 'reactotron-react-native';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import reducers from './reducers' // Or wherever you keep your reducers
import Lock from './Bluetooth/Lock';

KeepAwake.activate();

const lock = new Lock();
lock.connect();

const tracker = new GoogleAnalyticsTracker('UA-56032980-7');
tracker.trackScreenView('/');

// or from 'reactotron-react-js'
// create our new saga monitor
const sagaMonitor = Reactotron.createSagaMonitor();

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

const timeoutId = null;
history.listen((location) => {
  tracker.trackScreenView(location.pathname);

  // Move back to Home after being idle for 90s...
  if (timeoutId) { clearTimeout(timeoutId); }
  const now = (new Date()).getTime();
  timeoutId = setTimeout(() => {
    history.go(-(history.length -1));
  }, 90000);
});

// Build the middleware for intercepting and dispatching navigation actions
const navigationMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = Reactotron.createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  {
    router: {
      location: {
        pathname: '/bluetooth',
      }
    }
  },
  applyMiddleware(
    navigationMiddleware,
    sagaMiddleware,
  ),
)

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/delivery/1'))
// store.dispatch(push('/success', {
//   title: 'Delivery OK!',
//   recipient: {
//     name: 'Jane Doe',
//     apartment: 26,
//     phone: '+358 40 123 1234'
//   },
// }));
// store.dispatch(push('/delivery/3', { name: 'Schröder ERerr', apartment: 16 }))
// store.dispatch(push('/delivery/2', { activeTab: 1 }))
// store.dispatch(push('/pickup'))
// store.dispatch(push('/debug'))

import { NativeRouter, Route, Link } from 'react-router-native'
import { Header } from './Header/Header';
import { Home } from './Home/Home';
import { SelectSize } from './SelectSize/SelectSize';
import { Recipient } from './Recipient/Recipient';
import { Confirmation } from './Confirmation/Confirmation';
import { Bluetooth } from './Bluetooth/Bluetooth';
import { Pickup } from './Pickup/Pickup';
import { Success } from './Success/Success';
import { AnimatedChildRoute } from './AnimatedChildRoute/AnimatedChildRoute';


// import Lock from './Bluetooth/Lock';

// const lock = new Lock();
// // const r = lock.connect()
// //   .then((r) => lock.open());
// console.log("lock.connect()");

// lock.open();

// console.disableYellowBox = true;

export default class locker extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <View style={styles.container}>
            <StatusBar hidden={true} />
            <Route path="/" component={Header}/>
            <View style={styles.content}>
              <Route exact path="/" component={Home}/>
              <Route exact path="/delivery/1" component={SelectSize}/>
              <Route exact path="/delivery/2" render={(props) => (
                <Recipient activeTab={props.location.state.activeTab} {...props} />
              )} />
              <Route exact path="/delivery/3" render={(props) => (
                <Confirmation recipient={props.location.state.recipient} showPhone={props.location.state.showPhone} {...props} />
              )}/>
              <Route exact path="/pickup" component={Pickup}/>
              <Route exact path="/success" render={(props) => (
                <Success title={props.location.state.title} recipient={props.location.state.recipient} {...props} />
              )}/>
              <Route exact path="/debug" component={Bluetooth}/>
            </View>
          </View>
        </ConnectedRouter>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  topic: {
    textAlign: 'center',
    fontSize: 15,
  }
})

AppRegistry.registerComponent('locker', () => locker);
