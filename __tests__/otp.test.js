const sendHandler = require('./../src/handlers/send').handler;
const verifyHandler = require('./../src/handlers/verify').handler;

//number from https://fakenumber.org/
const sendEvent = {
    'number': '+12025550130'
};

const verifyEvent = {
    'number': '+12025550130',
    'otp': null
};

describe('Test OTP send and verify', () => {

    it('Verifies OTP sending', async () => {
        verifyEvent.otp = await sendHandler(sendEvent);
        expect(verifyEvent.otp).not.toBeNull();
    });

    it('Verifies OTP verification', async () => {
        const verified = await verifyHandler(verifyEvent);
        expect(verified).toEqual(true);
    });
});