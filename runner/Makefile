ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
REPORTER_DIR:=$(ROOT_DIR)/html-reporter
REPORTS_JSON:=$(ROOT_DIR)/reports/json
JS_RUNNER_DIR:=$(ROOT_DIR)/js


# asyncapi/tck branch with manifest.json in its root
TCK_BRANCH:=master


.ONESHELL:
all: clean install report generate-html

all-js:	install-html-reporter \
		install-js \
		report-js \
		generate-html

install: install-html-reporter \
		 install-js

install-html-reporter:
	cd $(REPORTER_DIR) \
	&& npm install .

install-js: clean-js
	cd $(JS_RUNNER_DIR) \
	&& npm install .

report: report-js

report-js:
	cd $(JS_RUNNER_DIR) \
	&& node src/index.js --parser asyncapi-parser --outdir $(REPORTS_JSON) --branch $(TCK_BRANCH) \
	&& node src/index.js --parser amf-client-js --outdir $(REPORTS_JSON) --branch $(TCK_BRANCH)

generate-html:
	cd $(REPORTER_DIR) \
	&& node src/index.js

clean: clean-js
	rm -f $(REPORTS_JSON)/*

clean-js:
	rm -rf $(JS_RUNNER_DIR)/node_modules
