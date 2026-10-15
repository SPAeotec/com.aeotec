const {Util} = require("homey-zigbeedriver");
const {CLUSTER} = require('zigbee-clusters');

module.exports = function retrieveDeviceInfo(
  device,
  zclNode,
) {
  Util.wrapAsyncWithRetry(async () => {
    // Retrieve the values
    await zclNode
      .endpoints[device.getClusterEndpoint(CLUSTER.BASIC) ?? 1]
      .clusters[CLUSTER.BASIC.NAME]
      .readAttributes('serialNumber', 'dateCode', 'swBuildId')
      .then(async (result) => {
        // Convert incoming values to string
        const values = {};
        Object.keys(result).forEach((key) => {
          values[key] = String(result[key]);
          if (values[key] === '') {
            values[key] = 'n/a';
          }
        });
        device.log('Retrieved device information', result, values);

        await device.setSettings(values)
          .catch(e => device.error('Failed to set device info settings', e));
      });
  }, 5, 5000).catch(e => device.error('Failed to retrieve device information after 5 retries', e));
}
