const AWS = require("aws-sdk");

const config = require('../../config');

let dynamoClient;

const getDynamoClient = () => {
    if (!dynamoClient) {
        dynamoClient = new AWS.DynamoDB({ 
            region: config.AWS_REGION,
            ...( config.LOCALSTACK_URL ? { endpoint: config.LOCALSTACK_URL }: undefined )
        });
    }

    return dynamoClient;
}

module.exports = {
    getDynamoClient
};