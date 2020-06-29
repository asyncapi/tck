ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
REPORTS_JSON:=$(ROOT_DIR)/reports/json
REPORTS_HTML:=$(ROOT_DIR)/reports/html
JS_RUNNER_DIR:=$(ROOT_DIR)/js
GO_RUNNER_DIR:=$(ROOT_DIR)/go
JAVA_RUNNER_DIR:=$(ROOT_DIR)/java

GO_PROJECT_NAME:=asyncapi-tck-runner-go
export GOPATH=/tmp/asyncapi-tck-go-projects
export GOBIN=/tmp/asyncapi-tck-go-projects/bin
GO_PROJECT_DIR:=$(GOPATH)/src/github.com/asyncapi/$(GO_PROJECT_NAME)

.ONESHELL:
all: clean install report generate-html

all-js:	install-tck-reporter \
		install-js \
		report-js \
		generate-html

all-go:	install-tck-reporter \
		install-go \
		report-go \
		generate-html

all-java: install-tck-reporter \
		install-java \
		report-java \
		generate-html

install: install-tck-reporter \
		install-js \
		install-go \
		install-java

install-tck-reporter:
	cd $(ROOT_DIR) && npm install

install-js: clean-js
	cd $(JS_RUNNER_DIR) \
	&& npm install .

install-go:
	mkdir -p ${GOPATH}/src
	mkdir -p ${GOPATH}/bin
	mkdir -p ${GOPATH}/pkg
	mkdir -p $(GO_PROJECT_DIR)
	cp $(GO_RUNNER_DIR)/* $(GO_PROJECT_DIR)
	cd $(GO_PROJECT_DIR) && go get
	cd $(GO_PROJECT_DIR) && go install

install-java:
	cd $(JAVA_RUNNER_DIR) \
	&& ./gradlew build

report: report-js \
		report-go \
		report-java

report-js:
	cd $(JS_RUNNER_DIR) \
	&& node src/index.js --parser asyncapi-parser --outdir $(REPORTS_JSON) \
	&& node src/index.js --parser amf-client-js --outdir $(REPORTS_JSON)

report-go:
	$(GOBIN)/$(GO_PROJECT_NAME) -parser asyncapi-parser -outdir $(REPORTS_JSON)

report-java:
	cd $(JAVA_RUNNER_DIR) \
	&& ./gradlew run --args='--parser amf --outdir $(REPORTS_JSON)'

generate-html:
ifdef tck_branch
	./node_modules/tck-reporter/bin/tck-reporter.js $(REPORTS_JSON) $(REPORTS_HTML) --repoBranchUrl https://github.com/asyncapi/tck/blob/$(tck_branch)
else
	./node_modules/tck-reporter/bin/tck-reporter.js $(REPORTS_JSON) $(REPORTS_HTML) --repoBranchUrl https://github.com/asyncapi/tck/blob/master
endif

clean: clean-js clean-go
	rm -f $(REPORTS_JSON)/*

clean-js:
	rm -rf $(JS_RUNNER_DIR)/node_modules

clean-go:
	rm -rf $(GOPATH)
