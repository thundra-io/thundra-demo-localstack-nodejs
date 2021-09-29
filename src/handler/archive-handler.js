const { archiveRequest } = require('../service/app-request-service');

const handler = async (event) => {
    
    const records = event.Records;
    for (let i = 0; i < records.length; i++) {
        
        const sns = records[i].Sns;
        const { requestId } = JSON.parse(sns.Message);

        await archiveRequest(requestId);
    }
}

module.exports = {
    handler
};