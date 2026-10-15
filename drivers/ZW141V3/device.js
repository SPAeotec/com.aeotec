'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW141 extends ZwaveDevice {

  onNodeInit() {
	  
	  this.enableDebug();
      this.printNode();
	  
	this._sceneTrigger = this.driver.sceneTrigger;  
    
    this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL');
	this.registerCapability('onoff', 'BASIC');
   
  
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report['Properties1']
        && report.Properties1['Key Attributes']
        && report['Scene Number']) {
        const data = {
          button: report['Scene Number'].toString(),
          scene: report.Properties1['Key Attributes'],
        };
        this._sceneTrigger.trigger(this, null, data).catch(this.error);
      }
    });
	
	
  
  }
  
    async sceneRunListener(args, state) {
    if (!args) throw new Error('No arguments provided');
    if (!state) throw new Error('No state provided');

    if (args.button && state.button
      && args.scene && state.scene) {
      return (args.button === state.button && args.scene === state.scene);
    } throw new Error('Button or scene undefined in args or state');
  }
  

}

module.exports = ZW141;
