const {CLUSTER} = require('zigbee-clusters');
const initFactorImplementation = require("./helper/deviceFactor");

module.exports = async function initMeteringDevice(
  device,
  zclNode,
  endpointId,
) {
  if (device.hasCapability('meter_power')) {
    device.log('Initialising meter_power capability')

    await initFactorImplementation(
      device, zclNode, 'meteringFactor', 'meter_power', CLUSTER.METERING, endpointId,
    )
      .then(() => device.log('Initialised meter_power capability'))
      .catch(e => device.error('Failed to initialise meter_power capability', e));
  }

  device.log('Metering device initialised!');
}
