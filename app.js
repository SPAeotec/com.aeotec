'use strict';

const Homey = require('homey');

class AeotecApp extends Homey.App {

  onInit() {
    this.homey.flow.getDeviceTriggerCard('switch-action')
      .registerRunListener((args, state) => {
        if (args.switch !== 'any' && args.switch !== state.switch) {
          return false;
        }

        if (args.action !== 'any' && args.action !== state.action) {
          return false;
        }

        return true;
      });

    this.log(`${Homey.manifest.id} running...`);
  }

}

module.exports = AeotecApp;
