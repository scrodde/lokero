import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Config from 'react-native-config';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { push } from 'react-router-redux';
import _ from 'lodash';

import { writeToConnectedDevice } from '../Bluetooth/Bluetooth';
import Heading from '../Heading/Heading';
import Button from '../Button/Button';
import { text } from '../theme';

class Confirmation extends Component {

  onConfirm() {
    const { history, location } = this.props;
    this.notifySMS();
    history.push('/success', {
      ...location.state,
      title: 'Delivery OK!',
    });
  }

  notifySMS() {
    const { recipient } = this.props;
    if (recipient.disableSMS) { return; }

    const code  = _.random(100000, 999999);
    fetch('https://rest.nexmo.com/sms/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: Config.NEXMO_API_KEY,
        api_secret: Config.NEXMO_API_SECRET,
        to: recipient.phone,
        from: "Locker",
        text: `
Hey there! You have a package waiting for you.

Check the Locker at Arabia Design Center, 9th floor.

Code ${code}.`,
      })
    })
    .then(result => console.log(result))
    .then(error => console.log(error))
  }

  render() {
    const { recipient, showPhone } = this.props;
    const { name, apartment, phone } = recipient;
    return (
      <View style={styles.container}>
        <Heading title="Place package to locker" />
          {!showPhone ? (
            <View style={ { justifyContent: 'flex-start' }} >
              <View style={styles.row}>
                <Icon name="user" style={styles.icon} />
                <Text style={[styles.text, styles.name]}>{name}</Text>
              </View>
              <View style={[styles.row, styles.apartment]}>
                <Ionicon name="ios-pin" style={[styles.icon, { left: 2 }]} />
                <Text style={styles.text}>Apartment {apartment}</Text>
              </View>
            </View>
          ) : (
            <View style={ { justifyContent: 'flex-start' }} >
              <View style={[styles.row, styles.apartment]}>
                <MaterialIcon name="phone-iphone" style={[styles.icon, { left: -4 }]} />
                <Text style={styles.text}>{phone}</Text>
              </View>
            </View>
          )}
        <Button title="Lock it!" style={styles.button} onPress={() => this.onConfirm()}/>
      </View>
    );
  }
}

Confirmation.propTypes = {
  recipient: PropTypes.object.isRequired,
  showPhone: PropTypes.bool.isRequired,
};

Confirmation.defaultProps = {
  showPhone: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 50,
    fontSize: 40,
  },
  text: {
    ...text,
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    top: 3,
  },
  apartment: {
  },
  button: {
    position: 'absolute',
    bottom: 200,
  }
});

export { Confirmation };
