
var GPIO = require('onoff').Gpio; //include onoff to interact with the GPIO

class CrankSpeed {
  
  constructor(pin, callback)
  { 
      this.PIN = new GPIO(pin, 'in', 'both', {debounceTimeout: 200});
      this.PIN.watch((err, value) => {
        callback();
      });
  }  
}

module.exports.CrankSpeed = CrankSpeed;



