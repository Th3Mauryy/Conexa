import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    // For Gmail, you might need to use an App Password if 2FA is enabled
    const transporter = nodemailer.default ? nodemailer.default.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }) : nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'Conexa Store'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
