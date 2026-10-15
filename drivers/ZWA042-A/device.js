'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA042 extends ZwaveDevice {
	
	async onNodeInit({ node }) {
		
		//this.enableDebug();
        //this.printNode();
		
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}

module.exports = ZWA042;