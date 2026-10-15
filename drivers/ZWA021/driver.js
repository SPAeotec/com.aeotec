'use strict';

const Homey = require('homey');

class ZWA021DeviceDriver extends Homey.Driver {
	onInit() {
		super.onInit();

		this.spiritModeChanged = this.homey.flow.getDeviceTriggerCard('spirit_euro_mode_changed');
		this.spiritModeChanged.registerRunListener((args, state) => {
			return args.device.spiritModeChangedRunListener(args, state);
		});

		this.spiritModeChangedTo = this.homey.flow.getDeviceTriggerCard('spirit_euro_mode_changed_to');
		this.spiritModeChangedTo.registerRunListener((args, state) => {
			return args.device.spiritModeChangedRunListener(args, state);
		});

		this.spiritManualPosition = this.homey.flow.getDeviceTriggerCard('spirit_euro_manual_position');
		this.spiritProtectionChanged = this.homey.flow.getDeviceTriggerCard('spirit_protection_changed');
		this.spiritErrorOccurred = this.homey.flow.getDeviceTriggerCard('spirit_error_occurred');

		this.spiritMode = this.homey.flow.getConditionCard('spirit_euro_mode');
		this.spiritMode.registerRunListener((args, state) => {
			return args.device.spiritModeRunListener(args, state);
		});

		this.spiritProtection = this.homey.flow.getConditionCard('spirit_protection');
		this.spiritProtection.registerRunListener((args, state) => {
			return args.device.spiritProtectionRunListener(args, state);
		});

		this.spiritSetEcoTemperature = this.homey.flow.getActionCard('spirit_eco_temperature');
		this.spiritSetEcoTemperature.registerRunListener((args, state) => {
			return args.device.spiritSetEcoTemperatureRunListener(args, state);
		});

		this.spiritManualControl = this.homey.flow.getActionCard('spirit_manual_control');
		this.spiritManualControl.registerRunListener((args, state) => {
			return args.device.spiritManualControlRunListener(args, state);
		});

		this.spiritSetMode = this.homey.flow.getActionCard('spirit_set_euro_mode');
		this.spiritSetMode.registerRunListener((args, state) => {
			return args.device.spiritSetModeRunListener(args, state);
		});

		this.spiritSetProtection = this.homey.flow.getActionCard('spirit_protection');
		this.spiritSetProtection.registerRunListener((args, state) => {
			return args.device.spiritSetProtectionRunListener(args, state);
		});

		this.spiritSendRoomTemperature = this.homey.flow.getActionCard('spirit_external_temperature');
		this.spiritSendRoomTemperature.registerRunListener((args, state) => {
			return args.device.spiritSendRoomTemperatureRunListener(args, state);
		});
	}
}

module.exports = ZWA021DeviceDriver;
