'use strict'

const {Cluster, ZCLDataTypes} = require('zigbee-clusters');

const ATTRIBUTES = {
    switchType: {
        id: 0x0000,
        manufacturerId: 0x1310,
        type: ZCLDataTypes.enum8({
            toggle: 0x00,
            momentary: 0x01,
        }),
    },
    switchActions: {
        id: 0x0010,
        manufacturerId: 0x1310,
        type: ZCLDataTypes.enum8({
            onoff: 0x00,
            offon: 0x01,
            toggle: 0x02,
        }),
    },
    switchControls: {
        id: 0x0011,
        manufacturerId: 0x1310,
        type: ZCLDataTypes.enum8({
            disable: 0x00,
            enable: 0x01,
        }),
    }
};

const COMMANDS = {};

module.exports = class AeotecSwitchConfigurationCluster extends Cluster {

    static get ID() {
        return 0xfd00;
    }

    static get NAME() {
        return 'aeotecSwitchConfiguration';
    }

    static get ATTRIBUTES() {
        return ATTRIBUTES;
    }

    static get COMMANDS() {
        return COMMANDS;
    }

}
