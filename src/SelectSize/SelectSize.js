import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Icon from 'react-native-vector-icons/Foundation';
import { push } from 'react-router-redux';
import TimerMixin from 'react-timer-mixin';
import reactMixin  from 'react-mixin';
import _ from 'lodash';

import Lock from '../Bluetooth/Lock';
import { colors, text } from '../theme';
import Heading from '../Heading/Heading';


const lockerSizes = [
  {
    description: '30x30x45cm',
    size:  90,
    title: 'S',
    available: false,
    attempted: false,
  },
  {
    description: '30x60x45cm',
    size:  120,
    title: 'M',
    available: true,
    attempted: false,
  },
  {
    description: '60x60x45cm',
    size:  140,
    title: 'L',
    available: false,
    attempted: false,
  },
];

class SelectSize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: _.cloneDeep(lockerSizes),
    };
  }

  componentWillUnmount() {
    console.log("componentWillUnmount()")
    this.setState({ items: _.cloneDeep(lockerSizes) });
  }

  clearAttempt(item) {
    const items = this.state.items.map((cur) => {
      if (cur.title == item.title) { cur.attempted = false; }
      return cur;
    });
    console.log("clearAttempt");
    this.setState({ items });
  }

  onSelect(item) {
    if (!item.available) {
      const items = this.state.items.map((cur) => {
        if (cur.title == item.title) { cur.attempted = true; }
        return cur;
      });
      this.setState({ items });
      return this.setTimeout(() => this.clearAttempt(item), 3000);
    }

    const { history, location } = this.props;
    const lock = Lock.getInstance();
    lock.open();
    history.push('/delivery/2', { size: item.value, locker: 5 });
  }

  itemStyleAdjustements(item) {
    const adjustments = {};
    if (item.available) { adjustments.backgroundColor = colors.primary; }
    return adjustments;
  }

  itemInnerStyleAdjustements(item) {
    const adjustments = {};
    if (!item.available) { adjustments.opacity = 0.35; }
    return adjustments;
  }

  render() {
    console.log("render");
    return (
      <View style={styles.container}>
        <Heading title="Select size" />
        <View style={styles.items}>
          {this.state.items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.onSelect(item)}
              style={[styles.item, this.itemStyleAdjustements(item)]}
            >
              <View style={[styles.itemInner, this.itemInnerStyleAdjustements(item)]}>
                <Image
                  source={require('../assets/img/box.png')}
                  style={[styles.image, { width: item.size, height: item.size }]}
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              {item.attempted && (
                <View style={styles.itemNotAvailable}>
                  <Icon name="info" style={styles.itemNotAvailableIcon} />
                  <Text style={styles.itemNotAvailableText}>All lockers taken</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

reactMixin(SelectSize.prototype, TimerMixin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 60,
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#F6F6F6',
  },
  itemInner: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  image: {
    marginTop: 10,
    marginBottom: 10,
  },
  itemTitle: {
    ...text,
    fontSize: 60,
    fontWeight: 'bold',
  },
  itemDescription: {
    ...text,
    fontSize: 20,
  },
  itemNotAvailable: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -60,
    left: 0,
    backgroundColor: 'transparent',
  },
  itemNotAvailableIcon: {
    fontSize: 30,
    top: -5,
    marginRight: 5,
  },
  itemNotAvailableText: {
    ...text,
    fontSize: 20,
  },
});

export { SelectSize };
