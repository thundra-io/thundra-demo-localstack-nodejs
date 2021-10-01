const dynamoDbChaos = {
    type: 'FilteringSpanListener',
    config: {
        listener: {
            type: 'ErrorInjectorSpanListener',
            config: {
                injectCountFreq: 1,
                injectOnFinish: false,
                errorType: 'ChaosError',
                errorMessage: 'DynamoDB Chaos Injected!',
                counter: 0
            }
        },
        filters: [
            {
                className: 'AWS-DynamoDB'
            }
        ]
    }
}

module.exports = {
    dynamoDbChaos,
}