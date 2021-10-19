const { processRequest } = require('../service/app-request-service');

const handler = async (event) => {

    const records = event.Records;
    for (let i = 0; i < records.length; i++) {
        
        const record = JSON.parse(records[i].body);
        if (!record) {
            continue;
        }
        
        const requestId = record.requestId;
        await processRequest(requestId);
    }
}

module.exports = {
    handler
};