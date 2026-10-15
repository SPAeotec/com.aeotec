'use strict';
const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecHomeEnergyDevice extends ZwaveDevice {

  onNodeInit() {
    this.enableDebug();
    this.printNode();

    // --- NEU: einfache Sende-Queue + Defaults für Delay/Retry ---
    this._configQueue = Promise.resolve();
    this._defaultDelayMs = 250;   // sanfter Spread zwischen CONFIGURATION_SET Frames
    this._defaultRetries = 1;     // 1 Wiederholversuch bei temporären PHY/Transmit-Fehlern

    this._resetMeter = this.driver.resetMeter;
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
    this.registerCapability('measure_voltage', 'METER');
    this.registerCapability('measure_current', 'METER');

    // Reset function
    this.registerCapabilityListener('button.reset_meter', async () =>
    {
      // Register button. Maintenance action button was pressed, return a promise
      if (this.node && this.node.CommandClass.COMMAND_CLASS_METER)
      {
        this.log('Maintainance button METER_RESET pushed.');
        return await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({});
      }
      this.log('Does not support meter resets, or not a valid node.');
      return Promise.reject('The device could not be reset');
    });

    this.registerSetting('cumulative', value => {
      try {
        if (value > 0) {
          this.setEnergy({ cumulative: true });
          this.log('Energy = general');
        } else if (value < 1) {
          this.setEnergy({ cumulative: false });
          this.log('Energy = consumer');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    });

    // Clamp1
    if (this.node.MultiChannelNodes.hasOwnProperty('1')) {
      this.registerCapability('measure_power.1', 'METER', {
        multiChannelNodeId: 1,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 1),
      });
      this.registerCapability('meter_power.1', 'METER', {
        multiChannelNodeId: 1,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 1),
      });

      this.registerCapability('measure_voltage.1', 'METER', {
        multiChannelNodeId: 1,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 1),
      });
      this.registerCapability('measure_current.1', 'METER', {
        multiChannelNodeId: 1,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 1),
      });
    }

    // Clamp2
    if (this.node.MultiChannelNodes.hasOwnProperty('2')) {
      this.registerCapability('measure_power.2', 'METER', {
        multiChannelNodeId: 2,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 2),
      });
      this.registerCapability('meter_power.2', 'METER', {
        multiChannelNodeId: 2,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 2),
      });

      this.registerCapability('measure_voltage.2', 'METER', {
        multiChannelNodeId: 2,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 2),
      });
      this.registerCapability('measure_current.2', 'METER', {
        multiChannelNodeId: 2,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 2),
      });
    }

    // Clamp3
    if (this.node.MultiChannelNodes.hasOwnProperty('3')) {
      this.registerCapability('measure_power.3', 'METER', {
        multiChannelNodeId: 3,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 3),
      });

      this.registerCapability('meter_power.3', 'METER', {
        multiChannelNodeId: 3,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 3),
      });

      this.registerCapability('measure_voltage.3', 'METER', {
        multiChannelNodeId: 3,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 3),
      });
      this.registerCapability('measure_current.3', 'METER', {
        multiChannelNodeId: 3,
        get: 'METER_GET',
        getOpts: { getOnStart: true, },
        report: 'METER_REPORT',
        reportParser: report => this.multiChannelNodeReportParser(report, 3),
      });
    }

    const channels = ['1', '2', '3'];
    channels.forEach(channelNumber => {
      if (
        !this.node.MultiChannelNodes.hasOwnProperty(channelNumber) &&
        this.hasCapability(`measure_power.${channelNumber}`) &&
        this.hasCapability(`meter_power.${channelNumber}`) &&
        this.hasCapability(`measure_voltage.${channelNumber}`) &&
        this.hasCapability(`measure_current.${channelNumber}`)
      ) {
        ['measure_power', 'meter_power', 'measure_voltage', 'measure_current'].forEach(capability => {
          this.removeCapability(`${capability}.${channelNumber}`).catch(this.error);
        });
      }
    });

    try {
      // --- async + await => geordnete, sanfte Parameter-Sets ---
      this.registerSetting('clamps', async (value) => {
        try {
          if (value == 0) {
            await this._setConfig(101, 4, 10);
            await this._setConfig(102, 4, 4);
            await this._setConfig(103, 4, 1);
            this.log('Clamps = 0');
          } else if (value == 1) {
            await this._setConfig(101, 4, 524554);
            await this._setConfig(102, 4, 65540);
            await this._setConfig(103, 4, 2049);
            this.log('Clamps = 1');
          } else if (value == 2) {
            await this._setConfig(101, 4, 1573642);
            await this._setConfig(102, 4, 196612);
            await this._setConfig(103, 4, 6145);
            this.log('Clamps = 2');
          } else if (value == 3) {
            await this._setConfig(101, 4, 3671818);
            await this._setConfig(102, 4, 458756);
            await this._setConfig(103, 4, 14337);
            this.log('Clamps = 3');
          } else {
            this.log('Unsupported value for clamps');
          }
        } catch (error) {
          this.log('Error setting configuration:', error);
          throw error;
        }
      });
    } catch (error) {
      this.log('Error registering setting:', error);
    }
  }

  /**
   * NEU: Promise-basierter Sleep (Ersatz für nicht existierendes this.homey.clock.sleep)
   * Verwendet bewusst das globale setTimeout, um Binding-Probleme zu vermeiden.
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * NEU: Serialisierte, "sanfte" CONFIGURATION_SET-Übertragung mit optionalem Retry/Backoff
   * Beibehaltener Aufruf: this._setConfig(index, size, value [, options])
   */
  async _setConfig(index, size, value, options = {}) {
    const retries = Number.isInteger(options.retries) ? options.retries : this._defaultRetries;
    const delayMs = Number.isInteger(options.delayMs) ? options.delayMs : this._defaultDelayMs;

    // in Queue einreihen, damit Aufrufe seriell erfolgen
    this._configQueue = this._configQueue.then(async () => {
      let attempt = 0;
      let lastErr;

      while (attempt <= retries) {
        try {
          // CC jeweils frisch ermitteln (robuster bei Node-Reconnect)
          const CC_configuration = this.getCommandClass('CONFIGURATION');
          if (CC_configuration instanceof Error) {
            throw new Error('failed_to_get_configuration_command_class');
          }
          if (typeof CC_configuration.CONFIGURATION_SET !== 'function') {
            throw new Error('configuration_set_function_unavailable');
          }

          // Wert -> Buffer
          const buf = Buffer.alloc(size);
          buf.writeUIntBE(value, 0, size);

          // eigentlicher CONFIGURATION_SET
          await CC_configuration.CONFIGURATION_SET({
            'Parameter Number': index,
            Level: {
              Size: size,
              Default: false,
            },
            'Configuration Value': buf
          });

          // sanfte Pause nach erfolgreichem Senden
          await this._sleep(delayMs);
          return; // success
        } catch (err) {
          lastErr = err;
          this.error(`CONFIGURATION_SET failed (param ${index}, try ${attempt + 1}/${retries + 1}):`, err);

          // Backoff vor erneutem Versuch (nur wenn noch Versuche übrig)
          if (attempt < retries) {
            await this._sleep(500);
          }
          attempt++;
        }
      }

      // nach allen Versuchen fehlgeschlagen
      throw lastErr;
    });

    // Aufrufer kann optional warten; hier geben wir die laufende Queue-Promise zurück
    return this._configQueue;
  }

  resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER)
    {
      this.log('Action card METER_RESET triggered');
      this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
    } else return false;
  }

  // (Dein auskommentiertes onSettings() lasse ich unverändert)
}

module.exports = AeotecHomeEnergyDevice;