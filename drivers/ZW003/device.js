'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');
const sceneMap = {
	1: '_press1Trigger',
    2: '_hold1Trigger',
    3: '_press2Trigger',
    4: '_hold2Trigger',
    5: '_press3Trigger',
    6: '_hold3Trigger',
    7: '_press4Trigger',
    8: '_hold4Trigger',
};

class AeotecMiniMoteDevice extends ZwaveDevice {

	onNodeInit() {
		
		 // this.enableDebug();
         // this.printNode();
				
		this._press1Trigger = this.driver.press1Trigger;
        this._press2Trigger = this.driver.press2Trigger;
        this._press3Trigger = this.driver.press3Trigger;
        this._press4Trigger = this.driver.press4Trigger;

        this._hold1Trigger = this.driver.hold1Trigger;
        this._hold2Trigger = this.driver.hold2Trigger;
        this._hold3Trigger = this.driver.hold3Trigger;
        this._hold4Trigger = this.driver.hold4Trigger;

		this.registerReportListener('SCENE_ACTIVATION', 'SCENE_ACTIVATION_SET', (report) => {
			if (report && report['Scene ID']) {
				let trigger = sceneMap[report['Scene ID']];
				this[trigger].trigger(this, null, null).catch(this.error);
			}
		});
	}
}

module.exports = AeotecMiniMoteDevice;
