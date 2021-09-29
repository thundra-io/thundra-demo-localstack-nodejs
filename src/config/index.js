const URL = require('url');

const getUrl = (url) => {

    const localstackHostname = process.env.LOCALSTACK_HOSTNAME;
    if (localstackHostname) {

        url = url.replace(new URL.URL(url).hostname, process.env.LOCALSTACK_HOSTNAME);
    }

    return url;
}

const config = {
    AWS_REGION: process.env.AWS_REGION,
    REQUEST_QUEUE_URL: getUrl(process.env.REQUEST_QUEUE_URL),
    LOCALSTACK_URL: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566`: undefined,
    APP_REQUESTS_TABLE_NAME: process.env.APP_REQUESTS_TABLE_NAME,
    REQUEST_TOPIC_ARN: process.env.REQUEST_TOPIC_ARN,
    ARCHIVE_BUCKET_NAME: process.env.ARCHIVE_BUCKET_NAME,
}

module.exports = config;