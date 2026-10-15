'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER } = require('zigbee-clusters');
const { debug } = require("zigbee-clusters");
const ManufacturerBasicCluster = require('../../lib/zigbee/cluster/AeotecBasicCluster');
//const ElectricalMeasurementCluster = require('../../lib/Clusters/electricalMeasurement');

Cluster.addCluster(ManufacturerBasicCluster);

class AeotecOutlet extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.enableDebug();
    this.printNode();

    await super.onNodeInit({ zclNode });

    //try {
    // const firmWare = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.BASIC)]
    //  .clusters[CLUSTER.BASIC.NAME].readAttributes('swBuildId');
    // this.log('Read Firmware Value: ', firmWare);
    //  this.setSettings({ firmWareVersion: firmWare.swBuildId })
    //      .catch(err => {
    //        this.error('failed to update firmWareVersion settings', err);
    //      });
    //} catch (err) {
    //  this.log('could not read firmWare');
    //  this.log(err);
   // }

    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        getOpts: {
          getOnStart: true,
        },
      });
      try {
        await this.configureAttributeReporting([
          {
            endpointId: 1,
            cluster: CLUSTER.ON_OFF,
            attributeName: 'onOff',
            minInterval: 0,
            maxInterval: 300,
            minChange: 1,
          },
        ]);
      } catch (err) {
        this.log('could not configure Attribute Reporting ON_OFF');
       this.log(err);
        }
    };
	
	//if (this.hasCapability('measure_power')) {
	// this.registerCapability('measure_power', CLUSTER.ELECTRICALMEASURMENT, {
		 
   //     getOpts: {
   //       getOnStart: true,
   //     }
   //   });
	//  try {
   //     await this.configureAttributeReporting([
   //       {
    //        endpointId: 1,
    //        cluster: CLUSTER.METERING,
    //        attributeName: 'activePower',
    //        minInterval: 0,
    //        maxInterval: 300,
     //       minChange: 1,
    //     },
    //  ]);
   // } catch (err) {
    //   this.log('could not configure Attribute Reporting METERING');
   //   this.log(err);
   //    }
   // }
 
}
}
     
 
  



module.exports = AeotecOutlet;

