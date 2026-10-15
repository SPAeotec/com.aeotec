'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZWA050 extends ZwaveDevice {
    async onNodeInit() {
        this.enableDebug();
        this.printNode();

		this._systemError = this.driver.systemErrorOnTrigger;
        // Capabilities registrieren
        this.registerCapability('alarm_tamper', 'NOTIFICATION');
        this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_generic.system', 'NOTIFICATION');
		
		        this.registerCapability('alarm_smoke', 'NOTIFICATION', {
            reportParser: report => {
                if (report['Notification Type'] === 'Smoke' && report['Event'] === 2) {
                    return true;
                }
                if (report['Notification Type'] === 'Smoke' && report['Event'] === 0) {
                    return false;
                }
                return null;
            }
        });

        this.registerCapability('alarm_smoke.1', 'NOTIFICATION', {
            reportParser: report => {
                if (report['Notification Type'] === 'Smoke' && report['Event'] === 3) {
                    return true;
                }
                if (report['Notification Type'] === 'Smoke' && report['Event'] === 0) {
                    return false;
                }
                return null;
            }
        });
		
		this.registerCapability('alarm_generic.system', 'NOTIFICATION', {
		report: 'NOTIFICATION_REPORT',
		reportParser: report => {
        if (report && report['Notification Type'] === 'System' && report['Event'] !== undefined ) {
          if (report['Event'] > '0') {
            this._systemError.trigger(this, null, null).catch(this.error);
            return true;
          }
		  if (report['Event'] == '0') {
            //this._systemError.trigger(this, null, null).catch(this.error);
            return false;
          }
         
          return null;
        }
        return null;
      },
    });
    
	//Reset function
		 this.registerCapabilityListener('button.reset_error', async () =>  {
		    const capabilityId = 'alarm_generic.system'; // Ersetze durch die ID der Capability
		await this.setCapabilityValue(capabilityId, false)
        .then(() => this.log(`${capabilityId} reset to false`))
        .catch(err => this.error('Error resetting capability:', err));
    });
 

        // Capabilities initial auf false setzen
        try {
            await this.setCapabilityValue('alarm_tamper', true);
            await this.setCapabilityValue('alarm_smoke', false);
            await this.setCapabilityValue('alarm_smoke.1', false);
            await this.setCapabilityValue('alarm_generic.system', false);
            console.log('Capabilities wurden initial gesetzt.');
        } catch (error) {
            console.error('Fehler beim Setzen der initialen Capability-Werte:', error);
        }
    }
}

module.exports = ZWA050;
