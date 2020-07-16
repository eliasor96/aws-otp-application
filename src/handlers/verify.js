const AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' });

const sentPasswordsTable = process.env.SENT_PASSWORDS_TABLE;

const getLastPassword = async (number) => {
    var getPrams = {
        TableName: sentPasswordsTable,
        Key: {
            'PHONE': number
        }
    };
    const result = await ddb.get(getPrams).promise();
    if (result.Item && result.Item.EXPIRATION_TIME < Math.round(new Date().getTime() / 1000)) {
        return null;
    }
    return result.Item.OTP;
};

exports.handler = async (event) => {
    if (!event.number) throw Error('No number provided');
    if (!event.otp) throw Error('No otp to verify provided');
    const lastOtp = await getLastPassword(event.number);
    return lastOtp && lastOtp === event.otp;
};