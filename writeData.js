
var bleno = require('bleno');
var os = require('os');
var util = require('util');

var BlenoCharacteristic = bleno.Characteristic;

var writeDataCharacteristic = function() {
 writeDataCharacteristic.super_.call(this, {
    uuid: '2AD9',
    properties: ['write', 'indicate'],
  });


 this._value = new Buffer(0);
};

//This is what the client application (Zwift, bkool, etc.) calls to tell us what's going on
// in this ride, such as wind resistance, grade, etc.
writeDataCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {


  var opcode  = data[0];
  
  var d = ', data: ';
  for (ix =1;ix<data.length;ix++)
  {
	  d = d + data[ix].toString() + ' ';
  }
  console.log(' WriteDataCharacteristic opcode: ' + opcode.toString() + d);
  
  //If opcode 0x00, this is a request for control. 
  if (opcode === 0)
  {
      if (this.updateValueCallback) {
        var data = new Buffer(3);
        data.writeUInt8(0x80, 0);  //Response op code (always 0x80)
        data.writeUInt8(0x00, 1);  //Request op code
        data.writeUInt8(0x01, 2);  //Result code
        this.updateValueCallback(data);
      }

  }
  if (opcode === 17)
  {
      //Set bike simulation parameters
      var windSpeed = (data[1] + (data[2] * 256)) * .001;
      var grade = (data[3] + (data[4] * 256)) * .01;
      var crr = data[5] * .0001; //Coefficient of rolling resistance
      var cw = data[6] * .01;  //Coefficient of wind resistance
	  
      var og = grade;
      if (grade>500)
      {
	grade = 655 - grade;
      }
      grade = grade * 2;
      //  console.log('Windspeed: ' + windSpeed.toString());
	    console.log('Grade: ' + og.toString() + " corrected: " + grade.toString());
      //  console.log('Coefficient of rolling resistance: ' + crr.toString());
      //  console.log('Coefficient of wind resistance: ' + cw.toString());
	

      if (this.updateValueCallback) {
        var data = new Buffer(3);
        data.writeUInt8(0x80, 0);
        data.writeUInt8(0x11, 1);
        data.writeUInt8(0x01, 2);
        this.updateValueCallback(data);
      }	  	  
  }
  if (opcode === 7)
  {
	  //Start training session
      if (this.updateValueCallback) {
        var data = new Buffer(3);
        data.writeUInt8(0x80, 0);
        data.writeUInt8(0x07, 1);
        data.writeUInt8(0x01, 2);
        this.updateValueCallback(data);
      }	  
  }
  
  //If opcode 0x04, set targeted resistance. Value is a UINT8 with a resolution of .1.
  // Zwift does not currently send this.
  if (opcode === 4)
  {
    //Set resistance
 
  } 

  callback(this.RESULT_SUCCESS);

};



util.inherits(writeDataCharacteristic, BlenoCharacteristic);
module.exports = writeDataCharacteristic;
