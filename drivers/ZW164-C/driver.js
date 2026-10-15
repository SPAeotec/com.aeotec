'use strict';

const Homey = require('homey');

class AeotecSirenSixDeviceDriver extends Homey.Driver {
  onInit() {
    super.onInit();

    this.chimeActivated = this.homey.flow.getDeviceTriggerCard('ZW164-doorbell-rang');
    this.battery1Off = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_1_off');
    this.battery1On = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_1_on');
    this.battery2Off = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_2_off');
    this.battery2On = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_2_on');
    this.battery3Off = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_3_off');
    this.battery3On = this.homey.flow.getDeviceTriggerCard('gen6-alarm_battery_3_on');
    this.doorbell1 = this.homey.flow.getDeviceTriggerCard('gen6-doorbell_1');
    this.doorbell2 = this.homey.flow.getDeviceTriggerCard('gen6-doorbell_2');
    this.doorbell3 = this.homey.flow.getDeviceTriggerCard('gen6-doorbell_3');

    this.activateChime = this.homey.flow.getActionCard('ZW168-turn_alarm_on');
  		this.activateChime.registerRunListener((args, state) => {
  			return args.device.startFlowAlarm(args, state);
  		});

    this.deactivateChime = this.homey.flow.getActionCard('ZW168-turn_alarm_off');
  		this.deactivateChime.registerRunListener((args, state) => {
  			return args.device.stopFlowAlarm(args, state);
  		});

    this.setTone = this.homey.flow.getActionCard('ZW164-set_tone');
  		this.setTone.registerRunListener((args, state) => {
  			return args.device.setFlowSoundSwitch(args, state);
  		});
  }
}

module.exports = AeotecSirenSixDeviceDriver;
