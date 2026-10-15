'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSC018 extends ZwaveDevice {
	
	onMeshInit() {
        
		//this.enableDebug();
        //this.printNode();
		this.registerCapability('onoff', 'BASIC');
        this.registerCapability('measure_power', 'METER');
        this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');

    
    }

}

module.exports = DSC018;