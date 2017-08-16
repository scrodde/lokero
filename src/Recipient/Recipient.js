import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { push } from 'react-router-redux';
import faker from 'faker';
import PhoneNumber from 'awesome-phonenumber'   ;

import { colors, text } from '../theme';
import Heading from '../Heading/Heading';
import Button from '../Button/Button';
import NumberPad from '../NumberPad/NumberPad';

const tabs = [
  'Select resident',
  'Use phonenumber',
];

const residents = [];
_.times(30, (ix) => {
  residents.push({ name: faker.name.findName(), apartment: ix + 1, phone: '+358 40 123 1234', disableSMS: true });
});

class Recipient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab,
      phone: '',
    };
  }

  onSelect(recipient) {
    const { location, history } = this.props;
    history.push('/delivery/3', {
      ...location.state,
      recipient,
      phone: this.state.phone,
    });
  }

  switchTabs(index) {
    this.setState({
      activeTab: index,
    });
  }

  tabStyleAdjustements(index) {
    const adjustments = {};
    if (index === this.state.activeTab) { adjustments.backgroundColor = colors.dark; }
    return adjustments;
  }

  tabTextStyleAdjustements(index) {
    const adjustments = {};
    if (index === this.state.activeTab) { adjustments.color = colors.light; }
    return adjustments;
  }

  canSubmit() {
    const pn = new PhoneNumber(this.state.phone, 'FI' );
    return pn.isValid();
  }

  buttonStyle() {
    if (!this.canSubmit()) {
      return {};
    }
    return {
      backgroundColor: colors.primary,
    };
  }

  onSubmit() {
    const { location, history } = this.props;
    const pn = new PhoneNumber(this.state.phone, 'FI' );
    history.push('/delivery/3', {
      ...location.state,
      recipient: {
        phone: pn.getNumber(),
      },
      showPhone: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          {tabs.map((tab, ix) => (
            <TouchableOpacity key={ix} style={[styles.tab, this.tabStyleAdjustements(ix)]} onPress={(tab) => this.switchTabs(ix)}>
              <Text style={[styles.tabText, this.tabTextStyleAdjustements(ix)]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.content}>
          {this.state.activeTab === 0 && (
            <FlatList
              data={residents}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => this.onSelect(item)}
                  style={styles.item}
                >
                  <Text style={styles.itemTextLeft} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.itemTextRight} numberOfLines={1}>Apt. {item.apartment}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.apartment}
              style={styles.list}
            />
          )}
          {this.state.activeTab === 1 && (
            <View style={{ alignItems: 'center' }}>
              <NumberPad value={this.state.phone} length={13} onChange={(phone) => this.setState({ phone })} style={styles.numpad} />
              <Button title="Confirm" style={[styles.button, this.buttonStyle()]} onPress={() => this.onSubmit()} disabled={!this.canSubmit()} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

Recipient.propTypes = {
  activeTab: PropTypes.number.isRequired,
};

Recipient.defaultProps = {
  activeTab: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  list: {
    width: '80%',
    height: '80%',
    marginVertical: 80,
    borderWidth: 3,
    borderColor: colors.dark,
  },
  item: {
    borderBottomWidth: 3,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  itemTextLeft: {
    ...text,
    paddingHorizontal: 60,
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 80,
    width: '70%',
  },
  itemTextRight: {
    ...text,
    paddingHorizontal: 30,
    fontSize: 26,
    lineHeight: 80,
  },
  divider: {
    // borderRightStyle: 'dotted',
    borderRightWidth: 3,
    width: 0,
  },
  title: {
    fontSize: 70,
    textAlign: 'center',
  },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 160,
  },
  tab: {
    flex: 1,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.dark,
  },
  tabText: {
    ...text,
    paddingVertical: 20,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#F6F6F6',
  },
  numpad: {
    marginTop: 50,
    marginBottom: 40,
  }
});

export { Recipient };
