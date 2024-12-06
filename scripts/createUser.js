const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createUser(username, password) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                created_at: new Date(),
            },
        });

        console.log('User created successfully:', {
            id: user.id,
            username: user.username,
            created_at: user.created_at
        });

    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

// Example usage:
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log('Usage: node createUser.js <username> <password>');
    process.exit(1);
}

createUser(username, password); 