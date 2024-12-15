# AquaCare Backend

A robust backend system for the AquaCare smart aquarium monitoring and control platform.

## Description
AquaCare Backend is the server component of the AquaCare system, providing APIs and real-time communication for aquarium monitoring devices. It handles device management, metric collection, alerts, and automated feeding schedules.

## Key Features
- Real-time metric monitoring via MQTT
- WebSocket integration for live updates
- JWT-based authentication
- Device management system
- Automated feeding scheduler
- Alert system with configurable thresholds
- Metric history tracking
- Device settings management

## Tech Stack
- Node.js
- Express.js
- Prisma (MySQL)
- MQTT
- WebSocket (Socket.io)
- JWT Authentication

## Prerequisites
- Node.js 14.x or higher
- MySQL database
- MQTT broker access
- npm or yarn package manager

## Installation
1. Clone the repository:
   ```bash
   git clone [repository URL]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/aquacare"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```
4. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the server:
   ```bash
   npm run start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Device Management
- `POST /api/devices/register` - Register new device
- `GET /api/devices/my-devices` - Get user's devices
- `POST /api/devices/:deviceId/control` - Send control commands

### Metrics
- `GET /api/devices/:deviceId/metrics/history` - Get metric history
- `GET /api/devices/:deviceId/alerts` - Get alert history

### Feeding System
- `POST /api/devices/:deviceId/feeding/schedule` - Create feeding schedule
- `GET /api/devices/:deviceId/feeding/schedule` - Get feeding schedules
- `POST /api/devices/:deviceId/feeding/trigger` - Trigger manual feeding
- `GET /api/devices/:deviceId/feeding/history` - Get feeding history

### Device Settings
- `GET /api/devices/:deviceId/settings` - Get device settings
- `PUT /api/devices/:deviceId/settings` - Update device settings

## Real-time Features
- Live metric updates via WebSocket
- Real-time alerts
- Instant feeding confirmations

## Database Schema
- **Users:** Authentication and profile
- **Devices:** Device management
- **Metrics:** Sensor data
- **FeedingSchedule:** Automated feeding
- **FeedingHistory:** Feeding records
- **DeviceSettings:** Configuration
- **Alerts:** System alerts

## Security Features
- JWT-based authentication
- Request validation
- Device ownership verification
- Password hashing
- Protected routes

## Error Handling
- Comprehensive error messages
- HTTP status codes
- Validation error responses
- Error logging

## Testing
Run tests with:
```bash
npm run test
```

## Contributing
1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## Author
- Ananda Ayu Putri
- Bintang Timurlangit
- Raqqat Amarasangga Iswahyudi

## Acknowledgments
- Express.js team
- Prisma team
- MQTT.js contributors
- Socket.io team
