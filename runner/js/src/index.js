const parseArgs = require('minimist')
const path = require('path')
const parsers = require('./parsers')
const utils = require('./utils')

const ROOT_DIR = path.resolve(path.join(
  __dirname, // tck/runner/js/src
  '..', // tck/runner/js
  '..', // tck/runner
  '..' // tck
))

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
    path.resolve(ROOT_DIR, 'tests', 'asyncapi-2.0'))
  let report = {
    parser: argv.parser + '(js)',
    results: [],
    branch: argv.branch
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
