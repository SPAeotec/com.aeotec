'use strict';

const Homey = require('homey');

class ZWA050Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.systemErrorOnTrigger = this.homey.flow.getDeviceTriggerCard('system_alarm_on');
    
  }

}

module.exports = ZWA050Driver;
