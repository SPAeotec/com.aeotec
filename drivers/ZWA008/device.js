'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA008 extends ZwaveDevice {


  onNodeInit() {
     this.enableDebug();
   this.printNode();
	
	// Registering Flows
		this._flowTriggerTiltInfo = this.driver.flowTriggerTiltInfo;
		this._flowTriggerNoTiltInfo = this.driver.flowTriggerNoTiltInfo;
		this._flowTriggerInput = this.driver.flowTriggerInput;

		
		
	// Registering Capabilitys
	
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
   

   if (this.hasCapability('info_tilt')) {
      this.registerCapability('info_tilt', 'SENSOR_BINARY', {
        report: 'SENSOR_BINARY_REPORT',
        reportParser: report => {
          if (report && report['Sensor Type'] === 'Tilt') {
            if (report['Sensor Value'] === 'idle') {
              this._flowTriggerNoTiltInfo.trigger(this).catch(this.error);
              return false;
            }


            if (report['Sensor Value'] === 'detected an event') {
              this._flowTriggerTiltInfo.trigger(this).catch(this.error);
              if (this.getSetting('no_alarm_if_tilt') === 1) {
                this.setCapabilityValue('alarm_contact', false).catch(this.error);
              }
              return true;
            }
          }
          return null;
        },
      });
    }

    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report['Properties1'] !== undefined
          && report.Properties1['Key Attributes'] !== undefined
          && report['Scene Number'] !== undefined) {
        const state = {
          scene: report.Properties1['Key Attributes'],
        };

        if (report['Scene Number'] === 1) {
          this._flowTriggerInput.trigger(this, null, state).catch(this.error);
        }
      }
    });



   this.homey.flow.getConditionCard('ZWA008_is_tilted')
     .registerRunListener((args, state) => {
       const tiltInfo = args.device.getCapabilityValue('info_tilt');
      return Promise.resolve(tiltInfo);
    });

   this.DisableTamperContactFlow = this.homey.flow.getActionCard('ZWA008_disabletampercontact');
   this.DisableTamperContactFlow.registerRunListener((args, state) => {
     return this.setCapabilityValue('alarm_tamper', false).catch(this.error);
   });
  }

  inputFlowListener(args, state) {
    return (state.scene === args.scene);
  }

}
module.exports = ZWA008;
