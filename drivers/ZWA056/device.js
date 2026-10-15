'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

/**
 * Kandidaten, die abhängig von Param 10 angezeigt werden dürfen
 * 0..8 -> Mapping siehe MODE_TO_CAP unten
 */
const CAP_CANDIDATES = [
  'alarm_water',       // 0
  'alarm_smoke',       // 1
  'alarm_co',          // 2
  'alarm_co2',         // 3
  'alarm_contact',     // 4
  'info_tilt',         // 5 (custom)
  'alarm_motion',      // 6
  'alarm_glass_break', // 7 (custom)
  'alarm_emergency',   // 8 (custom)
];

// Param 10 -> Capability
const MODE_TO_CAP = {
  0: 'alarm_water',
  1: 'alarm_smoke',
  2: 'alarm_co',
  3: 'alarm_co2',
  4: 'alarm_contact',
  5: 'info_tilt',
  6: 'alarm_motion',
  7: 'alarm_glass_break',
  8: 'alarm_emergency',
  // 9/10 -> keine Zuordnung (entfernt alle Kandidaten)
};

class ZWA056 extends ZwaveDevice {

  /**
   * Merker, damit Parser nur einmal registriert werden
   */
  _capRegistered = new Set();

  async onNodeInit() {
    this.enableDebug();
    this.printNode();
	
	



    // (1) Listener-Limits gezielt anheben – VOR den registerCapability()-Aufrufen
    for (const ccId of ['NOTIFICATION', 'SENSOR_MULTILEVEL', 'BATTERY']) {
      const cc = this.getCommandClass(ccId); // aus ZwaveDevice-API
      if (cc && typeof cc.setMaxListeners === 'function') {
        cc.setMaxListeners(20);
      }
    }
    if (this.node && typeof this.node.setMaxListeners === 'function') {
      this.node.setMaxListeners(25);
    }

    // ---------- Flows ----------
    this._flowTriggerTiltInfo = this.driver.flowTriggerTiltInfo;
    this._flowTriggerNoTiltInfo = this.driver.flowTriggerNoTiltInfo;
 //   this._flowTriggerInput = this.driver.flowTriggerInput;
    this._flowdewPointTrigger = this.driver.dewPointTrigger;
    this._flowTriggerPowerStatusChanged = this.driver.flowTriggerPower;
    this._flowTriggerGlassBreak = this.driver.flowTriggerGlassBreak;
    this._flowTriggerEmergency = this.driver.flowTriggerEmergency;
	this._moldAlarmOnTrigger = this.driver.moldAlarmOnTrigger;
    this._moldAlarmOffTrigger = this.driver.moldAlarmOffTrigger;	

    // ---------- Statisch immer sicht-/nutzbare Capabilities registrieren ----------
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_battery', 'BATTERY');
	this.registerCapability('alarm_water', 'NOTIFICATION');
	
	//mold
	
	this.node.CommandClass['COMMAND_CLASS_NOTIFICATION'].on('report', (command, report) => {
	  if (command.name === 'NOTIFICATION_REPORT') {
		const notificationType = report['Notification Type'];
		const event = report['Event'];

		if (notificationType === 'Weather Alarm') {
		  if (event === 2) {
			this.setCapabilityValue('alarm_generic.mold', true).catch(err => this.error(err));
			if (this._moldAlarmOnTrigger) {
			  this._moldAlarmOnTrigger.trigger(this).catch(err => this.error('Trigger failed:', err));
			}
		  } else if (event === 0) {
			this.setCapabilityValue('alarm_generic.mold', false).catch(err => this.error(err));
			if (this._moldAlarmOffTrigger) {
			  this._moldAlarmOffTrigger.trigger(this).catch(err => this.error('Trigger failed:', err));
			}
		  }
		}
	}});

	  
	  this.homey.flow.getConditionCard('ZWA056_mold_onoff')
      .registerRunListener((args, state) => {
        const moldInfo = args.device.getCapabilityValue('alarm_generic.mold');
        return Promise.resolve(moldInfo);
      });

    // WICHTIG: KEINE der Kandidaten (0..8) hier per registerCapability() registrieren!
    // Diese werden dynamisch via add/remove gesteuert (siehe syncVisibleCapabilityForParam10).

    // ---------- Parser/Registrierung, die unabhängig vom Modus sind ----------
    // Power Connected
    this.registerCapability('info_power', 'NOTIFICATION', {
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {
        if (!report || report['Notification Type'] !== 'Power Management') return null;

        let value = null;
        switch (report['Event']) {
          case 2: value = false; break; // Strom getrennt
          case 3: value = true;  break; // Strom wiederhergestellt
          default: return null;
        }

        this.setCapabilityValue('info_power', value).catch(this.error);
        this._flowTriggerPowerStatusChanged
          .trigger(this, { status: value })
          .catch(this.error);
        return value;
      },
    });

    // DEW-POINT
    this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL', {
      get: 'SENSOR_MULTILEVEL_GET',
      getParser: () => ({
        'Sensor Type': 'Dew point (version 2)',
        Properties1: { Scale: 0 },
      }),
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (
          report &&
          report['Sensor Type'] !== undefined &&
          report['Sensor Value (Parsed)'] !== undefined &&
          (
            report['Sensor Type'] === 'Dew point (version 2)' ||
            report['Sensor Type'] === 'Dew point (version 2) '
          )
        ) {
          const token = { dewpoint: report['Sensor Value (Parsed)'] };
          this._flowdewPointTrigger
            .trigger(this, token, this.device_data)
            .catch(this.error);
          return report['Sensor Value (Parsed)'];
        }
        return null;
      },
    });

    // ---------- Sichtbarkeit gemäß Param 10 initial synchronisieren ----------
    const mode = await this._getParam10Mode();
    await this._syncVisibleCapabilityForParam10(mode);
	

    // --- Reset all alarm capabilities to false after inclusion ---
    const alarmCaps = [
      'alarm_tamper','alarm_water','alarm_smoke','alarm_co','alarm_co2',
      'alarm_contact','alarm_motion','alarm_glass_break','alarm_emergency'
    ];
    alarmCaps.forEach(cap => {
      if (this.hasCapability(cap)) {
        this.setCapabilityValue(cap, false).catch(this.error);
      }
    });


    // ---------- Sonstige Flow-Karten ----------
    this.homey.flow.getConditionCard('ZWA056_is_tilted')
      .registerRunListener((args, state) => {
        const tiltInfo = args.device.getCapabilityValue('info_tilt');
        return Promise.resolve(tiltInfo);
      });

    this.DisableTamperContactFlow = this.homey.flow.getActionCard('ZWA056_disabletampercontact');
    this.DisableTamperContactFlow.registerRunListener((args, state) => {
      return this.setCapabilityValue('alarm_tamper', false).catch(this.error);
    });
  }

  /**
   * Device settings geändert -> bei Änderung von Param10 die sichtbaren Capabilities umschalten
   */

