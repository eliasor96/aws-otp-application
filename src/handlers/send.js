const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' });
const sns = new AWS.SNS({ region: 'us-east-1' });

const sentPasswordsTable = process.env.SENT_PASSWORDS_TABLE;
const EXPIRATION_TIME_SECONDS = 60;

const generatePassword = () => {
    return (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
};

const logPassword = async (password, phone) => {
    const putPrams = {
        TableName: sentPasswordsTable,
        Item: {
            'PHONE': phone,
            'OTP': password,
            'EXPIRATION_TIME': Math.round(new Date().getTime() / 1000) + EXPIRATION_TIME_SECONDS
        }
    };
    await ddb.put(putPrams).promise();
};

exports.handler = async (event) => {
    if (!event.number) throw Error('No number provided');
    const otp = generatePassword();
    await logPassword(otp, event.number);
    await sns.publish({
        Message: otp,
        PhoneNumber: event.number,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                DataType: 'String',
                StringValue: process.env.SENDER_ID
            },
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional'
            }
        }
    }).promise();
    return otp;
};