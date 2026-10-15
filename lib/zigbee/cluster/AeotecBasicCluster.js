'use strict';

const {BasicCluster, ZCLDataTypes} = require('zigbee-clusters');

module.exports = class AeotecBasicCluster extends BasicCluster {

    static get ATTRIBUTES() {
        return {
            ...super.ATTRIBUTES,
            serialNumber: {
                id: 0xd,
                type: ZCLDataTypes.string,
            },
        };
    }
}
