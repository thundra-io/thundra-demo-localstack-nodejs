const urljoin = require('url-join');

const axios = require('axios');

const { executeCommand } = require('../src/utils');

const { APP_REQUEST_ITEM_STATUS } = require('../src/constants');

const { dynamoDbChaos } = require('./config/chaos');

describe('App Request E2E', function () {
    
    jest.setTimeout(300 * 1000);

    let apiGwUrl;

    beforeAll(async () => {

        await executeCommand(
            'make deploy',
            { 
                env: {
                    THUNDRA_DYNAMODB_CHAOS: JSON.stringify(dynamoDbChaos),
                    ...process.env
                }
            }
        );

        const resultRaw = await executeCommand('awslocal apigateway get-rest-apis');
        if (resultRaw && resultRaw.stdout){

            const result = JSON.parse(resultRaw.stdout);
            if (result && result.items) {
                
                const restApiId = result.items[0].id;
                apiGwUrl = `http://localhost:4566/restapis/${restApiId}/local/_user_request_`;
            }
        }
    });

    afterAll(async () => {
        await executeCommand('docker stop $(docker ps -a -q --filter ancestor=localstack/localstack --format=\"{{.ID}}\")');
    });

    it('Create Request E2E', async () => {
        
        const createRequestUrl = urljoin(apiGwUrl, 'requests');
        
        const createRequestResult = await axios.post(createRequestUrl, {});

        expect(createRequestResult).toBeTruthy();
        expect(createRequestResult.status).toBe(200);
        expect(createRequestResult.data).toBeTruthy();

        const {
            requestId,
            status,
        } = createRequestResult.data;

        expect(requestId).toBeTruthy();
        expect(status).toBe(APP_REQUEST_ITEM_STATUS.QUEUED);

        const getRequestUrl = urljoin(apiGwUrl, `request/${requestId}`);

        await expect().eventually(async () => {

            const getRequestResult = await axios.get(getRequestUrl);

            expect(getRequestResult).toBeTruthy();
            expect(getRequestResult.status).toBe(200);
            expect(getRequestResult.data).toBeTruthy()

            expect(getRequestResult.data.status).toEqual(APP_REQUEST_ITEM_STATUS.FINISHED);
        }, 
        30,
        5);

        expect(true).toBe(true);
    }); 
});