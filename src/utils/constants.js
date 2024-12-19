const ALERT_THRESHOLDS = {
  ph_level: {
    min: 6.5,
    max: 7.5,
    criticalMin: 6.0,
    criticalMax: 8.0,
  },
  temperature: {
    min: 24,
    max: 28,
    criticalMin: 20,
    criticalMax: 32,
  },
  water_level: {
    min: 80, // percentage
    critical: 70,
  },
};

const ALERT_MESSAGES = {
  ph_level: {
    high: 'pH level is too high',
    low: 'pH level is too low',
    critical: 'pH level is at critical levels!',
  },
  temperature: {
    high: 'Temperature is too high',
    low: 'Temperature is too low',
    critical: 'Temperature is at dangerous levels!',
  },
  water_level: {
    low: 'Water level is low',
    critical: 'Water level critically low!',
  },
};

module.exports = {
  ALERT_THRESHOLDS,
  ALERT_MESSAGES,
};
