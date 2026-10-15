const {Cluster, debug, CLUSTER} = require('zigbee-clusters');
const OnOffBoundCluster = require('../../lib/zigbee/cluster/OnOffBoundCluster');
const LevelControlBoundCluster = require('../../lib/zigbee/cluster/LevelControlBoundCluster');

module.exports = class PicoSwitchFlowTriggers {

  constructor(device, sw1Endpoint, sw2Endpoint) {
    this.device = device
    this.switchTrigger = device.homey.flow.getDeviceTriggerCard('switch-action');

    // Bind on/off/level control button commands
    [{e: sw1Endpoint, s: 'sw1'}, {e: sw2Endpoint, s: 'sw2'}].forEach(sw => {
      device.zclNode.endpoints[sw.e]
        .bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
          onSetOff: () => this.triggerSwitchFlow(sw.s, 'pressed', 'off'),
          onSetOn: () => this.triggerSwitchFlow(sw.s, 'pressed', 'on'),
          onToggle: () => this.triggerSwitchFlow(sw.s, 'pressed', 'toggle'),
        }));
      device.zclNode.endpoints[sw.e]
        .bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
          onMove: ({moveMode}) => this.triggerSwitchFlow(sw.s, 'held', moveMode),
          onStop: () => this.triggerSwitchFlow(sw.s, 'released', 'stop'),
        }));
    });
  }

  triggerSwitchFlow(switchNumber, action, subAction) {
    const tokens = {
      switch: switchNumber,
      switch_action: subAction,
    };
    const state = {
      switch: switchNumber,
      action,
    };
    this.device.log('Trigger flow', tokens, state);
    this.switchTrigger?.trigger(this.device, tokens, state);
  }
}
