'use strict';

const ZigBeeDeviceDebug = require('../../lib/ZigBeeDeviceDebug');

const { CLUSTER } = require('zigbee-clusters');


class ButtonDevice extends ZigBeeDeviceDebug {

	onNodeInit({ zclNode }) {
		
		this.enableDebug();
		this.printNode();
		
		

  // Flow-Trigger einmal holen
  this._sceneTrigger = this.driver.sceneTrigger;


  // Anti-Doppeltrigger (bei schnellen Folge-Reports)
  this._lastScene = null;
  this._lastSceneTs = 0;

   /**
   * Registriert 'btn_button' am IAS_ZONE-Cluster (zoneStatus),
   * leitet Scene aus alarm1/alarm2 ab, triggert Flow-Karte einmalig.
   */
 // _registerBtnButtonCapability() {
    this.registerCapability('btn_button', CLUSTER.IAS_ZONE, {
      get: 'zoneStatus',
      report: 'zoneStatus',
      reportParser: (value) => {
        const a1 = !!value.alarm1; // single
        const a2 = !!value.alarm2; // double

        // Mapping gemäß deinem Log:
        // Einmal:  a1=true, a2=false  -> single
        // Doppelt: a1=false, a2=true  -> double
        // Halten:  a1=true, a2=true   -> hold
        // Reset:   beide false        -> idle
        let scene = 'idle';
        if (a1 && !a2) scene = 'single';
        else if (!a1 && a2) scene = 'double';
        else if (a1 && a2) scene = 'hold';

        // Flow-Trigger nur bei einer Aktion (nicht bei idle)
        if (scene !== 'idle') this._triggerScene(scene);

        // Enum-Capability erwartet eine der IDs als Rückgabe
        return scene;
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 1800,
          minChange: 1,
        }
      }
    });



		this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
			getOpts: {
				getOnOnline: false,
				getOnStart: false,				
			},
			get: 'batteryVoltage',
			report: 'batteryVoltage',
			reportParser(value) {			
				return this.convertVoltageToPct(value);
			},
			reportOpts: {
				configureAttributeReporting: {
					minInterval: 3600, // No minimum reporting interval
					maxInterval: 60000, // Maximally every ~16 hours
					minChange: 1, // Report when value changed by 1
				},
			},
		});

						
		this.registerCapability('measure_temperature', CLUSTER.TEMPERATURE_MEASUREMENT, {
			getOpts: {
				getOnOnline: false,
				getOnStart: false,
			},
			reportOpts: {
				configureAttributeReporting: {
					minInterval: 300, // No minimum reporting interval
					maxInterval: 1800 , // Maximally every ~30 minutes
					minChange: 0.1, // Report when value changed by 0.1
				}
			}
		});

	}
		

	convertVoltageToPct(voltage) {
		var batteryMap = {
			'28': 75, '27': 50, '26': 25, '25': 5
		};

		var minVolts = 25;
		var maxVolts = 28;

		var volt = Math.round(voltage);
		this.log(`read voltage: ${voltage} - as number: ${volt} - as string again: ${volt.toString()}`);

		if (volt > maxVolts) {
			volt = maxVolts;
			this.log('voltage is above maxium');
			return 100;
		}

		if (volt < minVolts) {
			volt = minVolts;
			this.log('voltage is below minimum');
			return 0;
		}

		var pct = batteryMap[volt.toString()];

		if (pct == null || pct == undefined || typeof (pct) == 'undefined') {
			this.log(`cannot detect voltage. - ${pct} - ${pct[volt]}`);
			return null;
		}

		return pct;
	}
	
	  _triggerScene(scene) {
    const now = Date.now();
    if (scene === this._lastScene && (now - this._lastSceneTs) < 150) {
      return;
    }
    this._lastScene = scene;
    this._lastSceneTs = now;

    this._sceneTrigger
      .trigger(this, { scene }, { scene }) // tokens + state für Flow-Filter
      .catch(this.error);
  }

}

module.exports = ButtonDevice;