async onSettings({ oldSettings, newSettings, changedKeys }) {
  const hasParam10 = changedKeys.includes('10');
  const raw = newSettings['10'];
  const mode = hasParam10 ? Number.parseInt(String(raw), 10) : undefined;

  try {
    await super.onSettings({ oldSettings, newSettings, changedKeys });
  } catch (err) {
    this.error('super.onSettings() failed', err);
    if (hasParam10 && Number.isFinite(mode)) {
      try {
        await this.configurationSet({ index: 10, size: 1 }, mode);
      } catch (e) {
        this.error('configurationSet(10) failed', e);
      }
    }
  }

  if (hasParam10) {
    await this._syncVisibleCapabilityForParam10(Number.isFinite(mode) ? mode : -1);
  }
}


  /**
   * Liest den Modus:
   * 1) bevorzugt aus Device-Setting '10' (falls vorhanden),
   * 2) sonst direkt per CONFIGURATION_GET (index:10, size:1).
   */
  async _getParam10Mode() {
    let mode;

    // a) Setting (wenn im Driver als Z-Wave Setting definiert)
    const v = this.getSetting('10');
    if (v !== undefined && v !== null) {
      mode = parseInt(String(v), 10);
    }

    // b) Fallback: direkt vom Gerät lesen
    if (!Number.isInteger(mode)) {
      try {
        const res = await this.configurationGet({ index: 10, size: 1 });
        mode = typeof res === 'number' ? res : parseInt(res, 10);
      } catch (e) {
        this.error('configurationGet({index:10,size:1}) fehlgeschlagen', e);
        mode = -1;
      }
    }
    return mode;
  }

  /**
   * Synchronisiert die sichtbare Capability abhängig von Param 10.
   * - Entfernt alle Kandidaten, die nicht dem Mapping entsprechen.
   * - Fügt die gewünschte Capability hinzu (falls definiert) und registriert deren Parser lazy.
   */
  async _syncVisibleCapabilityForParam10(mode) {
    const wanted = MODE_TO_CAP[mode];

    // 1) Nicht benötigte Kandidaten entfernen
    for (const cap of CAP_CANDIDATES) {
      if (cap !== wanted && this.hasCapability(cap)) {
        await this.removeCapability(cap).catch(this.error);
      }
    }

    // 2) Gewünschte hinzufügen & Parser registrieren
    if (wanted && !this.hasCapability(wanted)) {
      await this.addCapability(wanted).catch(this.error);

    // Set initial value to false for newly added capability
    if (this.hasCapability(wanted)) {
      await this.setCapabilityValue(wanted, false).catch(this.error);
    }
      this._ensureRegistrationForCapability(wanted);
    }
  }

  /**
   * Registriert Parser/Listener NUR für die aktivierte Capability (einmalig).
   */
  _ensureRegistrationForCapability(capId) {
    if (this._capRegistered.has(capId)) return;

    switch (capId) {
      case 'alarm_water':
        this.registerCapability('alarm_water', 'NOTIFICATION');
        break;

      case 'alarm_smoke':
        this.registerCapability('alarm_smoke', 'NOTIFICATION');
        break;

      case 'alarm_co':
        this.registerCapability('alarm_co', 'NOTIFICATION');
        break;

      case 'alarm_co2':
        this.registerCapability('alarm_co2', 'NOTIFICATION');
        break;

      case 'alarm_contact':
        this.registerCapability('alarm_contact', 'NOTIFICATION');
        break;

      case 'alarm_motion':
        this.registerCapability('alarm_motion', 'NOTIFICATION');
        break;

      case 'info_tilt':
     
	 // TILT (SENSOR_BINARY)
        this.registerCapability('info_tilt', 'SENSOR_BINARY', {
          report: 'SENSOR_BINARY_REPORT',
          reportParser: report => {
            if (!report || report['Sensor Type'] !== 'Tilt') return null;

            const sensorValue = report['Sensor Value'];
            if (sensorValue === 'idle') {
              this._flowTriggerNoTiltInfo?.trigger(this).catch(err => this.error('No tilt trigger failed:', err));
              return false;
            }
            if (sensorValue === 'detected an event') {
              this._flowTriggerTiltInfo?.trigger(this).catch(err => this.error('Tilt trigger failed:', err));

              if (this.getSetting('no_alarm_if_tilt') === 1) {
                this.setCapabilityValue('alarm_contact', false).catch(err => this.error('Setting alarm_contact failed:', err));
              }
              return true;
            }
            return null;
          },
        });
        // Initialwert setzen (nur wenn Capability existiert)
        if (this.getCapabilityValue('info_tilt') === null) {
          this.setCapabilityValue('info_tilt', false).catch(this.error);
        }
        break;

      case 'alarm_glass_break':
        // Glasbruch NUR über Notification CC (Home Security/Event 6, Clear via Event 0)
        this.registerCapability('alarm_glass_break', 'NOTIFICATION', {
          report: 'NOTIFICATION_REPORT',
          reportParser: (report) => {
            if (!report || report['Notification Type'] !== 'Home Security') return null;
            const event = report.Event;
            const parsed = report['Event (Parsed)'];
            const props = report.Properties1 || {};
            const epBuf = report['Event Parameter'] || report['Event Parameter (Raw)'];
            const epLen = props['Event Parameters Length'];

            if (event === 6 || parsed === 'Glass Breakage, Unknown Location') {
              this._flowTriggerGlassBreak?.trigger(this).catch(err => this.error('trigger failed:', err));
              return true;
            }
            if (event === 0) {
              let epVal = null;
              if (typeof epBuf === 'number') epVal = epBuf;
              else if (Buffer.isBuffer(epBuf) && epBuf.length) epVal = epBuf[0];
              if (epVal === 0x06) return false;
              if (!epLen || epLen === 0) return false;
              return null;
            }
            return null;
          },
        });
        break;

      case 'alarm_emergency':
        // Emergency NUR über Notification CC (Type 'Emergency' 0x0A: Event 4 aktiv, Event 0 Clear)
        this.registerCapability('alarm_emergency', 'NOTIFICATION', {
          report: 'NOTIFICATION_REPORT',
          reportParser: (report) => {
            if (!report || report['Notification Type'] !== 'Emergency') return null;

            const event = report.Event;
            const props = report.Properties1 || {};
            const epBuf = report['Event Parameter'] || report['Event Parameter (Raw)'];
            const epLen = props['Event Parameters Length'];

            if (event === 4) {
              this._flowTriggerEmergency?.trigger(this).catch(err => this.error('trigger failed:', err));
              return true;
            }
            if (event === 0) {
              let epVal = null;
              if (typeof epBuf === 'number') epVal = epBuf;
              else if (Buffer.isBuffer(epBuf) && epBuf.length) epVal = epBuf[0];
              if (epLen === 0) return false;
              if (epVal === 0x04) return false;
              return null;
            }
            return null;
          },
        });
        break;
    }

    this._capRegistered.add(capId);
  }

	


	
	  
  inputFlowListener(args, state) {
    return (state.scene === args.scene);
  }
}

module.exports = ZWA056;
