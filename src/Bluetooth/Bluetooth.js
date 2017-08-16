
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableHighlight,
  Platform,
  ListView,
  ScrollView
} from 'react-native';
import Dimensions from 'Dimensions';
import _ from 'lodash';
import { stringToBytes } from 'convert-string';
import TimerMixin from 'react-timer-mixin';
import reactMixin  from 'react-mixin';
import BluetoothConnection from './BluetoothConnection';
import Lock from './Lock';

const window = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class Bluetooth extends Component {
  constructor(props){
    super(props)

    this.state = {
      scanning: false,
      peripherals: [],
      connectedIds: [],
    };
  }

  componentWillMount() {
    this.setInterval(() => {
      const bc = BluetoothConnection.getInstance();
      bc.getConnectedPeripherals()
        .then((peripherals) => {
          this.setState({
            connectedIds: _.map(peripherals, (p) => p.id),
          });
        })
        .catch(() => console.log("could nnot fetch conencted devices."))
    }, 200);
  }

  scan() {
    if (this.state.scanning) { return; }
    console.log("hello");

    const bc = BluetoothConnection.getInstance();
    console.log("hello");
    bc.scan()
      .then((peripherals) => {
        console.log("hello22");
        console.log(peripherals);
        this.setState({
          ...this.state,
          peripherals,
          scanning: false,
        });
      })
      .catch(err => {
        this.setState({
          ...this.state,
          peripherals: [],
          scanning: false,
        });
        console.log(err);
      });

    this.setState({ ...this.state, scanning: true });
  }

  unlock() {
    const lock = Lock.getInstance();
    lock.open();
  }

  async toggleConnection(item) {
    const bc = BluetoothConnection.getInstance();
    if (await bc.isConnected(item.id)) {
      await bc.disconnect(item.id);
    } else {
      await bc.connect(item.id);
    }
  }

  reset() {
    const bc = BluetoothConnection.getInstance();
    bc.init();
    this.setState({ peripherals: [], scanning: false });
  }

  render() {
    const bc = BluetoothConnection.getInstance();
    const list = this.state.peripherals;
    const dataSource = ds.cloneWithRows(list);

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={() => this.reset()} >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this.scan() }>
          <Text style={styles.buttonText}>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
        </TouchableHighlight>
        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <ListView
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={(item) => {
              const color = this.state.connectedIds.indexOf(item.id) > -1 ? 'green' : '#fff';
              return (
                <TouchableHighlight onPress={() => this.toggleConnection(item) }>
                  <View style={[styles.row, {backgroundColor: color}]}>
                    <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
                    <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 10}}>{item.id}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </ScrollView>
        <TouchableHighlight style={styles.button} onPress={() => this.unlock()} >
          <Text style={styles.buttonText}>Unlock</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

reactMixin(Bluetooth.prototype, TimerMixin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    // height: window.height,
    marginTop: 120,

  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    padding:20,
    backgroundColor:'#ccc',
  },
  buttonText: {
    color: '#1C70FF',
    textAlign: 'center',
    fontSize: 24,
  },
});
