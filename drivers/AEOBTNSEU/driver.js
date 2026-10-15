'use strict';

const Homey = require('homey');

class AEOBTNEUDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('btn_scene');
	this.sceneTrigger.registerRunListener((args, state) => {
	  // Bei Dropdown-Args liefert Homey entweder die ID direkt,
	  // oder ein Objekt { id, label }. Wir unterstützen beides:
	  const selected = args.scene?.id ?? args.scene;
	  return selected === state.scene;
	});


  }

}

module.exports = AEOBTNEUDriver;
