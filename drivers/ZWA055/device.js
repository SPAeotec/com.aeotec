'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA055 extends ZwaveDevice {


  onNodeInit() {
     this.enableDebug();
     this.printNode();
	
// Registering Flows
	this._flowTriggerTiltInfo = this.driver.flowTriggerTiltInfo;
	this._flowTriggerNoTiltInfo = this.driver.flowTriggerNoTiltInfo;
	//this._flowTriggerInput = this.driver.flowTriggerInput;
	this._flowdewPointTrigger = this.driver.dewPointTrigger;
	this._flowTriggerPowerStatusChanged = this.driver.flowTriggerPower;
	this._moldAlarmOnTrigger = this.driver.moldAlarmOnTrigger;
    this._moldAlarmOffTrigger = this.driver.moldAlarmOffTrigger;
	this._flowZaxisTrigger = this.driver.zaxisTrigger;
	this._flowYaxisTrigger = this.driver.yaxisTrigger;
	this._flowXaxisTrigger = this.driver.xaxisTrigger;
	
// Registering Capabilitys
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
	this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
	this.registerCapability('measure_battery', 'BATTERY');
	
//TILT Sensor
	this.registerCapability('info_tilt', 'SENSOR_BINARY', {
	  report: 'SENSOR_BINARY_REPORT',
	  reportParser: report => {
		if (!report || report['Sensor Type'] !== 'Tilt') {
		  return null;
		}

		const sensorValue = report['Sensor Value'];

		if (sensorValue === 'idle') {
		  this._flowTriggerNoTiltInfo
			.trigger(this)
			.catch(err => this.error('No tilt trigger failed:', err));
		  return false;
		}

		if (sensorValue === 'detected an event') {
		  this._flowTriggerTiltInfo
			.trigger(this)
			.catch(err => this.error('Tilt trigger failed:', err));

		  if (this.getSetting('no_alarm_if_tilt') === 1) {
			this.setCapabilityValue('alarm_contact', false)
			  .catch(err => this.error('Setting alarm_contact failed:', err));
		  }

		  return true;
		}

		return null;
	  },
	});
	
	  if (this.getCapabilityValue('info_tilt') === null) {
    this.setCapabilityValue('info_tilt', false)
      .catch(this.error);
  }
	
//Power Connected
	this.registerCapability('info_power', 'NOTIFICATION', {
	  report: 'NOTIFICATION_REPORT',
	  reportParser: report => {
		if (!report || report['Notification Type'] !== 'Power Management') {
		  return null;
		}

		let value = null;

		switch (report['Event']) {
		  case 2:
			value = false; // Strom getrennt
			break;
		  case 3:
			value = true; // Strom wiederhergestellt
			break;
		  default:
			return null;
		}

		// Capability aktualisieren
		this.setCapabilityValue('info_power', value).catch(this.error);

		// Flow auslösen mit Boolean-Wert
		this._flowTriggerPowerStatusChanged
		  .trigger(this, { status: value })
		  .catch(this.error);

		return value;
	  },
	});

//DEW-POINT 
	this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL', {
	  get: 'SENSOR_MULTILEVEL_GET',
	  getParser: () => ({
		'Sensor Type': 'Dew point (version 2)',
		Properties1: {
		  Scale: 0,
		},
	  }),
	  report: 'SENSOR_MULTILEVEL_REPORT',
	  reportParser: report => {
		if (
		  report &&
		  report['Sensor Type'] !== undefined &&
		  report['Sensor Value (Parsed)'] !== undefined &&
		  (
			report['Sensor Type'] === 'Dew point (version 2)' ||
			report['Sensor Type'] === 'Dew point (version 2) '
		  )
		) {
		  const token = {
			dewpoint: report['Sensor Value (Parsed)'],
		  };

		  this._flowdewPointTrigger
			.trigger(this, token, this.device_data)
			.catch(this.error);

		  return report['Sensor Value (Parsed)'];
		}

		return null;
	  },
	});
	
	//mold
	
	this.node.CommandClass['COMMAND_CLASS_NOTIFICATION'].on('report', (command, report) => {
	  if (command.name === 'NOTIFICATION_REPORT') {
		const notificationType = report['Notification Type'];
		const event = report['Event'];

		if (notificationType === 'Weather Alarm') {
		  if (event === 2) {
			this.setCapabilityValue('alarm_generic.mold', true).catch(err => this.error(err));
			if (this._moldAlarmOnTrigger) {
			  this._moldAlarmOnTrigger.trigger(this).catch(err => this.error('Trigger failed:', err));
			}
		  } else if (event === 0) {
			this.setCapabilityValue('alarm_generic.mold', false).catch(err => this.error(err));
			if (this._moldAlarmOffTrigger) {
			  this._moldAlarmOffTrigger.trigger(this).catch(err => this.error('Trigger failed:', err));
			}
		  }
		}
	}});

	  
	  this.homey.flow.getConditionCard('ZWA055_mold_onoff')
      .registerRunListener((args, state) => {
        const moldInfo = args.device.getCapabilityValue('alarm_generic.mold');
        return Promise.resolve(moldInfo);
    });	
	
	
