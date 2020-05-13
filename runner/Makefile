ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
REPORTS_JSON:=$(ROOT_DIR)/reports/json
REPORTS_HTML:=$(ROOT_DIR)/reports/html
JS_RUNNER_DIR:=$(ROOT_DIR)/js

.ONESHELL:
all: clean install report generate-html

all-js:	install-tck-reporter \
		install-js \
		report-js \
		generate-html

install: install-tck-reporter \
		 install-js

install-tck-reporter:
	npm install -g jstoiko/tck-reporter#v1.0.0

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
	tck-reporter $(REPORTS_JSON) $(REPORTS_HTML) --repoBranchUrl https://github.com/asyncapi/tck/blob/$(tck_branch)
else
	tck-reporter $(REPORTS_JSON) $(REPORTS_HTML) --repoBranchUrl https://github.com/asyncapi/tck/blob/master
endif

clean: clean-js
	rm -f $(REPORTS_JSON)/*

clean-js:
	rm -rf $(JS_RUNNER_DIR)/node_modules
