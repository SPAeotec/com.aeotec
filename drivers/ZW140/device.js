'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW140 extends ZwaveDevice {

  onNodeInit() {
	  
	//this.enableDebug();
    //this.printNode(); 
	
    this.registerCapability('onoff', 'BASIC');
  }

}

module.exports = ZW140;
