const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load models
const User = require('./schemas/users');
const Role = require('./schemas/roles');

// 1. Array of users to import
const usersData = `
user01	user01@haha.com
user02	user02@haha.com
user03	user03@haha.com
user04	user04@haha.com
user05	user05@haha.com
user06	user06@haha.com
user07	user07@haha.com
user08	user08@haha.com
user09	user09@haha.com
user10	user10@haha.com
user11	user11@haha.com
user12	user12@haha.com
user13	user13@haha.com
user14	user14@haha.com
user15	user15@haha.com
user16	user16@haha.com
user17	user17@haha.com
user18	user18@haha.com
user19	user19@haha.com
user20	user20@haha.com
user21	user21@haha.com
user22	user22@haha.com
user23	user23@haha.com
user24	user24@haha.com
user25	user25@haha.com
user26	user26@haha.com
user27	user27@haha.com
user28	user28@haha.com
user29	user29@haha.com
user30	user30@haha.com
user31	user31@haha.com
user32	user32@haha.com
user33	user33@haha.com
user34	user34@haha.com
user35	user35@haha.com
user36	user36@haha.com
user37	user37@haha.com
user38	user38@haha.com
user39	user39@haha.com
user40	user40@haha.com
user41	user41@haha.com
user42	user42@haha.com
user43	user43@haha.com
user44	user44@haha.com
user45	user45@haha.com
user46	user46@haha.com
user47	user47@haha.com
user48	user48@haha.com
user49	user49@haha.com
user50	user50@haha.com
user51	user51@haha.com
user52	user52@haha.com
user53	user53@haha.com
user54	user54@haha.com
user55	user55@haha.com
user56	user56@haha.com
user57	user57@haha.com
user58	user58@haha.com
user59	user59@haha.com
user60	user60@haha.com
user61	user61@haha.com
user62	user62@haha.com
user63	user63@haha.com
user64	user64@haha.com
user65	user65@haha.com
user66	user66@haha.com
user67	user67@haha.com
user68	user68@haha.com
user69	user69@haha.com
user70	user70@haha.com
user71	user71@haha.com
user72	user72@haha.com
user73	user73@haha.com
user74	user74@haha.com
user75	user75@haha.com
user76	user76@haha.com
user77	user77@haha.com
user78	user78@haha.com
user79	user79@haha.com
user80	user80@haha.com
user81	user81@haha.com
user82	user82@haha.com
user83	user83@haha.com
user84	user84@haha.com
user85	user85@haha.com
user86	user86@haha.com
user87	user87@haha.com
user88	user88@haha.com
user89	user89@haha.com
user90	user90@haha.com
user91	user91@haha.com
user92	user92@haha.com
user93	user93@haha.com
user94	user94@haha.com
user95	user95@haha.com
user96	user96@haha.com
user97	user97@haha.com
user98	user98@haha.com
user99	user99@haha.com
`.trim().split('\n').map(line => {
    const [username, email] = line.split('\t');
    return { username, email };
});

// 2. Setup Mailtrap Transporter
// THAY USER VÀ PASS CỦA BẠN VÀO ĐÂY / REPLACE YOUR USER AND PASS HERE
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    auth: {
        user: "YOUR_MAILTRAP_USER",
        pass: "YOUR_MAILTRAP_PASS"
    }
});

function generateRandomPassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function importUsers() {
    try {
        // Connect to Database
        await mongoose.connect('mongodb://localhost:27017/NNPTUD-S3');
        console.log("Connected to MongoDB successfully.");

        // Get or Create the 'user' role
        let roleUser = await Role.findOne({ name: 'user' });
        if (!roleUser) {
            roleUser = new Role({ name: 'user', description: 'Regular User Role' });
            await roleUser.save();
            console.log("Created 'user' role.");
        }

        for (const data of usersData) {
            // Check if user already exists
            const existingUser = await User.findOne({ username: data.username });
            if (existingUser) {
                console.log(`User ${data.username} already exists, skipping...`);
                continue;
            }

            // Generate password
            const randomPassword = generateRandomPassword(16);

            // Create new user (password is hashed automatically by pre-save hook in userSchema)
            const newUser = new User({
                username: data.username,
                email: data.email,
                password: randomPassword,
                role: roleUser._id,
                status: true
            });

            await newUser.save();
            
            // Send Email
            const mailOptions = {
                from: '"Admin" <admin@haha.com>',
                to: data.email,
                subject: 'Welcome! Here is your account password',
                text: `Hello ${data.username},\n\nYour account has been created.\nYour password is: ${randomPassword}\n\nPlease keep it safe.`,
                html: `<p>Hello <b>${data.username}</b>,</p><p>Your account has been created.</p><p>Your password is: <b>${randomPassword}</b></p><p>Please keep it safe.</p>`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Created user ${data.username} and sent email to ${data.email}`);
        }

        console.log("Finished importing all users!");

    } catch (error) {
        console.error("An error occurred during import:", error);
    } finally {
        mongoose.connection.close();
    }
}

importUsers();
