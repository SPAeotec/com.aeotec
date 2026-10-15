'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

const sceneMap = {
  1: '_pressTrigger',
  2: '_holdTrigger',
};

class AeotecPanicButtonDevice extends ZwaveDevice {

  onNodeInit() {
    this._pressTrigger = this.driver.pressTrigger;
    this._holdTrigger = this.driver.holdTrigger;

    this.registerCapability('measure_battery', 'BATTERY');

    this.registerReportListener('SCENE_ACTIVATION', 'SCENE_ACTIVATION_SET', report => {
      if (typeof (report['Scene ID']) !== 'undefined') {
        const trigger = sceneMap[report['Scene ID']];
        this[trigger].trigger(this, null, null).catch(this.error);
      }
    });
  }

}

module.exports = AeotecPanicButtonDevice;
