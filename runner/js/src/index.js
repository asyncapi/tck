const parseArgs = require('minimist')
const path = require('path')
const parsers = require('./parsers')
const utils = require('./utils')
const package = require('../package.json')

const ROOT_DIR = path.resolve(path.join(
  __dirname, // tck/runner/js/src
  '..', // tck/runner/js
  '..', // tck/runner
  '..' // tck
))

/**
 * Parsers meta-data which helps generating pretty reports.
 * Required fields are: url, version.
 */
const PARSERS_META = {
  'amf-client-js': {
    url: 'https://github.com/aml-org/amf',
    version: package.dependencies['amf-client-js']
  },
  'asyncapi-parser': {
    url: 'https://github.com/asyncapi/parser-js',
    version: package.dependencies['@asyncapi/parser']
  }
}

const PARSERS = {
  'amf-client-js': parsers.amfParse,
  'asyncapi-parser': parsers.asyncapiParse
}

async function main () {
  const argv = parseArgs(process.argv.slice(2))
  const parserFunc = PARSERS[argv.parser]
  if (parserFunc === undefined) {
    console.log(`Not supported parser: ${argv.parser}`)
    return
  }

  const fileList = utils.listYamlFiles(
    path.resolve(ROOT_DIR, 'tests'))
  let report = {
    parser: {
      name: argv.parser,
      language: 'js',
      ...PARSERS_META[argv.parser]
    },
    results: []
  }

  for (let i = 0; i < fileList.length; i++) {
    let fpath = fileList[i]
    let success = true
    let error
    try {
      await parserFunc(fpath)
    } catch (e) {
      success = false
      error = e
    }
    report.results.push({
      file: fpath.replace(ROOT_DIR, ''),
      success: success,
      error: error ? error.toString() : error
    })
  }

  utils.saveReport(report, argv.outdir || './')
}

main()
