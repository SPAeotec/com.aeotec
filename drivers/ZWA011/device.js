'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA011 extends ZwaveDevice {

  onNodeInit() {
     this.enableDebug();
     this.printNode();
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');

    this.DisableTamperContactFlow = this.homey.flow.getActionCard('ZWA011_disabletampercontact');
    this.DisableTamperContactFlow.registerRunListener((args, state) => {
      return this.setCapabilityValue('alarm_tamper', false).catch(this.error);
    });
  }

  inputFlowListener(args, state) {
    return (state.scene === args.scene);
  }

}
module.exports = ZWA011;
