## About

Simple test of few AsyncAPI JS parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of AsyncAPI files can be composed each containing one/few AsyncAPI features to test those in isolation.

Uses [AsyncAPI/tck](https://github.com/asyncapi/tck/tests/asyncapi-2.0) as a source of AsyncAPI for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:asyncapi/tck.git
$ cd tck/runner/js
$ npm install .
```

## Run

```sh
$ node src/index.js --parser PARSER_NAME --outdir ./reports/json --branch develop
```

## Options

Parser:
```sh
$ node src/index.js --parser asyncapi-parser/amf-client-js
```

Output JSON report directory (defaults to `./`):
```sh
$ node src/index.js --parser asyncapi-parser --outdir ./reports/json --branch develop
```

AsyncAPI/tck branch to load AsyncAPI files from:
```sh
$ node src/index.js --parser asyncapi-parser --branch develop
```
