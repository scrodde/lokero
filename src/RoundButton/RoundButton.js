import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ART,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
const {
  Surface,
  Group,
  Shape,
  Path,
} = ART;

import { colors, text } from '../theme';
import Circle from '../Circle/Circle';


class RoundButton extends Component {
  render() {
    const { children, title, onPress, style, size, ...rest } = this.props;

    const strokeWidth = 4;
    const radius = (size - (strokeWidth / 2)) / 2;

    return (
      <TouchableOpacity style={[style, styles.button]} onPress={onPress} {...rest}>
        <View>
          <Surface width={size+strokeWidth} height={size+strokeWidth}>
            <Group x={strokeWidth / 2} y={strokeWidth / 2}>
              <Circle radius={radius} stroke={colors.dark} strokeWidth={strokeWidth}/>
            </Group>
          </Surface>
        </View>
        {children ? (
          children
        ) : (
          <Text numberOfLines={1} style={[styles.buttonText, { fontSize: size * 0.5, width: size, lineHeight: size }]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

RoundButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  size: PropTypes.number,
};

RoundButton.defaultProps = {
  title: undefined,
  onPress: () => null,
  style: {},
  size: 20,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    ...text,
    color: colors.dark,
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

export default RoundButton;
