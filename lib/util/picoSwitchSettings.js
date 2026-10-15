const {ZigBeeDevice} = require("homey-zigbeedriver");
const AeotecSwitchConfigurationCluster = require('../../lib/zigbee/cluster/AeotecSwitchConfigurationCluster');

module.exports = class PicoSwitchSettings {

  /** @type ZigBeeDevice */
  device;
  /** @type number */
  sw1Endpoint;
  /** @type number */
  sw2Endpoint;

  constructor(device, sw1Endpoint, sw2Endpoint) {
    this.device = device;
    this.sw1Endpoint = sw1Endpoint;
    this.sw2Endpoint = sw2Endpoint;
  }

  async handleSwitchSettings(oldSettings, newSettings, changedKeys) {
    const sw1Settings = {};
    const sw2Settings = {};

    this._testSwitchConfig(changedKeys, oldSettings, newSettings, 'sw1_type', 'sw1_actions');
    this._testSwitchConfig(changedKeys, oldSettings, newSettings, 'sw2_type', 'sw2_actions');

    changedKeys.forEach(changedKey => {
      const value = newSettings[changedKey];
      switch (changedKey) {
        case 'sw1_type':
          sw1Settings.switchType = value;
          break;
        case 'sw1_actions':
          sw1Settings.switchActions = value;
          break;
        case 'sw1_controls':
          sw1Settings.switchControls = value ? 'enable' : 'disable';
          break;
        case 'sw2_type':
          sw2Settings.switchType = value;
          break;
        case 'sw2_actions':
          sw2Settings.switchActions = value;
          break;
        case 'sw2_controls':
          sw2Settings.switchControls = value ? 'enable' : 'disable';
          break;

      }
    });

    if (Object.keys(sw1Settings).length > 0) {
      await this._writeSwitchSettings(this.sw1Endpoint, sw1Settings);
    }

    if (Object.keys(sw2Settings).length > 0) {
      await this._writeSwitchSettings(this.sw2Endpoint, sw2Settings);
    }
  }

  _testSwitchConfig(changedKeys, oldSettings, newSettings, typeKey, actionsKey) {
    if ((changedKeys.includes(typeKey) || changedKeys.includes(actionsKey))
      && (newSettings[typeKey] ?? oldSettings[typeKey]) === 'momentary'
      && (newSettings[actionsKey] ?? oldSettings[actionsKey]) !== 'toggle') {
      throw new Error(this.device.homey.__('momentary_toggle'));
    }
  }

  async _writeSwitchSettings(endpoint, settings) {
    this.device.log('Writing new switch settings', endpoint, settings);
    await this.device
      .zclNode
      .endpoints[endpoint]
      .clusters[AeotecSwitchConfigurationCluster.NAME]
      .writeAttributes(settings);
  }
}
