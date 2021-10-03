const dynamoDbChaos = {
    type: 'FilteringSpanListener',
    config: {
        listener: {
            type: 'ErrorInjectorSpanListener',
            config: {
                errorType: 'ChaosError',
                errorMessage: 'DynamoDB Chaos Injected!',
                injectPercentage: 100,
            }
        },
        filters: [
            {
                className: 'AWS-DynamoDB',
            }
        ]
    }
}

module.exports = {
    dynamoDbChaos,
}