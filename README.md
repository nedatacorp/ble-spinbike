# ble-spinbike
This project is about building a "smart" spinbike from a low-cost, standard spinbike, thus saving a lot of money and having a lot of fun building it and riding it. The result is a spinbike that will work with popular on-line virtual exercise applications, such as Zwift and Bkool. This project was developed specifically using Zwift, but should work with any other product that supports standard Bluetooth GATT technology.

Spinbike is a Javascript node.js application that runs on a Raspberry Pi 3 B+. It gathers data from sensors attached to a spinbike and feeds the data over a bluetooth LE connection to client applications, using the Bluetooth LE (Low Energy) GATT protocol. The GATT protocol is recognized by all major online virtual exercise platforms.

This project provides three of the main exercise bike services: Cadence/Speed, Power and Control. Online apps generally require at least Cadence/Speed or Power in order to allow you to connect and participate. Control is optional, and generally involves feeding the bike information about wind speed road resistance and grade so it can adjust the effort required by the rider. You can build as much or as little as you want. 

Here is the fritzing diagram for the Raspberry PI, sensors and controllers:

![](images/SpinBike_bb.png)

I chose a Yosuda spin bike for this project:

![](images/yosuda.png)

It has three attributes that make it nice for installing the sensors we need, and the optional stepper motor for controlling resistance:

* A magnet on the main drive pulley and a hole just below the crankshaft where a Hall sensor can be mounted for measuring cadence.
* A steering head that is extended below the main frame, providing a perfect location to mount the load cell for measuring the force on the wool brake pad from the front wheel. 
* A flat-sided steering head and a tension shaft located in just the right spot for making it easy to mount the optional stepper motor, which replaces the tension knob and allows for computerized resistance control.


## System Diagram

This is how the software pieces fit together:

![](images/spinbikesoftwarediagram.png)

Although most cycling applications support ANT as well as Bluetooth LE (hereafter referred to as "BLE"), I chose Bluetooth for a couple reasons:

* We're using a spinbike, which is indoors and stationary. We don't need the robustness of ANT that's better suited for outdoors and real bicycles. 
* We can use conventional, built-in bluetooth devices, thus avoiding the added cost of ANT dongles.

The major components of this project are the spin bike, a tablet (iPad or Android), a Raspberry Pi, and about $50 in sensors/misc. hardware. You can also use a standard Mac or PC in place of the tablet, but a tablet works better because you can mount it on the handlebars.

Although you don't need the latest computer equipment for this, you also can't use antiques. I specify the Raspberry Pi 3 B+ because it has built-in bluetooth. Old iPads won't run the Zwift app. On the other hand, I had no problem using a 2007 iMac. You'll have to experiment.


## Parts List

|Part             |Description                 |Price |Link                                              |
|:-----------     |:---------------------------|:-----|:-------------------------------------------------|
|L-001A           |Yosuda Spin Bike            |$250  |https://www.amazon.com/dp/B07D528W98/ref=emc_b_5_t|
|RaspBerry Pi 3 B+|Raspberry Pi|$50|https://www.amazon.com/CanaKit-Raspberry-Power-Supply-Listed/dp/B07BC6WH7V/ref=sr_1_6?keywords=Raspberry+Pi+3+b%2B&qid=1550445668&s=gateway&sr=8-6|
|KY-003 Hall Sensor|Hall Sensor with controller board|$3|https://www.amazon.com/SODIAL-magnetic-sensor-module-Arduino/dp/B077RSV94Z/ref=sr_1_12?keywords=KY-003&qid=1550445829&s=industrial&sr=1-12|
|Flex Coupling|For connecting stepper motor to resistance shaft|$8|https://www.amazon.com/gp/product/B01HBPHSII/ref=ppx_yo_dt_b_asin_title_o07__o00_s00?ie=UTF8&psc=1|
|17HS13-0404S1|Nema 17 stepper motor|$11|https://www.amazon.com/gp/product/B00PNEQ9T4/ref=ppx_yo_dt_b_asin_title_o02__o00_s00?ie=UTF8&psc=1|
|Stepper motor bracket|For attaching stepper motor to steering post|$6.50|https://www.amazon.com/gp/product/B00Q6F51C0/ref=ppx_yo_dt_b_asin_title_o03__o00_s00?ie=UTF8&psc=1|
|L298N|Stepper motor controller|$7|https://www.amazon.com/gp/product/B00CAG6GX2/ref=ppx_yo_dt_b_asin_title_o04__o00_s00?ie=UTF8&psc=1|
|Hx711|Load Cell|$13|https://www.amazon.com/gp/product/B075317R45/ref=ppx_yo_dt_b_asin_title_o05__o00_s00?ie=UTF8&psc=1|
|28 awg 3-conductor wire|3 conductor with ground|$12|https://www.amazon.com/b/ref=vas_ilm_ddiypc19hn?node=10192825011&pf_rd_p=3e2ddc26-875a-4860-aff6-b78e7c7994ec&pf_rd_s=detail-ilm&pf_rd_t=201&pf_rd_i=B0711Y7QZ4&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=FNMTM8V6GT0HRZK91XFX&pf_rd_r=FNMTM8V6GT0HRZK91XFX&pf_rd_p=3e2ddc26-875a-4860-aff6-b78e7c7994ec|
|12 v power supply|For powering stepper motor|$8|https://www.amazon.com/inShareplus-Mounted-Switching-Connector-Adapter/dp/B01GD4ZQRS/ref=sr_1_1?keywords=12+volt+power+supply&qid=1550446643&s=local-services&sr=8-1|

Also:
* Friction tape (works better than plastic electrical tape)
* Duct tape
* iPad or Android tablet
* Keyboard, mouse and monitor for programming Raspberry Pi
* A couple of metal channel brackets and bolts from HD or Lowes for mounting the stepper motor

## Tools
* Soldering iron
* Rosin-core electical solder
* Small standard and phillips screwdrivers
* Knife and/or wire strippers

# General Procedure

* Configure Raspberry Pi
* Install and configure software
* Connect and test sensors and stepper motor
* Install sensors and stepper hardware to cycle
* Install cycling application
* Test
* Go cycling!


