const PicoSwitchDevice = require('../../lib/device/picoSwitchDevice');

module.exports = class AeotecZGA002 extends PicoSwitchDevice {
  sw1Endpoint = 2;
  sw2Endpoint = 3;
}
