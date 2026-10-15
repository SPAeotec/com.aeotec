'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW129 extends ZwaveDevice {

  onNodeInit() {
    this._batteryTrigger = this.driver.batteryTrigger;
    this._sceneTrigger = this.driver.sceneTrigger;
    this._dimTrigger = this.driver.dimTrigger;

    this.registerCapability('measure_battery', 'BATTERY');
    

    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report.Properties1
            && report.Properties1['Key Attributes']
            && typeof (report['Scene Number']) !== 'undefined') {
        const data = {
          button: report['Scene Number'].toString(),
          scene: report.Properties1['Key Attributes'],
        };
        this._sceneTrigger.trigger(this, null, data).catch(this.error);
      }
    });
    this.registerReportListener('CONFIGURATION', 'CONFIGURATION_REPORT', report => {
      if (typeof (report['Parameter Number']) !== 'undefined'
            && typeof (report['Configuration Value']) !== 'undefined') {
        if (report['Parameter Number'] === 9) {
          const data = {
            button: report['Configuration Value'][0].toString(),
            scene: (report['Configuration Value'][1] === 1) ? 'Key Slide Up' : 'Key Slide Down',
          };
          this._sceneTrigger.trigger(this, null, data).catch(this.error);
        }
        if (report['Parameter Number'] === 10) {
          let value = Math.round(report['Configuration Value'][2] / 2) / 100;
          if (value < 0.5) value = Math.max(value - 0.05, 0);
          const token = {
            dim: value,
          };
          const data = {
            button: report['Configuration Value'][0].toString(),
          };
          this._dimTrigger.trigger(this, token, data).catch(this.error);
        }
      }
    });
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    super.onSettings({ oldSettings, newSettings, changedKeys });

    if (newSettings.rgb_name === 'custom') {
      await this.configurationSet({
        index: 5,
        size: 4,
      }, Buffer.from([newSettings.rgb_r, newSettings.rgb_g, newSettings.rgb_b, 0]));
    } else {
      const valueArray = newSettings.rgb_name.split(',');
      const multiplier = newSettings.rgb_name_level / 100 || 1;

      await this.configurationSet({
        index: 5,
        size: 4,
      }, Buffer.from([valueArray[0] * multiplier,
        valueArray[1] * multiplier,
        valueArray[2] * multiplier,
        0]));
    }
  }

  async sceneRunListener(args, state) {
    if (!args) throw new Error('No arguments provided');
    if (!state) throw new Error('No state provided');

    if (args.button && state.button
      && args.scene && state.scene) {
      return (args.button === state.button && args.scene === state.scene);
    } throw new Error('Button or scene undefined in args or state');
  }

  async dimRunListener(args, state) {
    if (!args) throw new Error('No arguments provided');
    if (!state) throw new Error('No state provided');

    if (args.button && state.button) {
      return (args.button === state.button);
    } throw new Error('Button undefined in args or state');
  }

}

module.exports = ZW129;
