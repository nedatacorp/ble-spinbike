var CRANKSPEED = require('./../crankspeed');

var cs = new CRANKSPEED.CrankSpeed(26, pulse);

var count = 0;

function pulse() {
   count += 1;
   console.log(count.toString());
}

var test = function() {

   setTimeout(test, 1000);
}

test();
