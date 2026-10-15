'use strict';

const ZigBeeDeviceDebug = require('../../lib/ZigBeeDeviceDebug');

const { CLUSTER } = require('zigbee-clusters');

class AeotecMultiSensorDevice extends ZigBeeDeviceDebug {

	onNodeInit({ zclNode }) {

	

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
					maxInterval: 60000, // Maximally every ~12 hours
					minChange: 1, // Report when value changed by 1
				}
			}
		});

		
		this.registerCapability('alarm_contact', CLUSTER.IAS_ZONE, {
			getOpts: {
				getOnOnline: false,
				getOnStart: false
			},
			get: 'zoneStatus',
			report: 'zoneStatus',
			reportParser(value) {			
				return (value.alarm1);
			},
			reportOpts: {
				configureAttributeReporting: {
					minInterval: 0, // No minimum reporting interval
					maxInterval: 1800 , // Maximally every ~30 minutes
					minChange: 1, // Report when value changed by 1
				}
			}
		});		

			
		this.registerCapability('measure_temperature', CLUSTER.TEMPERATURE_MEASUREMENT, {
			getOpts: {
				getOnOnline: false,
				getOnStart: false
			},
			reportOpts: {
				configureAttributeReporting: {
					minInterval: 300, // No minimum reporting interval
					maxInterval: 1800 , // Maximally every ~30 minutes
					minChange: 0.1, // Report when value changed by 0.1
				}
			}
		})
	}

	convertVoltageToPct(voltage) {
		var batteryMap = {
			'28': 100, '27': 75, '26': 60, '25': 50, '24': 25, '23':10
		};

		var minVolts = 23;
		var maxVolts = 28;

		var volt = Math.round(voltage);
		this.log('read voltage: ', voltage);

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
			this.log('cannot detect voltage.')
			return null;
		}

		return pct;
	}

	onMeshInit() {
		this.log('AeotecMultiSensorDevice (AeotecMulti) has been inited');

		return;

		this.printNode();

		this.attachDebugListeners(['msTemperatureMeasurement/measuredValue', 'genPowerCfg/batteryVoltage', 'ssIasZone/zoneStatus', 'genPollCtrl/*']);

		this.batteryThreshold = 25;

		this.registerCapability('measure_temperature', 'msTemperatureMeasurement', {
			get: 'measuredValue',
			getOpts: {
				getOnStart: false,
				getOnOnline: false
			}
		});

		this.registerCapability('measure_battery', 'genPowerCfg', {
			get: 'batteryVoltage',
			getOpts: {
				getOnStart: false,
				getOnOnline: false
			},
			getParser: this.convertVoltageToPct.bind(this)
		});

		this.registerCapability('alarm_motion', 'ssIasZone', {
			get: 'zoneStatus',
			getOpts: {
				getOnOnline: false,
				getOnStart: false
			},
			getParser: value => {

				this.log('reading zoneStatus');

				if (value == null || value == undefined || typeof (value) == 'undefined') {
					return undefined;
				}

				return (value & 0x1) == (0x1);
			}
		});

		
		this.registerAttrReportListener('ssIasZone', 'zoneStatus', 1, 3600, null, value => {

			this.log('zoneStatus changed');

			if (value == null || value == undefined || typeof (value) == 'undefined') {
				return undefined;
			}

			this.setCapabilityValue('alarm_contact', (value & 0x1) == (0x1));
		}).catch(
			e => {
				this.log('failed to registerAtrReportListener for zone status change' + e);
				this.log(e);
			});

		this.registerAttrReportListener('genPowerCfg', 'batteryVoltage', 1, 3600, null, data1 => {
			this.log('batteryVoltage', data1);
			if (data1 <= this.batteryThreshold) {
				this.setCapabilityValue('alarm_battery', true);
			} else {
				this.setCapabilityValue('alarm_battery', false);
			}

			var pct = this.convertVoltageToPct(data1);

			if (pct != null && typeof (pct) != 'undefined') {
				this.setCapabilityValue('batteryPercentageRemaining', pct);
			}

		}, 0).catch(
			e => {
				this.log('failed to registerAtrReportListener for battery voltage' + e);
				this.log(e);
			});

		this.minReportTemp = /*this.getSetting('minReportTemp') ||*/ 1800;
		this.maxReportTemp = /*this.getSetting('maxReportTemp') ||*/ 3600;
	}

}

module.exports = AeotecMultiSensorDevice;
