const { 
    startNewRequest,
    listRequestsByRequestId,
} = require('../service/app-request-service');

const headers = {
    'content-type': 'application/json'
};

const Handlers = {
    'POST/requests': startNewRequest,
    'GET/request/{requestId}': listRequestsByRequestId,
}

const generateRequestContent = (event) => {

    let result = {};

    if (event.pathParameters) {
        result.pathParameters = event.pathParameters
    }

    if (event.body) {
        result.body = JSON.parse(event.body)
    }

    return result;
}

const handler = async (event) => {

    const resource = event.resource;
    const httpMethod  = event.httpMethod;
    
    const hadlerKey = httpMethod + resource;
    
    const action = Handlers[hadlerKey];
    if (!action) {
        return { statusCode: 404, headers, body: JSON.stringify({ })};
    }

    const result = await action({ ...generateRequestContent(event) });
    
    return {
        headers,
        statusCode: 200,
        body: JSON.stringify(result),
    };
};

module.exports = {
    handler
};