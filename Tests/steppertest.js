var STEPPER= require('./../stepper');

//Pins numbers are the BCM values, not the physical values. 
var motor = new STEPPER.Stepper([18,27,17,23]);

//Run clockwise 200 steps (1 rotation for some steppers) at 10ms between steps
motor.stepc(200, 10);

//Run counter-clockwise 100 steps (1 rotation for some steppers) at 20ms between steps
motor.stepcc(200, 10);

//Turn off power to stepper windings
motor.cool();




