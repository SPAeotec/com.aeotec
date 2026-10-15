'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA057 extends ZwaveDevice {

  onNodeInit() {
	this.enableDebug();
    this.printNode();
	  
    this._moldAlarmOnTrigger = this.driver.moldAlarmOnTrigger;
    this._moldAlarmOffTrigger = this.driver.moldAlarmOffTrigger;
    this._dewPointTrigger = this.driver.dewPointTrigger;
	this._flowTriggerPowerStatusChanged = this.driver.flowTriggerPower;
	
	
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
	this.registerCapability('alarm_tamper', 'NOTIFICATION');
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
        if (report && report['Sensor Type'] !== undefined
          && report['Sensor Value (Parsed)'] !== undefined
          && (report['Sensor Type'] === 'Dew point (version 2)' || report['Sensor Type'] === 'Dew point (version 2) ')) {
          const token = {
            dewpoint: report['Sensor Value (Parsed)'],
          };

          this._dewPointTrigger.trigger(this, token, this.device_data).catch(this.error);

          return report['Sensor Value (Parsed)'];
        }
        return null;
      },
    });
    
	this.node.CommandClass['COMMAND_CLASS_NOTIFICATION']
	  .on('report', (command, report) => {
		if (command.name === 'NOTIFICATION_REPORT') {
		  const notificationType = report['Notification Type'];
		  const event = report['Event'];

		  // Prüfen, ob es sich um einen "Weather Alarm" handelt
		  if (notificationType === 'Weather Alarm') {
			if (event === 2) {
			  // Schimmel erkannt
			  this.setCapabilityValue('alarm_generic.mold', true).catch(this.error);
			  this._moldAlarmOnTrigger.trigger(this, null, null).catch(this.error);
			} else if (event === 0) {
			  // Kein Schimmel mehr
			  this.setCapabilityValue('alarm_generic.mold', false).catch(this.error);
			  this._moldAlarmOffTrigger.trigger(this, null, null).catch(this.error);
			}
		  }
		}
	  });
	this.registerCapability('info_power', 'NOTIFICATION', {
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (!report || report['Notification Type'] !== 'Power Management') return null;

        let value = null;
        switch (report['Event']) {
          case 2: value = false; break; // Strom getrennt
          case 3: value = true;  break; // Strom wiederhergestellt
          default: return null;
        }

        this.setCapabilityValue('info_power', value).catch(this.error);
       this._flowTriggerPowerStatusChanged
         .trigger(this, { status: value })
          .catch(this.error);
        return value;
      },
    });

    this.registerCapability('measure_battery', 'BATTERY');
	
	this.homey.flow.getConditionCard('ZWA057_mold_onoff')
      .registerRunListener((args, state) => {
        const moldInfo = args.device.getCapabilityValue('alarm_generic.mold');
        return Promise.resolve(moldInfo);
      });
  }

}

module.exports = ZWA057;
