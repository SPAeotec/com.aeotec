'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW189 extends ZwaveDevice {

  onNodeInit() {
   // this.registerSetting('82', value => Buffer.from([Number(!value)]));
  }

}

module.exports = ZW189;
