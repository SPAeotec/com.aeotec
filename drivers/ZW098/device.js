'use strict';

const { ZwaveDevice } = require('homey-zwavedriver'); //delete (, util) 22.2
const Util = require('homey-zwavedriver').Util; //add 22.2
const Homey = require('homey'); //add 22.2

class AeotecLEDBulbDevice extends ZwaveDevice {

  onNodeInit() {
    
	this.enableDebug();
	this.printNode();
	
	this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');

    this.registerMultipleCapabilityListener(['light_hue', 'light_saturation', 'light_temperature', 'light_mode'], async (values, options) => {
      let rgb = { red: 0, green: 0, blue: 0 };
      let temp = { cw: 0, ww: 0 };

      if (values.light_mode === 'color') {
        if (this.currentRGB) rgb = this.currentRGB;
        else {
          const hue = this.getCapabilityValue('light_hue');
          const saturation = this.getCapabilityValue('light_saturation');
          const dim = this.getCapabilityValue('dim');

          rgb = Util.convertHSVToRGB({ hue, saturation, value: dim });
          this.currentRGB = rgb;
        }
      } else if (values.light_mode === 'temperature') {
        if (this.currentTemp) temp = this.currentTemp;
        else {
          temp.cw = this.getCapabilityValue('light_temperature') < 0.5 ? this._map(0, 0.5, 255, 10, this.getCapabilityValue('light_temperature')) : 0;
          temp.ww = this.getCapabilityValue('light_temperature') >= 0.5 ? this._map(0.5, 1, 10, 255, this.getCapabilityValue('light_temperature')) : 0;
          this.currentTemp = temp;
        }
      } else if (typeof values.light_hue === 'number' || typeof values.light_saturation === 'number') {
        const hue = typeof values.light_hue === 'number' ? values.light_hue : this.getCapabilityValue('light_hue');
        const saturation = typeof values.light_saturation === 'number' ? values.light_saturation : this.getCapabilityValue('light_saturation');
        const dim = this.getCapabilityValue('dim');

        rgb = Util.convertHSVToRGB({ hue, saturation, value: dim });
        this.currentRGB = rgb;
      } else if (typeof values.light_temperature === 'number') {
        if (values.light_temperature < 0.5) {
          temp.cw = this._map(0, 0.5, 255, 10, values.light_temperature);
        } else {
          temp.cw = 0;
        }

        if (values.light_temperature >= 0.5) {
          temp.ww = this._map(0.5, 1, 10, 255, values.light_temperature);
        } else {
          temp.ww = 0;
        }
        this.currentTemp = temp;
      }

      // Send values
      return this._sendColors({
        red: rgb.red, green: rgb.green, blue: rgb.blue, warm: temp.ww, cold: temp.cw,
      });
    });

    this.registerSetting('80', input => Buffer.from([(input) ? 2 : 0]));
    this.registerSetting('34', input => Buffer.from([(input) ? 1 : 0]));
    this.registerSetting('35', input => Buffer.from([(input) ? 1 : 0]));
  }

  async rainbowModeHandler(args) {
    this.log(args);

    if (args && typeof args.speed === 'number' && typeof args.fadeType === 'string' && typeof args.cycles === 'number') {
      // Map speed 100 - 0 to 0 - 254
      args.speed = Math.round(this._map(100, 0, 0, 254, args.speed));

      // Get fadeType as integer
      args.fadeType = Number(args.fadeType);

      // Round cycles
      args.cycles = Math.round(args.cycles);

      const command = this._createColourCommand(1, args.fadeType, args.cycles, args.speed, 5);

      // Send parameter values to module
      try {
        await this.node.CommandClass.COMMAND_CLASS_CONFIGURATION.CONFIGURATION_SET({
          'Parameter Number': 37,
          Level: {
            Size: 4,
            Default: false,
          },
          'Configuration Value': command,
        });

        await this.setSettings({
          37: command,
        });

        return Promise.resolve(true);
      } catch (err) {
        return Promise.resolve(false);
      }
    } else throw new Error('invalid_device');
  }

  _createColourCommand(colourDisplayCycle,
    colourTransitionStyle,
    cycleCount,
    colourChangeSpeed,
    colourResidenceTime) {
    return Buffer.from([
      this._getDecimalValueFromArrays(colourTransitionStyle, 2, colourDisplayCycle, 4, true),
      cycleCount,
      colourChangeSpeed,
      colourResidenceTime]);
  }

  _getDecimalValueFromArrays(value1, size1, value2, size2, fillPos5And4) {
    if (fillPos5And4) {
      return this._getDecimalValue(this._numberToBinaryArray(value1, size1)
        .concat(['0', '0'].concat(this._numberToBinaryArray(value2, size2))));
    }
    return this._getDecimalValue(this._numberToBinaryArray(value1, size1)
      .concat(this._numberToBinaryArray(value2, size2)));
  }

  _getDecimalValue(arr) {
    if (!arr) return new Error('no array provided');
    let binaryString = '';
    arr.forEach(item => {
      binaryString += item;
    });
    return parseInt(binaryString, 2);
  }

  _numberToBinaryArray(number, size) {
    number = (number).toString(2);
    const numbers = number.split('');

    numbers.forEach(x => {
      x = parseInt(x, 10);
    });

    // Check if array has correct size
    if (numbers.length !== size) {
      for (let i = 0; i < size; i++) {
        // Check if 0 prepend is needed to fill
        if (numbers.length < size) {
          numbers.unshift('0');
        } else break;
      }
    }
    return numbers;
  }

  _map(inputStart, inputEnd, outputStart, outputEnd, input) {
    return (outputStart + ((outputEnd - outputStart)
    / (inputEnd - inputStart)) * (input - inputStart));
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

module.exports = AeotecLEDBulbDevice;
