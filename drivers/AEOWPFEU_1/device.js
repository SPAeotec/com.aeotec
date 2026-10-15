'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER } = require('zigbee-clusters');
const { debug } = require("zigbee-clusters");
//const ManufacturerBasicCluster = require('../../lib/ManufacturerBasicCluster');
//Cluster.addCluster(ManufacturerBasicCluster);

class AeotecOutlet1 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.enableDebug();
    this.printNode();

 //   await super.onNodeInit({ zclNode });
 
 this.registerCapability("onoff", CLUSTER.ON_OFF, { //);
   getOpts: {
				getOnOnline: true,
				getOnStart: true
			},
      reportOpts: {
		  
        configureAttributeReporting: {
		  endpointId: 1,
		  cluster: CLUSTER.ON_OFF,
		  attributeName: 'onOff',
          minInterval: 1, // No minimum reporting interval
          maxInterval: 300, // Maximally every 5 Minutes
          minChange: 1, // Report when value changed by 5
		  
        }
      }
	  
    });


  this.registerCapability("measure_power", CLUSTER.ELECTRICAL_MEASUREMENT, {
     // get: 'activePower',
	//		report: 'activePower',
	//		reportParser(report) {
	//		this.log("### report:"+report)	
	//		if (report && report.activePower >= 1) return report.activePower /10;
	//		},
	  get: "activePower",
      getParser:  value => value / 10,
      report: "activePower",
      reportParser: value => value / 10,

	  getOpts: {
				getOnOnline: true,
				getOnStart: true
			},
      reportOpts: {
		  
        configureAttributeReporting: {
		  endpointId: 1,
		  cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
		   			  
		  attributeName: 'activePower',
          minInterval: 15, // No minimum reporting interval
          maxInterval: 300, // Maximally every 5 Minutes
          minChange: 1.0, // Report when value changed by 5
		  
        }
      }
	  
 });
	
 this.registerCapability("measure_voltage", CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: "rmsVoltage",
      getParser:  value => value / 10,
      report: "rmsVoltage",
      reportParser: value => value / 10,

	  getOpts: {
				getOnOnline: true,
				getOnStart: true
			},
      reportOpts: {
		  
        configureAttributeReporting: {
		  endpointId: 1,
		  cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
		  			  
		  attributeName: 'rmsVoltage',
          minInterval: 300, // No minimum reporting interval
          maxInterval: 1800, // Maximally every 5 Minutes
          minChange: 1.0, // Report when value changed by 5
		  
        }
      }
	  
 });   
	
this.registerCapability("measure_current", CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: "rmsCurrent",
      getParser:  value => value / 1000,
      report: "rmsCurrent",
      reportParser: value => value / 1000,

	  getOpts: {
				getOnOnline: true,
				getOnStart: true
			},
      reportOpts: {
		  
        configureAttributeReporting: {
		  endpointId: 1,
		  cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
		  			  
		  attributeName: 'rmsCurrent',
          minInterval: 15, // No minimum reporting interval
          maxInterval: 300, // Maximally every 5 Minutes
          minChange: 10.0, // Report when value changed by 5
		  
        }
      }
	  
 });	


  //  if (this.hasCapability('onoff')) {
 //     this.registerCapability('onoff', CLUSTER.ON_OFF, {
  //      getOpts: {
  //        getOnStart: true,
  //      },
  //    });
  //    try {
  //      await this.configureAttributeReporting([
  //        {
   //         endpointId: 1,
   //         cluster: CLUSTER.ON_OFF,
   //         attributeName: 'onOff',
   //         minInterval: 0,
    //        maxInterval: 300,
   //         minChange: 1,
   //       },
   //     ]);
   //   } catch (err) {
   //     this.log('could not configure Attribute Reporting ON_OFF');
   //    this.log(err);
    //    }
   // };
	
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
     
 
  



module.exports = AeotecOutlet1;

