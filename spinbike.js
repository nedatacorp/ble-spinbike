var bcp = require('./');
var CRANKSPEED = require('./crankspeed');
var hx711 = require('./hx711.js')
var sleep = require('sleep');
const Gpio = require('onoff').Gpio; 
var STEPPER= require('./stepper');

const forceoffset = 102.7371 - .6367;  //Offset to zero the force sensor

//Values that need to be set depending on  spin bike characteristics
const bikename = "Yosuda";      //Name of machine that will show up in the spinbike app
const wheelToCrankRatio = 3;  //Number of wheel revolutions per 1 crank revolution
const forceToWatts = 10;

//Values that need to be set depending on Raspberry PI pin connections
// We are using BCM references for all the pins
const PIN_crank = 26;
const PIN_forceIN = 5;
const PIN_forceOUT = 6;
const PIN_increaseResistance = 16;
const PIN_decreaseResistance = 13;
const PIN_STEPPERA1 = 18;
const PIN_STEPPERA2 = 27;
const PIN_STEPPERB1 = 17;
const PIN_STEPPERB2 = 23;


//Set up the stepper motor
var motor = new STEPPER.Stepper([PIN_STEPPERA1,PIN_STEPPERA2,PIN_STEPPERB1,PIN_STEPPERB2]);

//Set the buttons up with handlers
const increaseButton = new Gpio(PIN_increaseResistance, 'in', 'falling', {debounceTimeout: 50});
increaseButton.watch((err, value) => {
  if (err) {
    throw err;
  }

  //Run the stepper motor 5 steps clockwise with a 10ms delay between each step
  if (!increaseButton.readSync())
  { 
    motor.stepc(5, 10);
    motor.cool();
  }
});

const decreaseButton = new Gpio(PIN_decreaseResistance, 'in', 'falling', {debounceTimeout: 50});
decreaseButton.watch((err, value) => {
  if (err) {
    throw err;
  }

  //Run the stepper motor 5 steps counterclockwise with a 10ms delay between each step   
  if (!decreaseButton.readSync())
  {  
    motor.stepcc(5, 10);
    motor.cool(); 
  }
});


//Create a BluetoothPeripheral, which communicates with whatever
// client application we're using (zwift, bkool, etc.)
var peripheral = new bcp.BluetoothPeripheral(bikename, bluetoothevent);
var cs = new CRANKSPEED.CrankSpeed(PIN_crank, crankpulse);
var hx = new hx711.HX711(PIN_forceIN,PIN_forceOUT);

//Initialize starting counts
var stroke_count = 0;
var wheel_rev_count = 0;
var watts = 0;
var forceval = 0;

var theDate = Date().now;
var lastCrankPulse = theDate;

hx.set_reading_format("MSB", "MSB");
hx.set_reference_unit(80000);
hx.reset();

//This function is called every time the pedals rotate 1 revolution
function crankpulse() {
   stroke_count += 1;
}

//This is called by the writedata module whenever the client (Zwift)
// sends information, such as the current grade.
function bluetoothevent(grade)
{
  console.log("Grade: " + grade.toString());
}

//Get a reading and start the force sensing function
readForce();


//Read the force sensor 10 times per second. Watts needs to be around 120 when pedaling at about
// 1 stroke per second, for a normal bike output.
function readForce() {
  forceval = hx.get_weight(PIN_forceIN) + forceoffset;
  //console.log("Force: " + val.toString());
  watts = Math.floor(forceval * forceToWatts);
  if (watts < 0)
    watts = 0;
    
  watts = watts * 3;
  
  setTimeout(readForce,100);   
}


var main = function() {
  
  wheel_rev_count = Math.floor(stroke_count * wheelToCrankRatio);
  
 // console.log("Sending watts: " + watts.toString() + ", rev_count: " + stroke_count.toString() + ", wheel_rev_count: " + wheel_rev_count.toString()); 
  peripheral.notify({'watts': watts, 'rev_count': stroke_count, 'wheel_rev_count': wheel_rev_count});

  setTimeout(main, 1000);
};
main();
