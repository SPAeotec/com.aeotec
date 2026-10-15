'use strict';

const {WindowCoveringCluster, ZCLDataTypes} = require('zigbee-clusters');

module.exports = class AeotecWindowCoveringCluster extends WindowCoveringCluster {

    static get ATTRIBUTES() {
        return {
            ...super.ATTRIBUTES,
            mode: {
                id: 0x0017,
                type: ZCLDataTypes.map8('ledFeedback', 'maintenanceMode', 'calibrationMode', 'directionReversed'),
            },
        };
    }
}
