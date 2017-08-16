import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { push } from 'react-router-redux';

import Lock from '../Bluetooth/Lock';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';
import Heading from '../Heading/Heading';
import NumberPad from '../NumberPad/NumberPad';

import { colors, text } from '../theme';

class Pickup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  onPress() {
    const lock = Lock.getInstance();
    lock.open();
    this.props.history.push('/success', {
      title: 'Pick up OK!',
    });
  }

  canSubmit() {
    return !!(this.state.code && this.state.code.length === 6);
  }

  buttonStyle() {
    if (!this.canSubmit()) {
      return {};
    }
    return {
      backgroundColor: colors.primary,
    };
  }

  render() {

    return (
      <View style={styles.container}>
        <Heading title="Enter code"/>
        <NumberPad value={this.state.code} length={6} style={styles.input} onChange={(code) => this.setState({ code })}/>
        <Button title="Confirm" style={[styles.button, this.buttonStyle()]} onPress={() => this.onPress()} disabled={!this.canSubmit()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 100,
  },
  button: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#F6F6F6',
  }
});

export { Pickup };
