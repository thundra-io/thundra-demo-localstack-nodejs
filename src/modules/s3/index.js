const AWS = require('aws-sdk');

const config = require('../../config');

let s3client;

const getS3Client = () => {
    if (!s3client){
        s3client = new AWS.S3({
            region: config.AWS_REGION,
            ...( config.LOCALSTACK_URL ? { endpoint: config.LOCALSTACK_URL }: undefined ),
            s3ForcePathStyle: true,
        });
    }
    
    return s3client;
}

module.exports = {
    getS3Client,
}

