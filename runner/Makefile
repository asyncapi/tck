ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
REPORTER_DIR:=$(ROOT_DIR)/html-reporter
REPORTS_JSON:=$(ROOT_DIR)/reports/json
JS_RUNNER_DIR:=$(ROOT_DIR)/js

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
	&& node src/index.js --parser asyncapi-parser --outdir $(REPORTS_JSON) \
	&& node src/index.js --parser amf-client-js --outdir $(REPORTS_JSON)

generate-html:
ifdef tck_branch
	cd $(REPORTER_DIR) && node src/index.js $(tck_branch)
else
	cd $(REPORTER_DIR) && node src/index.js master
endif

clean: clean-js
	rm -f $(REPORTS_JSON)/*

clean-js:
	rm -rf $(JS_RUNNER_DIR)/node_modules
