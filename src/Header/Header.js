import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class Header extends Component {
  render() {
    const { location } = this.props;
    if (location.pathname === '/' || location.pathname === '/success' ) {
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.history.goBack()}>
          <Icon name="arrow-left-circle" size={50} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  icon: {
    marginLeft: 80,
    marginTop: 60,
  }
});

export { Header };
