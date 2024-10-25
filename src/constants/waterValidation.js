export const WATER_PARAMETERS = {
  temperature: {
    min: 5,
    max: 26,
    unit: '°C',
    errorMessage: 'Temperature should be between 5°C and 26°C'
  },
  dissolvedOxygen: {
    min: 6.5,
    max: 12,
    unit: 'mg/L',
    errorMessage: 'Dissolved oxygen should be between 6.5 and 12 mg/L'
  },
  pH: {
    min: 6.9,
    max: 8.0,
    unit: '',
    errorMessage: 'pH should be between 6.9 and 8.0'
  },
  hardness: {
    min: 0,
    max: 21,
    unit: 'dGH',
    errorMessage: 'Hardness should be between 0 and 21 dGH'
  },
  ammonia: {
    min: 0,
    max: 0.1,
    unit: 'mg/L',
    errorMessage: 'Ammonia should be between 0 and 0.1 mg/L'
  },
  nitrite: {
    min: 0,
    max: 0.1,
    unit: 'mg/L',
    errorMessage: 'Nitrite should be between 0 and 0.1 mg/L'
  },
  nitrate: {
    min: 0,
    max: 20,
    unit: 'mg/L',
    errorMessage: 'Nitrate should be between 0 and 20 mg/L'
  },
  carbonate: {
    min: 0,
    max: 180,
    unit: 'mg/L',
    errorMessage: 'Carbonate should be between 0 and 180 mg/L'
  },
  salt: {
    min: 0,
    max: 0.5,
    unit: '%',
    errorMessage: 'Salt should be between 0 and 0.5%'
  },
  carbonDioxide: {
    min: 0,
    max: 40,
    unit: 'mg/L',
    errorMessage: 'Carbon dioxide should be between 0 and 40 mg/L'
  }
};
