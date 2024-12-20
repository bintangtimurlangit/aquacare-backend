const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const DEFAULT_FEEDING_SCHEDULE = require('../config/defaultSchedule');

const prisma = new PrismaClient();

async function checkAndCreateDefaultSchedules() {
    try {
        // Get all devices
        const devices = await prisma.device.findMany({
            include: {
                feedingSchedule: true
            }
        });

        for (const device of devices) {
            // Check if device has any schedules
            if (device.feedingSchedule.length === 0) {
                console.log(`Creating default schedules for device: ${device.id}`);
                
                // Create default schedules using transaction
                await prisma.$transaction(
                    DEFAULT_FEEDING_SCHEDULE.map(schedule => 
                        prisma.feedingSchedule.create({
                            data: {
                                deviceId: device.id,
                                time: schedule.time,
                                days: schedule.days,
                                isActive: schedule.isActive
                            }
                        })
                    )
                );

                // Notify device via MQTT
                global.mqttClient.publish(
                    `device/${device.id}/feeding/schedule/update`,
                    JSON.stringify(DEFAULT_FEEDING_SCHEDULE)
                );
            }
        }
    } catch (error) {
        console.error('Error in schedule checker job:', error);
    }
}

// Run every day at midnight
cron.schedule('0 0 * * *', checkAndCreateDefaultSchedules);

// Also export for manual running
module.exports = checkAndCreateDefaultSchedules; 