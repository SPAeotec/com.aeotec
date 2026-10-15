'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class AeotecGarageControllerDevice extends ZwaveDevice {

  onNodeInit() {
	  
	   this.enableDebug();
     this.printNode();
 //   this.registerCapability('locked', 'BARRIER_OPERATOR', {
 //     get: 'BARRIER_OPERATOR_GET',
 //     report: 'BARRIER_OPERATOR_REPORT',
 //     reportParser: report => {
 //       if (typeof (report['State']) !== 'undefined') {
 //         const result = report.State === 'Closed';

 //         if (this.getSetting('flipped')) return !result;
 //         return result;
 //       }
 //       return null;
 //     },
 //     set: 'BARRIER_OPERATOR_SET',
 //     setParser: input => {
 //       if (this.getSetting('flipped')) {
 //         input = !input;
 //       }

 //       const result = {
 //         'Target Value': (input) ? 'CLOSE' : 'OPEN',
 //       };

 //       return result;
 //     },
 //   });
	
	this.registerCapability('locked', 'BARRIER_OPERATOR', {
	  get: 'BARRIER_OPERATOR_GET',
	  report: 'BARRIER_OPERATOR_REPORT',
	  reportParser: report => {
		// Prüfen, ob 'State' im Report definiert ist
		if (typeof report['State'] !== 'undefined') {
		  const isClosed = report['State'] === 'Closed';

		  // Prüfen, ob die Einstellung 'flipped' aktiviert ist und das Ergebnis entsprechend umkehren
		  return this.getSetting('flipped') ? !isClosed : isClosed;
		}
		// Wenn 'State' nicht im Report definiert ist, wird null zurückgegeben
		return null;
	  },
	  set: 'BARRIER_OPERATOR_SET',
	  setParser: input => {
		// Prüfen, ob die Einstellung 'flipped' aktiviert ist und den Eingabewert entsprechend umkehren
		if (this.getSetting('flipped')) {
		  input = !input;
		}

		// Erstellen des Ergebnisobjekts basierend auf dem Eingabewert
		const targetValue = input ? 'CLOSE' : 'OPEN';
		return { 'Target Value': targetValue };
	  },
	});
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    try {
		super.onSettings({ oldSettings, newSettings, changedKeys });

		if (changedKeys.includes('371')
				|| changedKeys.includes('372')
				|| changedKeys.includes('373')
				|| changedKeys.includes('374')) {
		  await this._setAlarmConfiguration(37, 4, [newSettings['371'], newSettings['372'], newSettings['373'], newSettings['374']]);
		}

		if (changedKeys.includes('381')
				|| changedKeys.includes('382')
				|| changedKeys.includes('383')
				|| changedKeys.includes('384')) {
		  await this._setAlarmConfiguration(38, 4, [newSettings['381'], newSettings['382'], newSettings['383'], newSettings['384']]);
		}

		if (changedKeys.includes('391')
				|| changedKeys.includes('392')
				|| changedKeys.includes('393')
				|| changedKeys.includes('394')) {
		  await this._setAlarmConfiguration(39, 4, [newSettings['391'], newSettings['392'], newSettings['393'], newSettings['394']]);
		}

		if (changedKeys.includes('401')
				|| changedKeys.includes('402')
				|| changedKeys.includes('403')
				|| changedKeys.includes('404')) {
		  await this._setAlarmConfiguration(40, 4, [newSettings['401'], newSettings['402'], newSettings['403'], newSettings['404']]);
		}
	} catch (error) {
    // Hier können Sie den Fehler behandeln oder protokollieren
    console.error('Error occurred in onSettings:', error);
    } 
  }

async _setAlarmConfiguration(parameter, size, values) {
  try {
    this.log('Parameter:', parameter, 'Size:', size, 'Values:', values);

    if (values.length !== 4) {
      throw new Error('Invalid values length. Expected length: 4');
    }

    return this.configurationSet({
      index: parameter,
      size,
    }, Buffer.from(values));
  } catch (error) {
    // Hier können Sie den Fehler behandeln oder protokollieren
    console.error('Error occurred in _setAlarmConfiguration:', error);
    return null; // oder eine geeignete Fehlerbehandlung
  }
}

//  async _setAlarmConfiguration(parameter, size, values) {
//    this.log('Parameter:', parameter, 'Size:', size, 'Values:', values);

//    if (values.length !== 4) return null;

//    return this.configurationSet({
//      index: parameter,
//      size,
//    }, Buffer.from(values));
//  }

}

module.exports = AeotecGarageControllerDevice;
