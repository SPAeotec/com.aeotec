const {ZigBeeDevice} = require("homey-zigbeedriver");
const {Cluster, debug, CLUSTER} = require('zigbee-clusters');
const AeotecBasicCluster = require('../../lib/zigbee/cluster/AeotecBasicCluster');
const AeotecSwitchConfigurationCluster = require('../../lib/zigbee/cluster/AeotecSwitchConfigurationCluster');
const retrieveDeviceInfo = require("../../lib/zigbee/deviceInfo");
const initOnOffDevice = require("../../lib/zigbee/onOffDevice");
const initElectricalMeasurementDevice = require("../../lib/zigbee/electricalMeasurementDevice");
const initMeteringDevice = require("../../lib/zigbee/meteringDevice");
const PicoSwitchSettings = require("../util/picoSwitchSettings")
const PicoSwitchFlowTriggers = require("../util/picoSwitchFlowTriggers")

Cluster.addCluster(AeotecBasicCluster);
Cluster.addCluster(AeotecSwitchConfigurationCluster);

module.exports = class PicoSwitchDevice extends ZigBeeDevice {

  switchTrigger = null;
  /** @type PicoSwitchSettings */
  switchSettings;
  /** @type PicoSwitchFlowTriggers */
  switchFlowTrigger;

  async onNodeInit({zclNode, node}) {
    await super.onNodeInit({zclNode, node});

    const isSubDevice = this.isSubDevice();

    if (!isSubDevice) {
      retrieveDeviceInfo(this, zclNode);
      if (!this.hasCapability('supports_switch_action')) {
        await this.addCapability('supports_switch_action').catch(this.error);
      }
    }

    const switchEndpoint = isSubDevice ? 2 : 1;
    await initOnOffDevice(this, zclNode, switchEndpoint).catch(this.error);
    await initElectricalMeasurementDevice(this, zclNode, switchEndpoint).catch(this.error);
    await initMeteringDevice(this, zclNode, switchEndpoint).catch(this.error);

    if (isSubDevice) {
      return;
    }

    this.switchSettings = new PicoSwitchSettings(this, this.sw1Endpoint, this.sw2Endpoint);
    this.switchFlowTrigger = new PicoSwitchFlowTriggers(this, this.sw1Endpoint, this.sw2Endpoint);
  }

  async onSettings({oldSettings, newSettings, changedKeys}) {
    await this.switchSettings?.handleSwitchSettings(oldSettings, newSettings, changedKeys);
  }
}
