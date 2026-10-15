'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSC019 extends ZwaveDevice {
	
	onMeshInit() {
        
		// this.enableDebug();
        //this.printNode();
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		
	    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
        this.registerCapability('dim', 'BASIC');
        this.registerCapability('measure_power', 'METER');
        this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');

    
    }

}

module.exports = DSC019;