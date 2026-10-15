'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

const TAMPER_TIMEOUT = 30 * 1000;

class AeotecDoorbellSixDevice extends ZwaveDevice {
  async onNodeInit() {
     this.printNode();
     this.enableDebug();

    // Registering Flows
    this._chimeActivated = this.driver.chimeActivated;
    this._battery1Off = this.driver.battery1Off;
    this._battery1On = this.driver.battery1On;
    this._battery2Off = this.driver.battery2Off;
    this._battery2On = this.driver.battery2On;
    this._battery3Off = this.driver.battery3Off;
    this._battery3On = this.driver.battery3On;
    this._doorbell1 = this.driver.doorbell1;
    this._doorbell2 = this.driver.doorbell2;
    this._doorbell3 = this.driver.doorbell3;
    this._activateChime = this.driver.activateChime;
    this._deactivateChime = this.driver.deactivateChime;
    this._setTone = this.driver.setTone;
    this._setVolume = this.driver.setVolume;

    // Register Capabilities
    this.registerCapability('onoff.siren', 'BASIC', {
      set: 'BASIC_SET',
      setParser: value => {
        return this._startAlarm(value).catch(this.error);
      },
      report: 'BASIC_SET',
      reportParser: report => {
        if (report.Value !== undefined) {
          if (report.Value > 0) {
            this._chimeActivated.trigger(this).catch(this.error);
            return true;
          } else {
            return false;
          }
        }
      }
    });

    this.registerCapability('alarm_tamper', 'NOTIFICATION', {
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (
          report['Notification Type'] !== undefined
          && report['Notification Type'] === 'Home Security'
          && report.Event !== undefined
          && report.Event === 9
        ) {
          if (this.tamperTimeout) clearTimeout(this.tamperTimeout);
          this.tamperTimeout = setTimeout(() => {
            this.setCapabilityValue('alarm_tamper', false).catch(this.error);
          }, TAMPER_TIMEOUT);

          return true;
        }
        return null;
      }
    });

