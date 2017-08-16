
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

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

let instance = null;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default class BluetoothConnection {

  constructor() {
    if(!instance){
      instance = this;
      this.init();
    }

    return instance;
  }

  static getInstance() {
    if(!instance) {
      return new BluetoothConnection();
    }
    return instance;
  }

  async init() {
    try {
      await BleManager.start({ showAlert: true, allowDuplicates: false });

      this.isScanning = false;

      this.handleStopScan = this.handleStopScan.bind(this);
      this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );

      this.handleConnectPeripheral = this.handleConnectPeripheral.bind(this);
      this.handlerConnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleConnectPeripheral );

      this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
      this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );

      this.hasInit = true;
      this.keepAlivePeripherals = new Map();
      // this.keepAlivePeripherals.set('lolol', 'lolol')

      if (this.keepAliveIntervalId) { clearInterval(this.keepAliveIntervalId) }
      this.keepAliveIntervalId = setInterval(this.keepAlive.bind(this), 3000);

    } catch (error) {
      console.log("init() error");
      console.log(error);
      return false;
    }
    return true;
  }

  async scan(timeout = 3) {
    try {
      if (!this.hasInit) {
        await this.init();
      }
      const duration = Math.max(0.1, Math.min(timeout, 5));
      this.isScanning = true;
      await BleManager.scan([], duration, true);
      await sleep((duration * 1000) + 500);
      const peripherals = await BleManager.getDiscoveredPeripherals();
      return peripherals;
    } catch (error) {
      console.log("connect() error");
      console.log(error);
      return false;
    }
  }

  async connect(peripheralId, keepAlive = false) {
    try {
      if (!this.hasInit) {
        await this.init();
      }
      await BleManager.connect(peripheralId);
      if (keepAlive) {
        this.keepAlivePeripherals.set(peripheralId, peripheralId);
      }
    } catch (error) {
      console.log("connect() error");
      console.log(error);
      return false;
    }
    return true;
  }

  async disconnect(peripheralId) {
    try {
      this.keepAlivePeripherals.delete(peripheralId);
      await BleManager.disconnect(peripheralId);
    } catch (error) {
      console.log("disconnect() error");
      console.log(error);
      return false;
    }
    return true;
  }

  async retrieveServices(peripheralId) {
    try {
      return await BleManager.retrieveServices(peripheralId);
    } catch (error) {
      console.log("retrieveServices() error");
      console.log(error);
      return false;
    }
    return true;
  }


  async writeString(peripheralId, serviceUUID, characteristicUUID, str) {
    try {
      await this.retrieveServices(peripheralId);
      await BleManager.write(peripheralId, serviceUUID, characteristicUUID, stringToBytes(str));
    } catch (error) {
      console.log("writeString() error");
      console.log(error);
      return false;
    }
    return true;
  }

  async isConnected(peripheralId) {
    try {
      return await BleManager.isPeripheralConnected(peripheralId);
    } catch (error) {
      console.log("isConnected() error");
      console.log(error);
      return false;
    }
  }

  async getConnectedPeripherals(serviceUUIDs = []) {
    return await BleManager.getConnectedPeripherals(serviceUUIDs);
  }

  handleStopScan() {
    this.isScanning = false;
  }

 async keepAlive() {
   console.log("keepAlive()")
   console.log(Array.from(this.keepAlivePeripherals.keys()));
    for (const id of this.keepAlivePeripherals.keys()) {
      console.log(id);
      if (!await this.isConnected(id)) {
        await this.connect(id, true);
      }
    }
  }

  handleDisconnectedPeripheral(peripheralId) {

  }

  handleConnectPeripheral(peripheralId) {

  }

}
