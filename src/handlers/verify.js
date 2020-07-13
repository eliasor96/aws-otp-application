const AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' });

const sentPasswordsTable = process.env.SentPasswordsTable;

const getLastPassword = async (phone) => {
    var getPrams = {
        TableName: sentPasswordsTable,
        Key: {
            'PHONE': phone
        }
    };
    const result = await ddb.get(getPrams).promise();
    if (result.Item && result.Item.EXPIRATION_TIME < Math.round(new Date().getTime() / 1000)) {
        return null;
    }
    return result.Item;
};

exports.handler = async (event) => {
    if (!event.number) throw Error('No number provided');
    if (!event.otp) throw Error('No otp to verify provided');
    const lastOtp = await getLastPassword(event.phone);
    return lastOtp && lastOtp === event.otp;
};