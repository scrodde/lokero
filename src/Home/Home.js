import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { push } from 'react-router-redux';

import Button from '../Button/Button';
import Heading from '../Heading/Heading';

import { text } from '../theme';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    };
  }

  componentWillMount() {
    this._pressStart = null;
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 400,              // Make it take a while
      }
    ).start();
  }

  handlePressIn() {
    this._pressStart = (new Date()).getTime();
  }

  handlePressOut() {
    const { history } = this.props;
    const deltaSeconds = ((new Date()).getTime() - this._pressStart) / 1000.0;
    if (deltaSeconds > 3) {
      history.push('/debug');
    }
  }

  render() {
    return (
      <Animated.View style={[styles.container, { opacity: this.state.fadeAnim }]}>
        <Heading title="Welcome!" />
        <Button
          title="Leave delivery"
          onPress={() => this.props.history.push('/delivery/1')}
          style={{ marginBottom: 60 }}
        />
        <Button
          title="Pickup delivery"
          onPress={() => this.props.history.push('/pickup')}
        />
        <TouchableWithoutFeedback onPressIn={(event) => this.handlePressIn(event)} onPressOut={(event) => this.handlePressOut(event)}>
          <View style={styles.hiddenButton} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    width: '100%',
    height: 100,
  },
});

export { Home };
