'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSC027 extends ZwaveDevice {
	
	onMeshInit() {
        
		// this.enableDebug();
        //this.printNode();
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		
	    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
        this.registerCapability('dim', 'BASIC');
    
    }

}

module.exports = DSC027;