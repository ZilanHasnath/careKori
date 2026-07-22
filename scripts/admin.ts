import dbConnect from '../lib/db';
import Admin from '../lib/models/Admin';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        await dbConnect();

        const hashedPassword = await bcrypt.hash('123456789', 12);

        const existing = await Admin.findOne({ email: 'zilan@gmail.com' });
        if (existing) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const admin = await Admin.create({
            name: 'zilan',
            email: 'zilan@gmail.com',
            password: hashedPassword,
            role: 'superadmin',
        });

        console.log('Admin created successfully:', admin);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();