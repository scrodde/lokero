import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { colors, text } from '../theme';

class Button extends Component {
  render() {
    const { title, onPress, style, ...rest } = this.props;
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...rest}>
        <Text numberOfLines={1} style={[text, styles.buttonText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
};

Button.defaultProps = {
  title: undefined,
  onPress: () => null,
  style: {},
};

const styles = StyleSheet.create({
  button: {
    width: 360,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: colors.primary,

  },
  buttonText: {
    color: colors.dark,
    textAlign: 'center',
  },
});

export default Button;
