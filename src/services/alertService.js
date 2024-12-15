const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ALERT_THRESHOLDS, ALERT_MESSAGES } = require('../utils/constants');

class AlertService {
    async checkMetrics(metrics, deviceId, deviceSettings = null) {
        const alerts = [];
        
        // Use device settings if available, otherwise use default thresholds
        const settings = deviceSettings || {
            phMin: ALERT_THRESHOLDS.ph_level.min,
            phMax: ALERT_THRESHOLDS.ph_level.max,
            tempMin: ALERT_THRESHOLDS.temperature.min,
            tempMax: ALERT_THRESHOLDS.temperature.max,
            waterLevelMin: ALERT_THRESHOLDS.water_level.min
        };

        // Check pH level
        if (metrics.ph_level < settings.phMin || metrics.ph_level > settings.phMax) {
            const alert = {
                type: 'warning',
                metric: 'ph_level',
                message: metrics.ph_level < settings.phMin ? 
                    ALERT_MESSAGES.ph_level.low : ALERT_MESSAGES.ph_level.high,
                value: metrics.ph_level,
                deviceId
            };
            alerts.push(alert);
            await this.saveAlert(alert);
        }

        // Check temperature
        if (metrics.temperature < settings.tempMin || metrics.temperature > settings.tempMax) {
            const alert = {
                type: 'warning',
                metric: 'temperature',
                message: metrics.temperature < settings.tempMin ? 
                    ALERT_MESSAGES.temperature.low : ALERT_MESSAGES.temperature.high,
                value: metrics.temperature,
                deviceId
            };
            alerts.push(alert);
            await this.saveAlert(alert);
        }

        // Check water level
        if (metrics.water_level < settings.waterLevelMin) {
            const alert = {
                type: 'warning',
                metric: 'water_level',
                message: ALERT_MESSAGES.water_level.low,
                value: metrics.water_level,
                deviceId
            };
            alerts.push(alert);
            await this.saveAlert(alert);
        }

        return alerts;
    }

    async saveAlert(alertData) {
        try {
            await prisma.alert.create({
                data: {
                    deviceId: alertData.deviceId,
                    type: alertData.type,
                    message: alertData.message,
                    metric: alertData.metric,
                    value: alertData.value
                }
            });
            console.log(`Alert saved for device ${alertData.deviceId}`);
        } catch (error) {
            console.error('Error saving alert:', error);
        }
    }
}

module.exports = new AlertService();