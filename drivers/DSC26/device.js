'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class DSC026 extends ZwaveDevice {
	
	onMeshInit() {
        
		// this.enableDebug();
        //this.printNode();
		this.registerCapability('onoff', 'BASIC');
		
	  
    
    }

}

module.exports = DSC026;