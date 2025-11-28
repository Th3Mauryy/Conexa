import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

/**
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * For sandbox testing, use SandboxEnvironment. For production, use LiveEnvironment.
 */
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (process.env.PAYPAL_MODE === 'live') {
        return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    }
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

/**
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs.
 */
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export default client;
