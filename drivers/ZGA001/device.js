'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER } = require('zigbee-clusters');
const ManufacturerBasicCluster = require('../../lib/zigbee/cluster/AeotecBasicCluster');

Cluster.addCluster(ManufacturerBasicCluster);

class AeotecZGA001 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.enableDebug();
    this.printNode();

   

    
 
}
}
     
 
  



module.exports = AeotecZGA001;

