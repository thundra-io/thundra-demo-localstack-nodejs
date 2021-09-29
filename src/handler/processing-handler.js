const { processRequest } = require('../service/app-request-service');

const handler = async (event) => {

    const records = event.Records;
    for (let i = 0; i < records.length; i++) {
        
        const { requestId } = JSON.parse(records[i].body);
        await processRequest(requestId);
    }
}

module.exports = {
    handler
};