import twilio from 'twilio';

/**
 * Send WhatsApp message using Twilio API
 * @param {string} to - Recipient phone number (with country code, e.g., +521234567890)
 * @param {string} message - Message content
 * @returns {Promise} - Twilio response
 */
const sendWhatsApp = async (to, message) => {
    try {
        // Initialize Twilio client
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        // Format phone number with whatsapp: prefix
        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        const formattedFrom = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

        // Send message
        const twilioMessage = await client.messages.create({
            from: formattedFrom,
            to: formattedTo,
            body: message
        });

        console.log(`WhatsApp sent to ${to}: ${twilioMessage.sid}`);
        return twilioMessage;

    } catch (error) {
        console.error('WhatsApp send error:', error.message);
        // Don't throw error, just log it - we don't want to fail the entire operation if WhatsApp fails
        return null;
    }
};

export default sendWhatsApp;
