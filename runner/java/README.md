## About

Simple test of few AsyncAPI Java parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of AsyncAPI files can be composed each containing one/few AsyncAPI features to test those in isolation.

Uses [AsyncAPI/tck](https://github.com/asyncapi/tck/tree/master/tests/asyncapi-2.0) as a source of AsyncAPI for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:asyncapi/tck.git
$ cd tck/runner/java
$ ./gradlew build
```

## Run

```sh
$ ./gradlew run --args='--parser PARSER_NAME --outdir ./reports/json'
```

## Options

Parser:
```sh
$ ./gradlew run --args='--parser amf'
```

Output JSON report directory (defaults to `./`):
```sh
$ ./gradlew run --args='--parser amf --outdir ../reports/json'
```
