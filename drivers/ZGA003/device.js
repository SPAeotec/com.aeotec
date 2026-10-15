const PicoSwitchDevice = require('../../lib/device/picoSwitchDevice');

module.exports = class AeotecZGA003 extends PicoSwitchDevice {
  sw1Endpoint = 3;
  sw2Endpoint = 4;
}
