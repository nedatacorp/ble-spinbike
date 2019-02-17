var bcp = require('./');
var CRANKSPEED = require('./crankspeed');
var hx711 = require('./hx711.js')
var sleep = require('sleep');

const forceoffset = 102.7371 - .6367;  //Offset to zero the force sensor

//Values that need to be set depending on  spin bike characteristics
const bikename = "Yosuda";      //Name of machine that will show up in the spinbike app
const wheelToCrankRatio = 3;  //Number of wheel revolutions per 1 crank revolution
const forceToWatts = 10;

//Values that need to be set depending on Raspberry PI pin connections
const PIN_crank = 26;
const PIN_forceIN = 5;
const PIN_forceOUT = 6;


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
