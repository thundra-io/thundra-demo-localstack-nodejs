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
        spanFilterer: {
            all: false,
            spanFilters: [
                {
                    className: 'AWS-DynamoDB'
                }
            ]
        }
    }
}

module.exports = {
    dynamoDbChaos,
}