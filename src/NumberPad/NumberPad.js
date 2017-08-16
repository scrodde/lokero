import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors, text } from '../theme';
import RoundButton from '../RoundButton/RoundButton';


const buttons = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['+', 0, 'R'],
];

class NumberPad extends Component {

  onPress(val) {
    const { onChange, value, length } = this.props;
    let newVal = null;
    // Handle backspace
    if (val === 'R') {
      return value && value.length > 0 ? onChange(value.slice(0, - 1)) : '';
    }

    if (value.length < length) {
      return onChange('' + value + val);
    }
  }

  getValueArray() {
    const { value, length } = this.props;
    const valueArray = [];
    _.times(length, (ix) => {
      if (value && value.length >= ix) {
        valueArray.push(value.split('')[ix]);
      } else {
        valueArray.push(undefined);
      }
    });
    return valueArray;
  }
  // 'ios-backspace-outline'

  renderButton(value, ix) {
    return value === 'R' ? (
      <RoundButton key={ix} size={80} onPress={() => this.onPress(value)}>
        <Icon name="ios-backspace-outline" size={50} style={ { position: 'absolute', top: 15, left: 20, backgroundColor: 'transparent'}} />
      </RoundButton>
    ) : (
      <RoundButton key={ix} title={'' + value} size={80} onPress={() => this.onPress(value)}/>
    );
  }

  render() {
    const { title, value, style, ...rest } = this.props;



    return (
      <View style={style}>
        <View style={styles.display}>
        {this.getValueArray().map((char, ix) => (
          <View key={ix} style={styles.cell}>
            <Text style={styles.cellText}>{char}</Text>
          </View>
        ))}
        </View>
        {buttons.map((row, ix) => (
          <View key={ix} style={styles.row}>
            {row.map((button, ix) => this.renderButton(button, ix))}
          </View>
        ))}
      </View>
    );
  }
}

NumberPad.propTypes = {
  value: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.any,
};

NumberPad.defaultProps = {
  length: 0,
  value: undefined,
  onChange: () => null,
  style: {},
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    ...text,
    textAlign: 'center',
    padding: 30,
  },
  buttonText: {
    color: colors.dark,
    textAlign: 'center',
  },
  display: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  cell: {
    flex: 0,
    borderBottomWidth: 4,
    marginHorizontal: 10,
    width: 30,
    height: 74,
  },
  cellText: {
    ...text,
    fontSize: 50,
    lineHeight: 70,
    textAlign: 'center',
  }
});

export default NumberPad;
