export SERVICES = serverless,cloudformation,sts,sqs,dynamodb,s3,sns
export AWS_ACCESS_KEY_ID ?= test
export AWS_SECRET_ACCESS_KEY ?= test
export AWS_DEFAULT_REGION ?= us-east-1
export START_WEB ?= 1
export THUNDRA_APIKEY = 7fe9ea2e-fd4a-4862-aa30-33e7ed49833e
export THUNDRA_AGENT_TEST_PROJECT_ID = 7f9492de-adc8-4bc3-a602-9abfd3fadbaa
export THUNDRA_AGENT_REPORT_REST_BASEURL = https://collector.thundra.us/v1
export THUNDRA_AGENT_APPLICATION_NAME = thundra-demo-localstack-nodejs
# export THUNDRA_AGENT_TRACE_INSTRUMENT_TRACEABLECONFIG = io.thundra.demo.localstack.*.*[traceLineByLine=true]

usage:              ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

install:            ## Install dependencies
	npm install
	which serverless || npm install -g serverless
	which localstack || pip install localstack
	which awslocal   || pip install awscli-local

test:               ## Test app
	echo "Building Serverless app ..."
	npm test

deploy:             ## Deploy the app locally
	echo "Deploying Serverless app to local environment ..."
	SLS_DEBUG=1 serverless deploy --stage local --region ${AWS_DEFAULT_REGION}

start:              ## Build, deploy and start the app locally
	# @make build;
	@make deploy;

.PHONY: usage install deploy start   # usage install build test deploy start