//Z-Achse
	this.registerCapability('multilevel_zaxis', 'SENSOR_MULTILEVEL', {
	  get: 'SENSOR_MULTILEVEL_GET',
	  getParser: () => ({
		'Sensor Type': 'Acceleration Z-axis (v8)',
		Properties1: {
		  Scale: 0,
		},
	  }),
	  report: 'SENSOR_MULTILEVEL_REPORT',
	  reportParser: report => {
		if (
		  report &&
		  report['Sensor Type'] !== undefined &&
		  report['Sensor Value (Parsed)'] !== undefined &&
		  (
			report['Sensor Type'] === 'Acceleration Z-axis (v8)' ||
			report['Sensor Type'] === 'Acceleration Z-axis (v8)'
		  )
		) {
		  const token = {
			zaxis: report['Sensor Value (Parsed)'],
		  };

		  this._flowZaxisTrigger
			.trigger(this, token, this.device_data)
			.catch(this.error);

		  return report['Sensor Value (Parsed)'];
		}

		return null;
	  },
	});

//Y-Achse
	this.registerCapability('multilevel_yaxis', 'SENSOR_MULTILEVEL', {
	  get: 'SENSOR_MULTILEVEL_GET',
	  getParser: () => ({
		'Sensor Type': 'Acceleration Y-axis (v8)',
		Properties1: {
		  Scale: 0,
		},
	  }),
	  report: 'SENSOR_MULTILEVEL_REPORT',
	  reportParser: report => {
		if (
		  report &&
		  report['Sensor Type'] !== undefined &&
		  report['Sensor Value (Parsed)'] !== undefined &&
		  (
			report['Sensor Type'] === 'Acceleration Y-axis (v8)' ||
			report['Sensor Type'] === 'Acceleration Y-axis (v8)'
		  )
		) {
		  const token = {
			yaxis: report['Sensor Value (Parsed)'],
		  };

		  this._flowYaxisTrigger
			.trigger(this, token, this.device_data)
			.catch(this.error);

		  return report['Sensor Value (Parsed)'];
		}

		return null;
	  },
	});
	
//X-Achse
	this.registerCapability('multilevel_xaxis', 'SENSOR_MULTILEVEL', {
	  get: 'SENSOR_MULTILEVEL_GET',
	  getParser: () => ({
		'Sensor Type': 'Acceleration X-axis (v8)',
		Properties1: {
		  Scale: 0,
		},
	  }),
	  report: 'SENSOR_MULTILEVEL_REPORT',
	  reportParser: report => {
		if (
		  report &&
		  report['Sensor Type'] !== undefined &&
		  report['Sensor Value (Parsed)'] !== undefined &&
		  (
			report['Sensor Type'] === 'Acceleration X-axis (v8)' ||
			report['Sensor Type'] === 'Acceleration X-axis (v8)'
		  )
		) {
		  const token = {
			xaxis: report['Sensor Value (Parsed)'],
		  };

		  this._flowXaxisTrigger
			.trigger(this, token, this.device_data)
			.catch(this.error);

		  return report['Sensor Value (Parsed)'];
		}

		return null;
	  },
	});

    this.homey.flow.getConditionCard('ZWA055_is_tilted')
      .registerRunListener((args, state) => {
        const tiltInfo = args.device.getCapabilityValue('info_tilt');
        return Promise.resolve(tiltInfo);
      });


    this.DisableTamperContactFlow = this.homey.flow.getActionCard('ZWA055_disabletampercontact');
    this.DisableTamperContactFlow.registerRunListener((args, state) => {
      return this.setCapabilityValue('alarm_tamper', false).catch(this.error);
    });
  }

  inputFlowListener(args, state) {
    return (state.scene === args.scene);
  }

}
module.exports = ZWA055;
