
import React, { Component } from 'react';
import {
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

import BluetoothConnection from './BluetoothConnection';

export const PERIPHERAL_ID = '5BC8F182-0A99-0E79-D124-6DDA88D51F71';
export const SERVICE_UUID = 'FFE0';
export const CHARACTERISTIC_UUID = 'FFE1';

let instance = null;

export default class Lock {

  constructor() {
    if(!instance){
      instance = this;
    }
    return instance;
  }

  static getInstance() {
    if(!instance) {
      return new Lock();
    }
    return instance;
  }

  async connect() {
    try {
      bc = BluetoothConnection.getInstance()
      if (await bc.isConnected(PERIPHERAL_ID)) {
        await bc.disconnect(PERIPHERAL_ID);
      }
      await bc.init();
      const peripherals = await bc.scan();
      return await bc.connect(PERIPHERAL_ID, true);
    } catch(err) {
      console.log("connect() error");
      console.log(err);
    }
  }

  async disconnect() {
    bc = BluetoothConnection.getInstance();
    return await bc.disconnect(PERIPHERAL_ID);
  }

  async isConnected() {
    bc = BluetoothConnection.getInstance();
    return await bc.isConnected(PERIPHERAL_ID);
  }

  async open() {
    bc = BluetoothConnection.getInstance();
    if (!await this.isConnected()) {
      console.log("not connected??")
      await this.connect();
    }
    console.log("trying to open")
    return await bc.writeString(PERIPHERAL_ID, SERVICE_UUID, CHARACTERISTIC_UUID, 'a');
  }
}
