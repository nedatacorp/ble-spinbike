
var GPIO = require('onoff').Gpio; //include onoff to interact with the GPIO
var sleep = require('sleep');

class HX711 {
  
  constructor(dout, pd_sck, gain=128)
  {
      this.PD_SCK = pd_sck;    
      this.DOUT = dout;
      
      this.SCK = new GPIO(pd_sck, 'out');
      this.OUT = new GPIO(dout, 'in');

      this.GAIN = 0;
 
      /*The value returned by the hx711 that corresponds to your reference
         unit AFTER dividing by the SCALE. */
      this.REFERENCE_UNIT = 1;
      this.REFERENCE_UNIT_B = 1;

      this.OFFSET = 1;
      this.OFFSET_B = 1;
      this.lastVal = 0;

      this.isNegative = false;
      this.MSBindex24Bit = 2;
      this.MSBindex32Bit = 3;

      this.LSByte = [0, 3, 1];
      this.MSByte = [2, -1, -1];

      this.MSBit = [0, 8, 1];
      this.LSBit = [7, -1, -1];

      this.byte_format = 'MSB';
      this.bit_format = 'MSB';

      this.byte_range_values = this.LSByte;
      this.bit_range_values = this.MSBit; 
      
      sleep.sleep(1);    
      
  }
  
  is_ready() {
    return this.OUT.readSync() == 0;
  }
  
  set_gain(gain) {
    switch (gain) {
      case 128:
        this.GAIN = 1;
        break;
      case 64:
        this.GAIN = 3;
        break;
      default:
        this.GAIN = 2;
    }

    this.SCK.writeSync(0);
    this.read();
    sleep.msleep(400);  
  }
  
  get_gain() {
    if (this.GAIN === 1) 
      return 128;
    if (this.GAIN === 3) 
      return 64;
    return 32;
  }
  
  read() {
    while  (!this.is_ready()) {
      sleep.msleep(100);  
    }
           
    var dataBits = [4][8];
    var dataBytes = [4];
    dataBytes[0] = dataBytes[1] = dataBytes[2] = dataBytes[3] = 0;
    var bt = new Uint8Array(1);
    
    var numw = 0;
    
    for (var j = this.byte_range_values[0]; j != this.byte_range_values[1]; j = j + this.byte_range_values[2])
    {      
      for (var i = this.bit_range_values[0]; i != this.bit_range_values[1]; i = i + this.bit_range_values[2]) 
      {
        numw = numw + 1;
 
        this.SCK.writeSync(1);
        bt[0] = this.OUT.readSync();
        this.SCK.writeSync(0);      
        if (this.bit_range_values[0] > this.bit_range_values[1])
        {
          if (bt[0] > 0)
          {
             bt[0] = bt[0] << i;
          }        
         
        }
        else
        {
          bt[0] = bt[0] * 0x80;
          bt[0] = bt[0] >> i;
        }
            
        dataBytes[j] |= bt[0];
        
      }
    }
    
    //set channel and gain factor for next reading
    for ( var i = 0; i <= this.GAIN; i++) {
      numw += 1;
      this.SCK.writeSync(1);
      this.SCK.writeSync(0);     
    }
    
    
    this.MSBindex24Bit = 2;
    this.MSBindex32Bit = 3;
    this.isNegative = false;

    if (this.byte_format === 'LSB') {
      this.MSBindex24Bit = 1;
      this.MSBindex32Bit = 0;
    }
    if (dataBytes[this.MSBindex24Bit] & 0x80)
      this.isNegative = true;
      
    return dataBytes;
  }
  
  get_binary_string() {
    var np_arr8 = this.read_np_arr8();
    var binary_string = "";
    for (var i =0; i < 4; i++)
    {
      var binary_segment = np_arr8[i].toString(16);
      binary_string += binary_segment + " ";
    }
    return binary_string; 
  }
  
  get_np_arr8_string() {
    var np_arr8 = this.read_np_arr8();
    var np_arr8_string = "[";
    var comma = ", ";
    for (var i = 0; i < 4; i++) {
      if (i === 3)
        comma = "";
      np_arr8_string += np_arr8[i].toString() + comma;
      np_arr8_string += "]";
    }
    return np_arr8_string; 
  } 
  
  read_np_arr8() {
    var dataBytes = this.read();
    var np_arr8 = dataBytes;

    return np_arr8;
  }
  
