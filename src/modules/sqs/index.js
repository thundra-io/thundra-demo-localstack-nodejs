const AWS = require('aws-sdk');

const config = require('../../config');

let sqsClient;

const getSqsClient = () => {
    if (!sqsClient){
        sqsClient = new AWS.SQS({ 
            region: config.AWS_REGION,
            ...( config.LOCALSTACK_URL ? { endpoint: config.LOCALSTACK_URL }: undefined )
        });
    }
    
    return sqsClient;
 }
 
 module.exports = {
    getSqsClient,
 }