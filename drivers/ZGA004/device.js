const {ZigBeeDevice, Util} = require("homey-zigbeedriver");
const retrieveDeviceInfo = require("../../lib/zigbee/deviceInfo");
const {Cluster, CLUSTER} = require("zigbee-clusters");
const AeotecBasicCluster = require("../../lib/zigbee/cluster/AeotecBasicCluster");
const AeotecWindowCoveringCluster = require("../../lib/zigbee/cluster/AeotecWindowCoveringCluster");
const AeotecWindowCoveringsConfigurationCluster = require("../../lib/zigbee/cluster/AeotecWindowCoveringsConfigurationCluster");
const AeotecSwitchConfigurationCluster = require("../../lib/zigbee/cluster/AeotecSwitchConfigurationCluster");
const PicoSwitchSettings = require("../../lib/util/picoSwitchSettings");
const PicoSwitchFlowTriggers = require("../../lib/util/picoSwitchFlowTriggers");

Cluster.addCluster(AeotecBasicCluster);
Cluster.addCluster(AeotecWindowCoveringCluster);
Cluster.addCluster(AeotecWindowCoveringsConfigurationCluster)
Cluster.addCluster(AeotecSwitchConfigurationCluster);

const liftEndpointId = 1;
const tiltEndpointId = 2;

module.exports = class AeotecZGA004 extends ZigBeeDevice {
  sw1Endpoint = 4;
  sw2Endpoint = 5;

  /** @type PicoSwitchSettings */
  switchSettings;
  /** @type PicoSwitchFlowTriggers */
  switchFlowTrigger;
  tiltListenerConfigured = false;

  async onNodeInit({zclNode, node}) {
    await super.onNodeInit({zclNode, node});

    retrieveDeviceInfo(this, zclNode);
    if (!this.hasCapability('supports_switch_action')) {
      await this.addCapability('supports_switch_action').catch(this.error);
    }

    this.switchSettings = new PicoSwitchSettings(this, this.sw1Endpoint, this.sw2Endpoint);
    this.switchFlowTrigger = new PicoSwitchFlowTriggers(this, this.sw1Endpoint, this.sw2Endpoint);

    this.registerCapability('windowcoverings_set', CLUSTER.WINDOW_COVERING, {
        endpoint: liftEndpointId,
      }
    );

    await this.checkTiltCapability();

    // Retrieve shutter configuration when a mode change is reported
    this.zclNode
      .endpoints[liftEndpointId]
      .clusters[CLUSTER.WINDOW_COVERING.NAME]
      .on('attr.mode', mode => this.readShutterConfiguration().catch(this.error));

    Util.wrapAsyncWithRetry(async () => {
      await this.readShutterConfiguration();
    }, 5, 5000).catch(e => this.error('Failed to read shutter configuration after 5 retries', e));
  }

  async readShutterConfiguration() {
    await this.zclNode
      .endpoints[liftEndpointId]
      .clusters[AeotecWindowCoveringsConfigurationCluster.NAME]
      .readAttributes(...Object.keys(AeotecWindowCoveringsConfigurationCluster.ATTRIBUTES))
      .then(async (result) => {
        this.log('Shutter settings', JSON.stringify(result));
        await this.setSettings({
          operating_mode: String(result.operatingMode),
          move_time: result.moveTime / 100,
          motor_response_time: result.motorResponseTime / 100,
          slat_tilt_time: result.slatTiltTime / 100,
          slat_position_control: String(result.slatPositionMode),
          movement_mode: String(result.movementMode),
          momentary_move_time: result.momentaryMovementTime,
          self_calibration: result.selfCalibration === 0x01,
        });

        await this.checkTiltCapability(String(result.operatingMode));
      });
  }

  async onSettings({oldSettings, newSettings, changedKeys}) {
    await this.switchSettings?.handleSwitchSettings(oldSettings, newSettings, changedKeys);

    const windowCoveringsSettings = {};
    changedKeys.forEach(changedKey => {
      const value = newSettings[changedKey];
      switch (changedKey) {
        case 'operating_mode':
          windowCoveringsSettings.operatingMode = Number(value);
          break;
        case 'move_time':
          windowCoveringsSettings.moveTime = value * 100;
          break;
        case 'motor_response_time':
          windowCoveringsSettings.motorResponseTime = value * 100;
          break;
        case 'slat_tilt_time':
          windowCoveringsSettings.slatTiltTime = value * 100;
          break;
        case 'slat_position_control':
          windowCoveringsSettings.slatPositionMode = Number(value);
          break;
        case 'movement_mode':
          windowCoveringsSettings.movementMode = Number(value);
          break;
        case 'momentary_move_time':
          windowCoveringsSettings.momentaryMovementTime = value;
          break;
        case 'self_calibration':
          windowCoveringsSettings.selfCalibration = value ? 0x01 : 0x00;
          break;
      }
    });

    if (Object.keys(windowCoveringsSettings).length > 0) {
      await this.zclNode
        .endpoints[liftEndpointId]
        .clusters[AeotecWindowCoveringsConfigurationCluster.NAME]
        .writeAttributes(windowCoveringsSettings);

      if (typeof windowCoveringsSettings.operatingMode !== 'undefined') {
        await this.checkTiltCapability(String(windowCoveringsSettings.operatingMode));
      }
    }
  }

	async checkTiltCapability(newMode) {
	const operationMode = newMode ?? this.getSetting('operating_mode');
	this.log('Checking mode', newMode, operationMode);
 
	if (operationMode === '1') {
	// Venetian mode
		if (!this.hasCapability('windowcoverings_tilt_set')) {
		await this.addCapability('windowcoverings_tilt_set').catch(this.error);
		}
 
		if (!this.tiltListenerConfigured) {
		this.registerCapability('windowcoverings_tilt_set', CLUSTER.WINDOW_COVERING, {
		endpoint: tiltEndpointId,
 
		setParser(value) {
		if (this.getSetting('invert_tilt_direction')) {
		value = 1 - value;
	}
 
	return {
	percentageTiltValue: Math.round(value * 100),
	};
	},
 
	reportParser(value) {
	let tiltValue = value / 100;
	 
	if (this.getSetting('invert_tilt_direction')) {
	tiltValue = 1 - tiltValue;
	}
	 
		return tiltValue;
		},
	});
	 
	this.tiltListenerConfigured = true;
	}
	} else {
	// Roller shade
	if (this.hasCapability('windowcoverings_tilt_set')) {
	await this.removeCapability('windowcoverings_tilt_set').catch(this.error);
	}
   }
  }
}