  read_long() {
    var np_arr8 = this.read_np_arr8();

    if (this.isNegative) 
    {
      np_arr8[this.MSBindex24Bit] ^= 0x80;
    }

    this.lastVal = (np_arr8[2] << 16) | (np_arr8[1] << 8) | np_arr8[0];
    
    if (np_arr8[2] & 0x80)
      this.lastVal |= 0xFF000000;

    if (this.isNegative)
      this.lastVal = this.lastVal * -1;
       
    return this.lastVal; 
  }
  
  read_average(times=3) {
   var values = 0;
    for (var i =0; i < times; i++) {
      values += this.read_long();
    }
    return values / times; 
  }
  
  /*A median-based read method, might help when getting random value spikes
     for unknown or CPU-related reasons */
  read_median(times=3) {
    var values = [];
    for (var i = 0; i < times; i++) {
      values.push(this.read_long());
    }
    
    var sorted = values.slice().sort();
    var middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];   
    
  }
  
  //Compatibility function, uses channel A version
  get_value(times=3) {
    return this.get_value_A(times);
  }
  
  get_value_A(times=3) {
    return this.read_median(times) - this.OFFSET;
  }
 
  get_value_B(times=3) {
    //for channel B, we need to set_gain(32)
    var g = this.get_gain();
    this.set_gain(32);
    var value = this.read_median(times) - this.OFFSET_B;
    this.set_gain(g);
    return value;
  }
  
  //Compatibility function, uses channel A version
  get_weight(times=3) {
    return this.get_weight_A(times);
  }

  get_weight_A(times=3) {
    var value = this.get_value_A(times);
    value = value / this.REFERENCE_UNIT;
    return value;
  }

  get_weight_B(times=3) {
    var value = this.get_value_B(times);
    value = value / this.REFERENCE_UNIT_B;
    return value;
  }
  
  //Sets tare for channel A for compatibility purposes
  tare(times=15) {
    this.tare_A(times);
  }

  tare_A(times=15) {
    // Backup REFERENCE_UNIT value
    var reference_unit = this.REFERENCE_UNIT;
    this.set_reference_unit_A(1);

    var value = this.read_median(times);
    this.set_offset_A(value);

    this.set_reference_unit_A(reference_unit);
    return value;
  }

  tare_B(times=15) {
    // Backup REFERENCE_UNIT value
    var reference_unit = this.REFERENCE_UNIT_B;
    this.set_reference_unit_B(1);

    //for channel B, we need to set_gain(32)
    var g = this.get_gain();
    this.set_gain(32);

    var value = this.read_median(times);
    this.set_offset_B(value);

    this.set_gain(g);
    this.set_reference_unit_B(reference_unit);
    return value;
  }

  set_reading_format(byte_format="LSB", bit_format="MSB") {
    this.byte_format = byte_format;
    this.bit_format = bit_format;

    if (byte_format === 'LSB') 
      this.byte_range_values = this.LSByte;
    else
      this.byte_range_values = this.MSByte;

    if (bit_format === "LSB") 
      this.bit_range_values = this.LSBit;
    else 
      this.bit_range_values = this.MSBit;
  }

    //sets offset for channel A for compatibility reasons
  set_offset(offset) {
    this.set_offset_A(offset);
  }

  set_offset_A(offset) {
    this.OFFSET = offset;
  }

  set_offset_B(offset) {
    this.OFFSET_B = offset;
  }

  //sets reference unit for channel A for compatibility reasons
  set_reference_unit(reference_unit) {
    this.set_reference_unit_A(reference_unit);
  }

  set_reference_unit_A(reference_unit) {
    this.REFERENCE_UNIT = reference_unit;
  }

  set_reference_unit_B(reference_unit) {
    this.REFERENCE_UNIT_B = reference_unit;
  }

  /* HX711 datasheet states that setting the PDA_CLOCK pin on high for >60 microseconds would power off the chip.
    I used 100 microseconds, just in case.
    I've found it is good practice to reset the hx711 if it wasn't used for
    more than a few seconds. */
  power_down() {
    this.SCK.writeSync(0);  
    this.SCK.writeSync(1);    
    sleep.msleep(1);
  }

  power_up() {
    this.SCK.writeSync(0);
    sleep.msleep(400);
  }

  reset() {
    this.power_down();
    this.power_up();
  }  
         
}

module.exports.HX711 = HX711;



