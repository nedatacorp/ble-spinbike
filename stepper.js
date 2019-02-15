var GPIO = require('onoff').Gpio; //include onoff to interact with the GPIO
var sleep = require('sleep');

class Stepper {
  
  constructor(sensorpins)
  { 
    this.IN1 = new GPIO(sensorpins[0], 'out');
    this.IN2 = new GPIO(sensorpins[1], 'out');
    this.IN3 = new GPIO(sensorpins[2], 'out');
    this.IN4 = new GPIO(sensorpins[3], 'out'); 
    
    this.forward = [[1,1,0,0],
                    [0,1,1,0],
                    [0,0,1,1],
                    [1,0,0,1]];
                    
     this.curstep = 0;             
                               
  }
  
  //Rotate clockwise
  stepc (count, pause) {
    if (pause<1)
      pause = 1;
 
 
    for (var c = 0; c < count; c++)
    {
        this.curstep +=1;
        if (this.curstep>3)
          this.curstep = 0;      
        this.IN1.writeSync(this.forward[0][this.curstep]);
        this.IN2.writeSync(this.forward[1][this.curstep]);
        this.IN3.writeSync(this.forward[2][this.curstep]);
        this.IN4.writeSync(this.forward[3][this.curstep]);
        if (pause>0)
          sleep.msleep(pause);
    }
  }
  
  //Rotate counter-clockwise
  stepcc (count, pause) {
    if (pause<1)
      pause = 1;

    for (var c = 0; c < count; c++)
    {
        this.curstep = this.curstep-1;
        if (this.curstep<0)
           this.curstep = 3;     
        this.IN1.writeSync(this.forward[0][this.curstep]);
        this.IN2.writeSync(this.forward[1][this.curstep]);
        this.IN3.writeSync(this.forward[2][this.curstep]);
        this.IN4.writeSync(this.forward[3][this.curstep]);
        if (pause>0)
          sleep.msleep(pause);
    }   
  }
  
  //This turns off the the power to all coils to avoid heat build-up. However, this allows the
  // motor shaft to turn easily, so don't call this if you want the motor to hold position.
  cool () {
    this.IN1.writeSync(0);
    this.IN2.writeSync(0);
    this.IN3.writeSync(0);
    this.IN4.writeSync(0);   
  }
}

module.exports.Stepper = Stepper;



