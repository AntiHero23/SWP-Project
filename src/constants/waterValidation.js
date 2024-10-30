import api from "../config/axios";

let WATER_PARAMETERS = {
  temperature: {
    min: 0,
    max: 0,
    unit: '°C',
    errorMessage: 'Temperature standards not set'
  },
  oxygen: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Oxygen standards not set'
  },
  pH: {
    min: 0,
    max: 0,
    unit: '',
    errorMessage: 'pH standards not set'
  },
  hardness: {
    min: 0,
    max: 0,
    unit: 'dGH',
    errorMessage: 'Hardness standards not set'
  },
  ammonia: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Ammonia standards not set'
  },
  nitrite: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Nitrite standards not set'
  },
  nitrate: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Nitrate standards not set'
  },
  carbonate: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Carbonate standards not set'
  },
  salt: {
    min: 0,
    max: 0,
    unit: '%',
    errorMessage: 'Salt standards not set'
  },
  carbonDioxide: {
    min: 0,
    max: 0,
    unit: 'mg/L',
    errorMessage: 'Carbon dioxide standards not set'
  }
};

const fetchWaterParameters = async () => {
  try {
    const response = await api.get("admin/viewall/waterstandard");
    if (response.data.code === 1000 && response.data.result.length > 0) {
      const standards = response.data.result[0];
      WATER_PARAMETERS = {
        temperature: {
          min: standards.minTempStandard,
          max: standards.maxTempStandard,
          unit: '°C',
          errorMessage: `Temperature should be between ${standards.minTempStandard}°C and ${standards.maxTempStandard}°C`
        },
        oxygen: {
          min: standards.minOxygenStandard,
          max: standards.maxOxygenStandard,
          unit: 'mg/L',
          errorMessage: `Oxygen should be between ${standards.minOxygenStandard} and ${standards.maxOxygenStandard} mg/L`
        },
        pH: {
          min: standards.min_pH_Standard,
          max: standards.max_pH_Standard,
          unit: '',
          errorMessage: `pH should be between ${standards.min_pH_Standard} and ${standards.max_pH_Standard}`
        },
        hardness: {
          min: standards.minHardnessStandard,
          max: standards.maxHardnessStandard,
          unit: 'dGH',
          errorMessage: `Hardness should be between ${standards.minHardnessStandard} and ${standards.maxHardnessStandard} dGH`
        },
        ammonia: {
          min: standards.minAmmoniaStandard,
          max: standards.maxAmmoniaStandard,
          unit: 'mg/L',
          errorMessage: `Ammonia should be between ${standards.minAmmoniaStandard} and ${standards.maxAmmoniaStandard} mg/L`
        },
        nitrite: {
          min: standards.minNitriteStandard,
          max: standards.maxNitriteStandard,
          unit: 'mg/L',
          errorMessage: `Nitrite should be between ${standards.minNitriteStandard} and ${standards.maxNitriteStandard} mg/L`
        },
        nitrate: {
          min: standards.minNitrateStandard,
          max: standards.maxNitrateStandard,
          unit: 'mg/L',
          errorMessage: `Nitrate should be between ${standards.minNitrateStandard} and ${standards.maxNitrateStandard} mg/L`
        },
        carbonate: {
          min: standards.minCarbonateStandard,
          max: standards.maxCarbonateStandard,
          unit: 'mg/L',
          errorMessage: `Carbonate should be between ${standards.minCarbonateStandard} and ${standards.maxCarbonateStandard} mg/L`
        },
        salt: {
          min: standards.minSaltStandard,
          max: standards.maxSaltStandard,
          unit: '%',
          errorMessage: `Salt should be between ${standards.minSaltStandard} and ${standards.maxSaltStandard}%`
        },
        carbonDioxide: {
          min: standards.minCarbonDioxideStandard,
          max: standards.maxCarbonDioxideStandard,
          unit: 'mg/L',
          errorMessage: `Carbon dioxide should be between ${standards.minCarbonDioxideStandard} and ${standards.maxCarbonDioxideStandard} mg/L`
        }
      };
    }
  } catch (error) {
    console.error('Error fetching water parameters:', error);
  }
  return WATER_PARAMETERS;
};

export { fetchWaterParameters };
