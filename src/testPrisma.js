// src/testPrisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        const devices = await prisma.devices.findMany(); // Ensure correct model name
        console.log(devices);
    } catch (error) {
        console.error("Error connecting to database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
