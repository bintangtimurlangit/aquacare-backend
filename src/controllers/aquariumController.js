const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register User
exports.registerUser = async (req, res) => {
    console.log("Registering user:", req.body); // Log the request body

    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                created_at: new Date(),
            },
        });

        res.status(201).json({ message: 'User registered successfully', user_id: newUser.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    console.log("Logging in user:", req.body); // Log the request body

    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await prisma.users.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({ message: 'Login successful', user_id: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Device Status
exports.getDeviceStatus = async (req, res) => {
    const { device_id } = req.params;

    try {
        const device = await prisma.devices.findUnique({
            where: { id: parseInt(device_id) },
            include: {
                sensor_logs: true, // Ensure the relationship name matches your model definition
                schedules: true,
                event_logs: true,
            }
        });

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const temperature = device.sensor_logs.find(log => log.type === 'temp')?.value || null;
        const pH = device.sensor_logs.find(log => log.type === 'ph')?.value || null;
        const waterLevel = device.sensor_logs.find(log => log.type === 'water')?.value || null;

        res.json({
            device_id,
            status: {
                temperature,
                pH,
                water_level: waterLevel,
                feeding_schedule: device.schedules.map(sch => `${sch.day} ${sch.time}`).join(', '),
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Set temperature
exports.setTemperature = async (req, res) => {
    const { device_id } = req.params;
    const { target_temperature } = req.body;

    console.log('Request body:', req.body); // Add this to see what Postman sends
    console.log('Target temperature:', target_temperature); // Add this to see if target_temperature is extracted correctly

    try {
        const existingSetting = await prisma.settings.findFirst({
            where: {
                device_id: parseInt(device_id),
                name: 'temperature',
            },
        });

        if (existingSetting) {
            await prisma.settings.update({
                where: { id: existingSetting.id },
                data: { value: target_temperature },
            });
        } else {
            await prisma.settings.create({
                data: {
                    device_id: parseInt(device_id),
                    name: 'temperature',
                    value: target_temperature,
                },
            });
        }

        await prisma.event_logs.create({
            data: {
                device_id: parseInt(device_id),
                event: 'Temperature Set',
                description: `Target temperature has been set to ${target_temperature}°C`,
                triggered_at: new Date(),
            },
        });

        res.json({ message: 'Temperature set successfully', target_temperature });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Monitor Temperature
exports.monitorTemperature = async (req, res) => {
    const { device_id } = req.params;

    try {
        const temperatureLog = await prisma.sensor_logs.findFirst({
            where: {
                device_id: parseInt(device_id),
                type: 'temp'
            },
            orderBy: { date: 'desc' }
        });

        if (!temperatureLog) {
            return res.status(404).json({ error: 'Temperature log not found' });
        }

        res.json({ current_temperature: temperatureLog.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Automatic Temperature Control
exports.automaticTemperatureControl = async (req, res) => {
    const { device_id } = req.params;
    const { min_temp, max_temp } = req.body;

    try {
        res.json({
            message: 'Automatic temperature control enabled',
            min_temp,
            max_temp,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adjust pH
exports.adjustPH = async (req, res) => {
    const { device_id } = req.params;
    const { adjustment_amount } = req.body;

    try {
        const newPH = adjustment_amount; // Placeholder for actual pH adjustment logic
        res.json({
            message: 'pH adjusted',
            new_ph: newPH,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Monitor pH
exports.monitorPH = async (req, res) => {
    const { device_id } = req.params;

    try {
        const phLog = await prisma.sensor_logs.findFirst({
            where: {
                device_id: parseInt(device_id),
                type: 'ph'
            },
            orderBy: { date: 'desc' }
        });

        if (!phLog) {
            return res.status(404).json({ error: 'pH log not found' });
        }

        res.json({ current_ph: phLog.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Automatic pH Control
exports.automaticPHControl = async (req, res) => {
    const { device_id } = req.params;
    const { min_ph, max_ph } = req.body;

    try {
        res.json({
            message: 'Automatic pH control enabled',
            min_ph,
            max_ph,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Refill Water
exports.refillWater = async (req, res) => {
    const { device_id } = req.params;

    try {
        const newWaterLevel = 100; // Placeholder for actual water level
        res.json({
            message: 'Water refilled',
            new_water_level: newWaterLevel,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Monitor Water Level
exports.monitorWaterLevel = async (req, res) => {
    const { device_id } = req.params;

    try {
        const waterLog = await prisma.sensor_logs.findFirst({
            where: {
                device_id: parseInt(device_id),
                type: 'water'
            },
            orderBy: { date: 'desc' }
        });

        if (!waterLog) {
            return res.status(404).json({ error: 'Water log not found' });
        }

        res.json({ current_water_level: waterLog.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Automatic Water Refill
exports.automaticWaterRefill = async (req, res) => {
    const { device_id } = req.params;
    const { min_water_level } = req.body;

    try {
        res.json({
            message: 'Automatic water refill enabled',
            min_water_level,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Schedule Feeding
exports.scheduleFeeding = async (req, res) => {
    const { device_id } = req.params;
    const { feeding_time, repeat_interval } = req.body;

    try {
        await prisma.schedules.create({
            data: {
                device_id: parseInt(device_id),
                action: 'feed',
                day: 'everyday',
                time: feeding_time,
            },
        });

        res.json({ message: 'Feeding schedule set', feeding_time, repeat_interval });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Manual Feed Fish
exports.manualFeedFish = async (req, res) => {
    const { device_id } = req.params;

    try {
        const timeFed = new Date().toLocaleTimeString(); // Placeholder for feeding time
        res.json({ message: 'Fish fed manually', time_fed: timeFed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Automatic Feeding
exports.automaticFeeding = async (req, res) => {
    const { device_id } = req.params;
    const { feeding_time, repeat_interval } = req.body;

    try {
        res.json({
            message: 'Automatic feeding enabled',
            feeding_time,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Set Monitoring Interval
exports.setMonitoringInterval = async (req, res) => {
    const { device_id } = req.params;
    const { interval_minutes } = req.body;

    try {
        res.json({
            message: 'Monitoring interval set',
            interval_minutes,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Monitoring Interval
exports.getMonitoringInterval = async (req, res) => {
    const { device_id } = req.params;

    try {
        const intervalMinutes = 5; // Placeholder for actual interval
        res.json({ interval_minutes: intervalMinutes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Devices
exports.getAllDevices = async (req, res) => {
    const { user_id } = req.query;

    try {
        const devices = await prisma.devices.findMany({
            where: { user_id: parseInt(user_id) },
        });

        res.json({ devices });
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add New Device
exports.addNewDevice = async (req, res) => {
    const { device_name, location } = req.body;

    try {
        const newDevice = await prisma.devices.create({
            data: {
                token: device_name,
                user_id: 1, // Placeholder for actual userId
            }
        });

        res.json({ message: 'Device added successfully', device_id: newDevice.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove Device
exports.removeDevice = async (req, res) => {
    const { device_id } = req.params;

    try {
        await prisma.devices.delete({
            where: { id: parseInt(device_id) },
        });

        res.json({ message: 'Device removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Log Event
exports.logEvent = async (req, res) => {
    const { device_id } = req.params;
    const { event_type, details } = req.body;

    try {
        const log = await prisma.event_logs.create({
            data: {
                device_id: parseInt(device_id),
                event: event_type,
                description: details,
                triggered_at: new Date(),
            }
        });

        res.json({ message: 'Event logged successfully', log_id: log.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Logs
exports.getLogs = async (req, res) => {
    const { device_id } = req.params;
    const { from_date, to_date } = req.query;

    try {
        const logs = await prisma.event_logs.findMany({
            where: {
                device_id: parseInt(device_id),
                triggered_at: {
                    gte: new Date(from_date),
                    lte: new Date(to_date),
                },
            },
            orderBy: { triggered_at: 'desc' },
        });

        res.json({ logs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Log by ID
exports.getLogById = async (req, res) => {
    const { log_id } = req.params;

    try {
        const log = await prisma.event_logs.findUnique({
            where: { id: parseInt(log_id) },
        });

        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }

        res.json({
            log_id: log.id,
            event_type: log.event,
            details: log.description,
            timestamp: log.triggered_at,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
