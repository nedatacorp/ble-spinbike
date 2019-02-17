var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var debug = require('debug')('pm');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.cycling_power_measurement.xml

var CyclingPowerMeasurementCharacteristic = function() {
  CyclingPowerMeasurementCharacteristic.super_.call(this, {
    uuid: '2A63',
    properties: ['notify'],
    descriptors: [
      new Descriptor({
        // Client Characteristic Configuration
        uuid: '2902',
        value: new Buffer([0])
      }),
      new Descriptor({
        // Server Characteristic Configuration
        uuid: '2903',
        value: new Buffer([0])
      })
    ]
  });

  this._updateValueCallback = null;
};

util.inherits(CyclingPowerMeasurementCharacteristic, Characteristic);

CyclingPowerMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[BLE] client subscribed to PM');
  this._updateValueCallback = updateValueCallback;
};

CyclingPowerMeasurementCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[BLE] client unsubscribed from PM');
  this._updateValueCallback = null;
};


//This function is called by our logic whenever there is data to send to the client
CyclingPowerMeasurementCharacteristic.prototype.notify = function(event) {
  if (!('watts' in event) && !('rev_count' in event) && !('wheel_rev_count' in event))  {
    // ignore events with no power and no crank data
    return;
  }
  
  //This how we tell the client what data we are sending it
  var buffer = new Buffer(14);
  // flags
  // 00000001 - 1   - 0x001 - Pedal Power Balance Present
  // 00000010 - 2   - 0x002 - Pedal Power Balance Reference
  // 00000100 - 4   - 0x004 - Accumulated Torque Present
  // 00001000 - 8   - 0x008 - Accumulated Torque Source
  // 00010000 - 16  - 0x010 - Wheel Revolution Data Present
  // 00100000 - 32  - 0x020 - Crank Revolution Data Present
  // 01000000 - 64  - 0x040 - Extreme Force Magnitudes Present
  // 10000000 - 128 - 0x080 - Extreme Torque Magnitudes Present
  //buffer.writeUInt16LE(0x020, 0);
  buffer.writeUInt16LE(0x030, 0);

  //Store the values into the outgoing data buffer
  
  if ('watts' in event) {
    var watts = event.watts;
   // console.log("power: " + watts.toString(16));
    buffer.writeInt16LE(watts, 2);
  }

  if ('wheel_rev_count' in event) {
   // console.log("wheel_rev_count: " + event.wheel_rev_count.toString(16));
    buffer.writeUInt32LE(event.whe
el_rev_count, 4);

    var now = Date.now();
    var now_1024 = Math.floor(now*1e3/2048);
    var event_time = now_1024 % 65536; // rolls over every 64 seconds
   // console.log("wheel event time: " + event_time.toString(16));
    buffer.writeUInt16LE(event_time, 8);
  }

  if ('rev_count' in event) {
   // console.log("rev_count: " + event.rev_count.toString(16));
    buffer.writeUInt16LE(event.rev_count, 10);

    var now = Date.now();
    var now_1024 = Math.floor(now*1e3/1024);
    var event_time = now_1024 % 65536; // rolls over every 64 seconds
    

   // console.log("crank event time: " + event_time.toString(16));
    buffer.writeUInt16LE(event_time, 12);
  }

  // Send the data to the client
  if (this._updateValueCallback) {
    this._updateValueCallback(buffer);
  }
}

module.exports = CyclingPowerMeasurementCharacteristic;
