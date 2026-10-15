'use strict';

const Homey = require('homey');

class ZWA055 extends Homey.Driver {

  onInit() {
    super.onInit();
	
	this.flowTriggerTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA055_tilt_info_on');  
    this.flowTriggerTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerTiltInfo(args, state);
    });
	this.flowTriggerNoTiltInfo = this.homey.flow.getDeviceTriggerCard('ZWA055_tilt_info_off');  
    this.flowTriggerNoTiltInfo.registerRunListener((args, state) => {
      return args.device.flowTriggerNoTiltInfo(args, state);
    });
	this.flowTriggerPower = this.homey.flow.getDeviceTriggerCard('ZWA055_power_changed_trigger');  
    this.flowTriggerPower.registerRunListener((args, state) => {
       return args.device.flowTriggerPower(args, state);
	});
	this.dewPointTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_dewpoint_value');
	this.dewPointTrigger.registerRunListener((args, state) => {
    return args.device.dewPointTrigger(args, state);
	});
	this.zaxisTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_zaxis_value');
	this.zaxisTrigger.registerRunListener((args, state) => {
    return args.device.zaxisTrigger(args, state);
	});
	this.yaxisTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_yaxis_value');
	this.yaxisTrigger.registerRunListener((args, state) => {
    return args.device.yaxisTrigger(args, state);
	});
	this.xaxisTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_xaxis_value');
	this.xaxisTrigger.registerRunListener((args, state) => {
    return args.device.xaxisTrigger(args, state);
	});
	this.moldAlarmOnTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_mold_alarm_on');
    this.moldAlarmOnTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOnTrigger(args, state);
	});
	
	this.moldAlarmOffTrigger = this.homey.flow.getDeviceTriggerCard('ZWA055_mold_alarm_off');
    this.moldAlarmOffTrigger.registerRunListener((args, state) => {
    return args.device.moldAlarmOffTrigger(args, state);
	});
  }

}

module.exports = ZWA055;