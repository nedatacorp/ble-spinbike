var hx711 = require('./../hx711.js')
var sleep = require('sleep');

var hx = new hx711.HX711(5,6);

const z = 104.7371;  //Offset to zero the scale

/*I've found out that, for some reason, the order of the bytes is not always the same between versions of python, numpy and the hx711 itself.
  Still need to figure out why does it change.
  If you're experiencing super random values, change these values to MSB or LSB until to get more stable values.
  There is some code below to debug and log the order of the bits and the bytes.
  The first parameter is the order in which the bytes are used to build the "long" value.
  The second paramter is the order of the bits inside each byte.
  According to the HX711 Datasheet, the second parameter is MSB so you shouldn't need to modify it. */
hx.set_reading_format("MSB", "MSB");

/* HOW TO CALCULATE THE REFFERENCE UNIT
  To set the reference unit to 1. Put 1kg on your sensor or anything you have and know exactly how much it weights.
  In this case, 92 is 1 gram because, with 1 as a reference unit I got numbers near 0 without any weight
  and I got numbers around 184000 when I added 2kg. So, according to the rule of thirds:
  If 2000 grams is 184000 then 1000 grams is 184000 / 2000 = 92. */
hx.set_reference_unit(80000);

hx.reset();

//hx.tare();
// to use both channels, you'll need to tare them both
//hx.tare_A();
//hx.tare_B();

while (true) {
 // try {
	/*These three lines are useful to debug wether to use MSB or LSB in the reading formats
        for the first parameter of "hx.set_reading_format("LSB", "MSB")".
        Comment the two lines "val = hx.get_weight(5)" and "print val" and uncomment the 
        three lines to see what it prints. */
	var np_arr8_string = hx.get_np_arr8_string();
    var binary_string = hx.get_binary_string();
   // console.log(binary_string + " " + np_arr8_string);
           
    // Prints the weight. Comment if you're debugging the MSB and LSB issue.
    var val = hx.get_weight(5) + z;
    val = val  * 100;
    //val = hx.read_long();
    console.log(val);

    /*To get weight from both channels (if you have load cells hooked up 
        to both channel A and B), do something like this: */
    // var val_A = hx.get_weight_A(5);
    // var val_B = hx.get_weight_B(5);
    //console.log("A: " + val_A.toString() + ", B: " + val_B.toString());

    hx.power_down();
    hx.power_up();
    sleep.msleep(100);	  
 // }
 //	console.log('Exception: ' + err.message);  
 // }
}









