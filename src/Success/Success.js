import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ART,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
const {
  Surface,
  Group,
  Shape,
  Path,
} = ART;
import Icon from 'react-native-vector-icons/Ionicons';
import { push } from 'react-router-redux';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import Heading from '../Heading/Heading';
import Circle from '../Circle/Circle';

import { colors, text } from '../theme';

class Success extends Component {

  componentDidMount() {
    this.setTimeout(() => {
      const { history } = this.props;
      history.go(-(history.length -1));
    }, 15000);
  }

  render() {
    const { recipient, title } = this.props;

    const size = 400;
    const radius = size / 2;
    const strokeWidth = 20;
    const adjustedRadius = radius - (strokeWidth/2);

    const circlePath = ART.Path()
      .move(adjustedRadius + (strokeWidth / 2), strokeWidth / 2)
      .arc(0, adjustedRadius * 2, adjustedRadius)
      // .arc(0, adjustedRadius * -2, adjustedRadius);


    const s = 80;
    const line = new ART.Path().move(s / 4, size / 2).line(s, s).line(s * 0.8, s * -2)

    return (
      <View style={styles.container}>
        <Heading title={title} />
        <View>
          <Surface width={size} height={size}>
            <Group x={0} y={0}>
              <Circle radius={radius} fill={colors.primary} />
              {/* <Shape d={circlePath} stroke={colors.dark} strokeWidth={strokeWidth} /> */}
              <Shape d={line} x={(size / 2) - 100} stroke={colors.dark} strokeWidth={10} strokeJoin="round" strokeCap="butt"/>
            </Group>
          </Surface>
        </View>
        {recipient && (
          <View style={styles.message}>
          <Text style={styles.text}>Message sent to:</Text>
          <View style={styles.divider} />
          {recipient.name && (
            <Text style={[styles.text, styles.name]}>{recipient.name} (Apt. {recipient.apartment})</Text>
          )}
          <Text style={styles.text}>{recipient.phone}</Text>
        </View>
        )}
      </View>
    );
  }
}
reactMixin(Success.prototype, TimerMixin);

Success.propTypes = {
  title: PropTypes.string.isRequired,
  recipient: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    position: 'absolute',
    bottom: 100,
  },
  text: {
    ...text,
    textAlign: 'center',
    lineHeight: 40,
    paddingHorizontal: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    borderTopWidth: 3,
    marginVertical: 10,
  }
});

export { Success };
