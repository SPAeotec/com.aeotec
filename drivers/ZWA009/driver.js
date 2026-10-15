'use strict';

const Homey = require('homey');

class ZWA009Driver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.moldAlarmOnTrigger = this.homey.flow.getDeviceTriggerCard('mold_alarm_on');
    this.moldAlarmOffTrigger = this.homey.flow.getDeviceTriggerCard('mold_alarm_off');
    this.dewPointTrigger = this.homey.flow.getDeviceTriggerCard('dewpoint_value');
  }

}

module.exports = ZWA009Driver;
