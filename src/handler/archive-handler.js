const { archiveRequest } = require('../service/app-request-service');

const handler = async (event) => {
    
    const records = event.Records;
    for (let i = 0; i < records.length; i++) {
        
        const sns = records[i].Sns;
        const snsMessage = JSON.parse(sns.Message);
        if (!snsMessage) {
            continue;
        }

        const requestId = snsMessage.requestId;
        await archiveRequest(requestId);
    }
}

module.exports = {
    handler
};