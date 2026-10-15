'use strict';

const { ZwaveDevice, Util } = require('homey-zwavedriver');

class ZW121 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('onoff', 'BASIC');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');

    this.registerMultipleCapabilityListener(['light_hue', 'light_saturation'], async (values, options) => {
      const hue = typeof values.light_hue === 'number' ? values.light_hue : this.getCapabilityValue('light_hue');
      const saturation = typeof values.light_saturation === 'number' ? values.light_saturation : this.getCapabilityValue('light_saturation');
      const value = this.getCapabilityValue('dim');

      const rgb = Util.convertHSVToRGB({ hue, saturation, value });

      return this._sendColors({
        red: rgb.red, green: rgb.green, blue: rgb.blue, warm: 0, cold: 0,
      });
    });

    this.registerCapabilityListener('light_temperature', async (value, options) => {
      const cold = (1 - value) * 255;
      const warm = value * 255;

      return this._sendColors({
        red: 0, green: 0, blue: 0, warm, cold,
      });
    });

    this.registerCapabilityListener('light_mode', async (value, options) => {
      let colorValues = {};
      if (value === 'temperature') {
        const cold = (1 - this.getCapabilityValue('light_temperature')) * 255;
        const warm = this.getCapabilityValue('light_temperature') * 255;

        colorValues = {
          red: 0, green: 0, blue: 0, warm, cold,
        };
      } else {
        const hue = this.getCapabilityValue('light_hue');
        const saturation = this.getCapabilityValue('light_saturation');
        const dim = this.getCapabilityValue('dim');

        const rgb = Util.convertHSVToRGB({ hue, saturation, dim });

        colorValues = {
          red: rgb.red, green: rgb.green, blue: rgb.blue, warm: 0, cold: 0,
        };
      }

      return this._sendColors(colorValues);
    });
  }

  async _sendColors({
    red, green, blue, warm, cold,
  }) {
    return this.node.CommandClass.COMMAND_CLASS_SWITCH_COLOR.SWITCH_COLOR_SET({
      Properties1: {
        'Color Component Count': 5,
      },
      vg1: [
        {
          'Color Component ID': 0,
          Value: warm,
        },
        {
          'Color Component ID': 1,
          Value: cold,
        },
        {
          'Color Component ID': 2,
          Value: red,
        },
        {
          'Color Component ID': 3,
          Value: green,
        },
        {
          'Color Component ID': 4,
          Value: blue,
        },
      ],
    });
  }

}

module.exports = ZW121;
