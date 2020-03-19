# asyncapi/tck/runner
Run several AsyncAPI parsers/validators against https://github.com/asyncapi/tck

## Generating report

Following command will install all runners, run them and generate HTML report:
```sh
$ make
```

Then you can open generated HTML report (`reports/html/index.html`) in your browser.

## JavaScript
Parsers tested:
* [asyncapi-parser](https://github.com/asyncapi/parser-js)
* [amf-client-js](https://github.com/aml-org/amf)

To generate only JS parsers report:
```sh
$ make clean
$ make all-js
```
