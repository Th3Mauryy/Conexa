import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';

dotenv.config();

const testEmail = async () => {
    try {
        console.log('Testing email configuration...');
        console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');

        await sendEmail({
            email: 'maurymendoza021@gmail.com',
            subject: 'Test - Conexa Email',
            html: '<h1>Test Email</h1><p>Si recibes esto, el email funciona correctamente.</p>'
        });

        console.log('✅ Email sent successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error sending test email:');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

testEmail();
