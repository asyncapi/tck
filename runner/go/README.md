## About

Simple test of few AsyncAPI Go parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of AsyncAPI files can be composed each containing one/few AsyncAPI features to test those in isolation.

Uses [AsyncAPI/tck](https://github.com/asyncapi/tck/tests/asyncapi-2.0) as a source of AsyncAPI for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:asyncapi/tck.git
$ mkdir -p $GOPATH/src/github.com/asyncapi/asyncapi-tck-runner-go
$ cp tck/runner/go/* $GOPATH/src/github.com/asyncapi/asyncapi-tck-runner-go
$ cd $GOPATH/src/github.com/asyncapi/asyncapi-tck-runner-go
$ go get
$ go install
```

## Run

```sh
$ asyncapi-tck-runner-go -parser PARSER_NAME -outdir ./reports/json
```

## Options

Help:

```sh
$ asyncapi-tck-runner-go -h
```

Parser:
```sh
$ asyncapi-tck-runner-go -parser asyncapi-parser-go
```

Output JSON report directory (defaults to `./`):
```sh
$ asyncapi-tck-runner-go -parser asyncapi-parser-go -outdir ./reports/json
```