    this.registerCapability('alarm_battery.button_1', 'NOTIFICATION', {
      multiChannelNodeId: 3,
      get: 'NOTIFICATION_GET',
      getParser: () => ({
        'V1 Alarm Type': 0,
        'Notification Type': 'Power Management',
        Event: 0,
      }),
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (
          report['Notification Type'] !== undefined
          && report['Notification Type'] === 'Power Management'
          && report.Event !== undefined
        ) {
          if (report.Event > 0) {
            this._battery1On.trigger(this).catch(this.error);
            return true;
          } else {
            this._battery1Off.trigger(this).catch(this.error);
            return false;
          }
        }
        return null;
      },
    });

    this.registerCapability('alarm_battery.button_2', 'NOTIFICATION', {
      multiChannelNodeId: 4,
      get: 'NOTIFICATION_GET',
      getParser: () => ({
        'V1 Alarm Type': 0,
        'Notification Type': 'Power Management',
        Event: 0,
      }),
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (
          report['Notification Type'] !== undefined
          && report['Notification Type'] === 'Power Management'
          && report.Event !== undefined
        ) {
          if (report.Event > 0) {
            this._battery2On.trigger(this).catch(this.error);
            return true;
          } else {
            this._battery2Off.trigger(this).catch(this.error);
            return false;
          }
        }
        return null;
      },
    });

    this.registerCapability('alarm_battery.button_3', 'NOTIFICATION', {
      multiChannelNodeId: 5,
      get: 'NOTIFICATION_GET',
      getParser: () => ({
        'V1 Alarm Type': 0,
        'Notification Type': 'Power Management',
        Event: 0,
      }),
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (
          report['Notification Type'] !== undefined
          && report['Notification Type'] === 'Power Management'
          && report.Event !== undefined
        ) {
          if (report.Event > 0) {
            this._battery3On.trigger(this).catch(this.error);
            return true;
          } else {
            this._battery3Off.trigger(this).catch(this.error);
            return false;
          }
        }
        return null;
      },
    });

    // Backwards compatibility: Listen for browse being activated
    this.registerMultiChannelReportListener(1, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Backwards compatibility: Listen for tamper alarm being activated
    this.registerMultiChannelReportListener(2, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Listen for doorbell 1 being activated
    this.registerMultiChannelReportListener(3, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          if (this.hasCapability('alarm_battery.button_1')) this._doorbell1.trigger(this).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Listen for doorbell 2 being activated
    this.registerMultiChannelReportListener(4, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          if (this.hasCapability('alarm_battery.button_2')) this._doorbell2.trigger(this).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Listen for doorbell 3 being activated
    this.registerMultiChannelReportListener(5, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          if (this.hasCapability('alarm_battery.button_3')) this._doorbell3.trigger(this).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Backwards compatibility: Listen for environment alarm being activated
    this.registerMultiChannelReportListener(6, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Backwards compatibility: Listen for security alarm being activated
    this.registerMultiChannelReportListener(7, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Backwards compatibility: Listen for emergency alarm being activated
    this.registerMultiChannelReportListener(8, 'BASIC', 'BASIC_SET', report => {
      if (report.Value !== undefined) {
        if (report.Value > 0) {
          this.setCapabilityValue('onoff.siren', true).catch(this.error);
          this._chimeActivated.trigger(this).catch(this.error);
        } else {
          this.setCapabilityValue('onoff.siren', false).catch(this.error);
        }
      }
    });

    // Register Capabilities for Maintenance Actions (button (un)pairing)
    this.registerCapabilityListener('button.pair_button_1', async () => {
      return await this._setConfig(49, 1, 1).catch(this.error);
    });

    this.registerCapabilityListener('button.pair_button_2', async () => {
      return await this._setConfig(49, 1, 2).catch(this.error);
    });

    this.registerCapabilityListener('button.pair_button_3', async () => {
      return await this._setConfig(49, 1, 4).catch(this.error);
    });

    this.registerCapabilityListener('button.unpair_button_1', async () => {
      return await this._setConfig(48, 1, 1).catch(this.error);
    });

    this.registerCapabilityListener('button.unpair_button_2', async () => {
      return await this._setConfig(48, 1, 2).catch(this.error);
    });

    this.registerCapabilityListener('button.unpair_button_3', async () => {
      return await this._setConfig(48, 1, 4).catch(this.error);
    });

    // Listen for any buttons being paired/removed and adding/removing the battery alarm capability accordingly
    this.registerReportListener('CONFIGURATION', 'CONFIGURATION_REPORT', async report => {
      if (
        report['Parameter Number'] !== undefined
        && report['Parameter Number'] === 51
        && report['Configuration Value'] !== undefined
      ) {
        this._buttonCapabilities(report['Configuration Value'].readInt8()).catch(this.error);
      }
    });

    // On boot of the app, retrieve if there are any buttons paired
  //  await this.configurationGet({ index: 51 })
  //    .catch(this.error)
  //    .then(report => {
   //     if (
   //       report['Parameter Number'] !== undefined
    //      && report['Parameter Number'] === 51
   //       && report['Configuration Value'] !== undefined
  //      ) {
  //        this._buttonCapabilities(report['Configuration Value'].readInt8()).catch(this.error);
   //     }
   //   });

    // Loop through any (tone) volumes if they aren't set (volume = -1), and fetching it from the device on bootup
    for (let endpoint = 1; endpoint <= 8; endpoint++) {
      if (this.getSetting(`volume_${endpoint}`) === -1) {
        await this._getSoundSwitch(endpoint).catch(this.error);
      }
    }

    // Refresh the notification capabilities (if necessary) on bootup
    if (this.getCapabilityValue('alarm_tamper') === null) {
       // Notification GET almost never works properly on the main node, so we assume tamper is off by default.
      await this.setCapabilityValue('alarm_tamper', false).catch(this.error);
    }

    if (this.hasCapability('alarm_battery.button_1') && this.getCapabilityValue('alarm_battery.button_1') === null) {
      await this.refreshCapabilityValue('alarm_battery.button_1', 'NOTIFICATION').catch(this.error);
    }

    if (this.hasCapability('alarm_battery.button_2') && this.getCapabilityValue('alarm_battery.button_2') === null) {
      await this.refreshCapabilityValue('alarm_battery.button_2', 'NOTIFICATION').catch(this.error);
    }

    if (this.hasCapability('alarm_battery.button_3') && this.getCapabilityValue('alarm_battery.button_3') === null) {
      await this.refreshCapabilityValue('alarm_battery.button_3', 'NOTIFICATION').catch(this.error);
    }

    // Support purposes, easier to determine if the current user needs to re-pair his/her device, either mandatory or recommended
    if (
      (this.hasCapability('alarm_battery.button_1') && this.getSetting('zw_group_4') !== '1.1')
      || (this.hasCapability('alarm_battery.button_2') && this.getSetting('zw_group_5') !== '1.1')
      || (this.hasCapability('alarm_battery.button_3') && this.getSetting('zw_group_6') !== '1.1')
    ) {
      this.error(`Mandatory that the user has to re-pair the Doorbell 6 (${this.getName()}) if he/she wants full functionality.`);
    }
    if (this.getSetting('zw_group_2') === '1.1') {
      this.error(`User has (most likely) been using the old implementation, re-pair is not mandatory, it is recommended if he/she has issues.`);
    }
  }

  // Start Alarm action flow card listener
  async startFlowAlarm(args) {
    if (args.sound !== undefined) {
      return await this._startAlarm(true, args.sound).catch(this.error);
    }

    return false;
  }

  // Stop Alarm action flow card listener
  async stopFlowAlarm() {
    return await this._startAlarm(false).catch(this.error);
  }

  // Set Tone and Volume (Sound Switch) action flow card listener
  async setFlowSoundSwitch(args) {
    if (
      args.alarm !== undefined
      && args.tone !== undefined
      && args.volume !== undefined
    ) {
      if (args.tone === '0') args.tone = this.getSetting('tone_' + args.alarm);
      if (args.volume === -1) args.volume = this.getSetting('volume_' + args.alarm);

      return await this._setSoundSwitch(args.alarm, args.tone, args.volume).catch(this.error);
    }

    return false;
  }

  // Main functions
  // Handle any button pairing and adding/removing any capabilities accordingly
  async _buttonCapabilities(value) {
    if (value === 1 || value === 3 || value === 5 || value === 7) {
      if (!this.hasCapability('alarm_battery.button_1')) {
        await this.addCapability('alarm_battery.button_1').catch(this.error);
        await this.refreshCapabilityValue('alarm_battery.button_1', 'NOTIFICATION').catch(this.error);
      }
    } else {
      if (this.hasCapability('alarm_battery.button_1')) {
        await this.removeCapability('alarm_battery.button_1').catch(this.error);
      }
    }

    if (value === 2 || value === 3 || value === 6 || value === 7) {
      if (!this.hasCapability('alarm_battery.button_2')) {
        await this.addCapability('alarm_battery.button_2').catch(this.error);
        await this.refreshCapabilityValue('alarm_battery.button_2', 'NOTIFICATION').catch(this.error);
      }
    } else {
      if (this.hasCapability('alarm_battery.button_2')) {
        await this.removeCapability('alarm_battery.button_2').catch(this.error);
      }
    }

    if (value === 4 || value === 5 || value === 6 || value === 7) {
      if (!this.hasCapability('alarm_battery.button_3')) {
        await this.addCapability('alarm_battery.button_3').catch(this.error);
        await this.refreshCapabilityValue('alarm_battery.button_3', 'NOTIFICATION').catch(this.error);
      }
    } else {
      if (this.hasCapability('alarm_battery.button_3')) {
        await this.removeCapability('alarm_battery.button_3').catch(this.error);
      }
    }
  }

  // Start alarm function
  async _startAlarm(value, endpoint) {
    let CC_basic;

    if (!value) {
      CC_basic = this.getCommandClass('BASIC');
    } else if (endpoint) {
      CC_basic = this.getCommandClass('BASIC', { multiChannelNodeId: Number(endpoint) });
    } else {
      endpoint = this.getSetting('default_sound') || 1;
      CC_basic = this.getCommandClass('BASIC', { multiChannelNodeId: Number(endpoint) });
    }

    if (CC_basic instanceof Error) return Promise.reject('failed_to_get_basic_command_class');
    if (typeof CC_basic.BASIC_SET !== 'function') return Promise.reject('basic_set_function_unavailable');

    await CC_basic.BASIC_SET({
      'Value': (value) ? 255 : 0
    })
    .catch(err => {
      return Promise.reject(err);
    })
    .then(() => {
      // If sabotage alarm was manually activated, turn on the capability too
      if (endpoint === '2') {
        if (this.tamperTimeout) clearTimeout(this.tamperTimeout);
        this.tamperTimeout = setTimeout(() => {
          this.setCapabilityValue('alarm_tamper', false).catch(this.error);
        }, TAMPER_TIMEOUT);

        this.setCapabilityValue('alarm_tamper', true).catch(this.error);
      }

      return Promise.resolve();
    });
  }

  // Custom SET CONFIGURATION function, as there are too many custom settings to handle independently
  async _setConfig(index, size, value) {
    const CC_configuration = this.getCommandClass('CONFIGURATION');
    let buf;

    if (CC_configuration instanceof Error) return Promise.reject('failed_to_get_configuration_command_class');
    if (typeof CC_configuration.CONFIGURATION_SET !== 'function') return Promise.reject('configuration_set_function_unavailable');

    try {
      buf = Buffer.alloc(size);
      buf.writeUIntBE(value, 0, size);
    } catch(err) {
      this.error(err);
      return Promise.reject(err);
    }

    if (buf) {
      await CC_configuration.CONFIGURATION_SET({
        'Parameter Number': index,
        Level: {
          Size: size,
          Default: false,
        },
        'Configuration Value': buf
      })
      .catch(err => {
        return Promise.reject(err);
      })
      .then(() => {
        return Promise.resolve();
      });
    }
  }

  // Retrieve Tone and Volume (Sound Switch) function
  async _getSoundSwitch(endpoint) {
    if (!endpoint) endpoint = Number(endpoint || 1);
    const CC_soundSwitch = this.getCommandClass('SOUND_SWITCH', { multiChannelNodeId: endpoint });

    if (CC_soundSwitch instanceof Error) return Promise.reject('failed_to_get_sound_switch_command_class');
    if (typeof CC_soundSwitch.SOUND_SWITCH_CONFIGURATION_GET !== 'function') return Promise.reject('sound_switch_get_function_unavailable');

    await CC_soundSwitch.SOUND_SWITCH_CONFIGURATION_GET()
    .catch(err => {
      return Promise.reject(err);
    })
    .then(result => {
      if (
        result
        && result.hasOwnProperty('Volume')
        && result.hasOwnProperty('Default Tone Identifer')
      ) {
        this.setSettings({
          ['volume_' + endpoint]: Number(result['Volume']),
          ['tone_' + endpoint]: '' + result['Default Tone Identifer'],
        }).catch(this.error);      }
    });
  };

  // Set Tone and Volume (Sound Switch) Function
  async _setSoundSwitch(endpoint, tone, volume) {
    if (typeof endpoint !== 'number') endpoint = Number(endpoint || 1);
    const CC_soundSwitch = this.getCommandClass('SOUND_SWITCH', { multiChannelNodeId: endpoint });

    if (CC_soundSwitch instanceof Error) return Promise.reject('failed_to_get_sound_switch_command_class');
    if (typeof CC_soundSwitch.SOUND_SWITCH_CONFIGURATION_SET !== 'function') return Promise.reject('sound_switch_set_function_unavailable');

    if (typeof volume === 'undefined' || volume === null) volume = this.getSetting('volume_' + endpoint) || 100;
    if (typeof tone === 'undefined' || tone === null) tone = this.getSetting('tone_' + endpoint) || 6;

    await CC_soundSwitch.SOUND_SWITCH_CONFIGURATION_SET({
      Volume: Number(volume),
      'Default Tone Identifier': Number(tone),
    })
    .catch(err => {
      return Promise.reject(err);
    })
    .then(() => {
      this.setSettings({
        ['volume_' + endpoint]: Number(volume),
        ['tone_' + endpoint]: '' + tone
      }).catch(this.error);

      return Promise.resolve();
    });
  };

  // Listening for any settings changes
  async onSettings({oldSettings, newSettings, changedKeys}) {
    // Endpoint 1 settings
    if (changedKeys.includes(`tone_1`) || changedKeys.includes('volume_1')) {
      this._setSoundSwitch(1, newSettings['tone_1'], newSettings['volume_1']).catch(this.error);
    }

    if (changedKeys.includes('browse_play_mode') || changedKeys.includes('browse_light_effect')) {
      let value = Number(newSettings['browse_light_effect']) * 16777216;
      value += Number(newSettings['browse_play_mode']) * 65536;

      this._setConfig(1, 4, value).catch(this.error);
    }

    // Looping through all other endpoint (2 - 8) settings
    for (let endpoint = 2; endpoint <= 8; endpoint++) {
      if (changedKeys.includes(`tone_${endpoint}`) || changedKeys.includes(`volume_${endpoint}`)) {
        this._setSoundSwitch(endpoint, newSettings[`tone_${endpoint}`], newSettings[`volume_${endpoint}`]).catch(this.error);
      }

      if (
        changedKeys.includes(`light_effect_${endpoint}`)
        || changedKeys.includes(`tone_length_${endpoint}`)
        || changedKeys.includes(`tone_interval_${endpoint}`)
        || changedKeys.includes(`tone_repeat_${endpoint}`)
      ) {
        let value = Number(newSettings[`light_effect_${endpoint}`]) * 16777216;
        value += Number(newSettings[`tone_length_${endpoint}`]) * 65536;
        value += Number(newSettings[`tone_interval_${endpoint}`]) * 256;
        value += Number(newSettings[`tone_repeat_${endpoint}`]);

        this._setConfig(endpoint, 4, value).catch(this.error);
      }
    }

    // Looping through all light effect (1 - 7) settings
    for (let index = 1; index <= 7; index++) {
      if (
        changedKeys.includes(`light_effect_${index}_brighten`)
        || changedKeys.includes(`light_effect_${index}_dim`)
        || changedKeys.includes(`light_effect_${index}_on`)
        || changedKeys.includes(`light_effect_${index}_off`)
      ) {
        let value = Number(newSettings[`light_effect_${index}_brighten`]) * 16777216;
        value += Number(newSettings[`light_effect_${index}_dim`]) * 65536;
        value += Number(newSettings[`light_effect_${index}_on`]) * 256;
        value += Number(newSettings[`light_effect_${index}_off`]);

        this._setConfig((15 + index), 4, value).catch(this.error);
      }
    }

    return Promise.resolve(newSettings);
  }
}

module.exports = AeotecDoorbellSixDevice;
