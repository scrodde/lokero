import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput as NativeTextInput,
  Text,
} from 'react-native';

import { colors, text } from '../theme';

class TextInput extends Component {
  render() {
    const { value, onChange, style, ...rest } = this.props;
    return (
      <NativeTextInput
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        clearButtonMode="always"
        style={[style, styles.input]}
        selectionColor={text.color}
        {...rest}
      />
    );
  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  onChange: (event) => null,
  style: {},
  value: undefined,
};

const styles = StyleSheet.create({
  input: {
    width: 400,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: colors.light,
    borderWidth: 3,
    marginBottom: 60,
    ...text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TextInput;
