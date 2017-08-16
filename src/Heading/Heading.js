import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { colors, text } from '../theme';

class Heading extends Component {
  render() {
    const { title, style, ...rest } = this.props;
    return (
      <Text numberOfLines={1} style={[styles.heading, style]}>
        {title}
      </Text>
    );
  }
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

Heading.defaultProps = {
  title: undefined,
  style: {},
};

const styles = StyleSheet.create({
  heading: {
    position: 'absolute',
    top: 180,
    ...text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Heading;
