const factorProperties = {
  acVoltageFactor: {
    value: 'rmsVoltage', multiplier: 'acVoltageMultiplier', divisor: 'acVoltageDivisor',
  },
  acCurrentFactor: {
    value: 'rmsCurrent', multiplier: 'acCurrentMultiplier', divisor: 'acCurrentDivisor',
  },
  activePowerFactor: {
    value: 'activePower', multiplier: 'acPowerMultiplier', divisor: 'acPowerDivisor',
  },
  meteringFactor: {
    value: 'currentSummationDelivered', multiplier: 'multiplier', divisor: 'divisor',
  },
};

async function initFactorImplementation(
  device,
  zclNode,
  storeProperty,
  capability,
  clusterSpec,
  endpointId,
) {
  // Restore factor from store
  await updateDeviceFactor(device, storeProperty)
    .catch(e => device.error(`Failed to restore ${storeProperty}`, e));

  const endpoint = endpointId ?? device.getClusterEndpoint(clusterSpec) ?? 1;
  const cluster = zclNode
    .endpoints[endpoint]
    .clusters[clusterSpec.NAME];

  const reportParser = function (value) {
    if (value < 0) {
      return null;
    }

    return value * (device[storeProperty] ?? 1);
  };

  const properties = factorProperties[storeProperty];

  // Retrieve initial values
  await cluster
    .readAttributes(properties.value, properties.multiplier, properties.divisor)
    .then(async (result) => {
      await updateDeviceFactor(device, storeProperty, result[properties.multiplier], result[properties.divisor]);
      await device
        .setCapabilityValue(capability, reportParser(result[properties.value]))
        .catch(e => device.error(`Failed to set ${capability} capability value`, e));
    })
    .catch(e => device.error(`Failed to read ${clusterSpec.NAME} ${Object.values(properties)} attributes`, e));

  // Register listener for incoming report
  cluster.on('attr.' + properties.multiplier, (value) => {
    console.log(properties.multiplier + ' attribute report received', value);
    updateDeviceFactor(device, storeProperty, value);
  });
  cluster.on('attr.' + properties.divisor, (value) => {
    console.log(properties.divisor + ' attribute report received', value);
    updateDeviceFactor(device, storeProperty, undefined, value);
  });

  // Configure the capability
  device.registerCapability(capability, clusterSpec, {
    endpoint,
    getOpts: {
      getOnStart: false,
    },
    reportOpts: {
      configureAttributeReporting: {
        minInterval: 10,
        maxInterval: 3600,
        minChange: 1,
      },
    },
    reportParser,
  });
}

async function updateDeviceFactor(
  device,
  storeProperty,
  multiplier,
  divisor,
) {
  device.log(`Handling new ${storeProperty}`, multiplier, divisor);

  const multiplierKey = storeProperty + '_multiplier';
  const divisorKey = storeProperty + '_divisor';

  if (multiplier) {
    await device.setStoreValue(multiplierKey, multiplier)
      .catch(e => device.error('Failed to store ' + multiplierKey, e));
  } else {
    multiplier = device.getStoreValue(multiplierKey);
  }

  if (divisor) {
    await device.setStoreValue(divisorKey, divisor)
      .catch(e => device.error('Failed to store ' + divisorKey, e));
  } else {
    divisor = device.getStoreValue(divisorKey);
  }

  device[storeProperty] = (multiplier ?? 1) / (divisor ?? 1);
  device.log(`New active ${storeProperty}`, device[storeProperty]);
}

module.exports = initFactorImplementation;
