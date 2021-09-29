const { getSqsClient } = require('../modules/sqs');
const { getDynamoClient } = require('../modules/dynamodb');
const { getSnsClient } = require('../modules/sns');
const { getS3Client } = require('../modules/s3');

const { 
    generateShortUuid,
    delay,
} = require('../utils');

const { APP_REQUEST_ITEM_STATUS } = require('../constants');

const config = require('../config');

const addAppRequest = async (requestId, status) => {
    
    const dynamodbClient = await getDynamoClient();
    
    const id = generateShortUuid();
    
    await (dynamodbClient.putItem({
        TableName: config.APP_REQUESTS_TABLE_NAME,
        Item: {
            id: { S: id },
            requestId: { S: `${requestId}` },
            timestamp: { S: `${new Date().getTime()}` },
            status: { S: `${status}` },
        }
    }).promise());
}

const sendAppRequestNotification = async (requestId) => {
    
    const snsClient = await getSnsClient();
    
    await (snsClient.publish({
        Message: JSON.stringify({ requestId }),
        TopicArn: config.REQUEST_TOPIC_ARN,
    }).promise());
}

const startNewRequest = async () => {
    
    const sqsClient = await getSqsClient();
    
    const requestId = generateShortUuid();
    
    const params = {
        MessageBody: JSON.stringify({ requestId }),
        QueueUrl: config.REQUEST_QUEUE_URL, 
    };
    
    await (sqsClient.sendMessage(params).promise());
    
    const status = APP_REQUEST_ITEM_STATUS.QUEUED;
    
    await addAppRequest(requestId, status);
    
    return {
        requestId,
        status,
    }
}

const listRequestsByRequestId = async ({ pathParameters }) => {
    
    const { requestId } = pathParameters;
    
    if (!requestId) {
        return;
    }
    
    const dynamodbClient = await getDynamoClient();
    
    const params = {
        FilterExpression: '#requestId = :requestId',
        ExpressionAttributeNames: {
            '#requestId': 'requestId',
        },
        ExpressionAttributeValues: {
            ':requestId': {
                S: `${requestId}`
            },
        },
        TableName: config.APP_REQUESTS_TABLE_NAME,
    };
    
    const result = await (dynamodbClient.scan(params).promise());
    
    const items = result['Items'].map((x) => {
        Object.keys(x).forEach((attr) => {
            if ('N' in x[attr]) x[attr] = parseFloat(x[attr].N);
            else if ('S' in x[attr]) x[attr] = x[attr].S;
            else x[attr] = x[attr][Object.keys(x[attr])[0]];
        });
        return x;
    });
    
    return items;
}

const processRequest = async (requestId) => {
    
    await delay(5000);
    await sendAppRequestNotification(requestId);
    await delay(4000);
    
    await addAppRequest(requestId, APP_REQUEST_ITEM_STATUS.PROCESSING)
}

const archiveRequest = async (requestId) => {
    
    const s3Client = await getS3Client();
    
    const params = {
        Bucket: config.ARCHIVE_BUCKET_NAME,
        Key: `/result.txt${requestId}`,
        Body: JSON.stringify({
            content: `Archive result for request ${requestId}`
        }),
        ContentType: "application/json"
    };
    
    await (s3Client.putObject(params).promise());
    
    await delay(3000);
    await addAppRequest(requestId, APP_REQUEST_ITEM_STATUS.FINISHED);
}

module.exports = {
    startNewRequest,
    listRequestsByRequestId,
    processRequest,
    archiveRequest,
}

