const AWS = require('aws-sdk');

const config = require('../../config');

let snsClient;

const getSnsClient = () => {
    if (!snsClient) {
        snsClient = new AWS.SNS({ 
            region: config.AWS_REGION,
            ...( config.LOCALSTACK_URL ? { endpoint: config.LOCALSTACK_URL }: undefined )
        });
    }
    
    return snsClient;
}

module.exports = {
    getSnsClient
};