const path = require('path')
const fs = require('fs')
const Mustache = require('mustache')

/* Runs all the logic */
function main () {
  const branch = process.argv.slice(2)[0]
  const reportsDir = path.join(__dirname, '..', '..', 'reports', 'json')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir)
  }
  let stats = []
  fs.readdirSync(reportsDir).forEach(fpath => {
    if (!fpath.endsWith('.json')) {
      return
    }
    let fullPath = path.join(reportsDir, fpath)
    console.log(`Processing report: ${fullPath}`)
    let report = JSON.parse(fs.readFileSync(fullPath))
    interpretReport(report, branch)
    stats.push(composeReportStats(report))
    renderTemplate(
      report, 'detailed_report',
      `${report.parser.name}_detailed_report`)

    let featuresStats = composeFeaturesStats(report)
    renderTemplate(
      featuresStats, 'features_stats',
      `${report.parser.name}_features_stats`)
  })
  renderTemplate({stats: stats}, 'index', 'index')
}

/*
  * Inverts invalid files parsing results;
  * Composes repo url from relative file path;
  * Extracts "feature" name from file path;
*/
function interpretReport (report, branch) {
  const repo = `https://github.com/asyncapi/tck/blob/${branch}`
  report.results.forEach(result => {
    result.invalid = shouldFail(result.file)
    if (result.invalid) {
      delete result.error
      result.success = !result.success
      if (!result.success) {
        result.error = 'Parsing expected to fail but succeeded'
      }
    }
    result.file = result.file.startsWith('/')
      ? result.file.slice(1)
      : result.file
    result.fileUrl = `${repo}/${result.file}`

    // Pick first 3 directories names as a feature name
    result.feature = path.dirname(result.file)
      .split('/').slice(0, 3).join('/')
  })
}

/*
  Composes single parser report stats:
    * number of successfully passed/total valid/invalid files tests;
    * % of passed files tests;
*/
function composeReportStats (report) {
  let stats = {
    parser: report.parser,
    valid: {success: 0, total: 0, successPerc: 0},
    invalid: {success: 0, total: 0, successPerc: 0},
    all: {success: 0, total: report.results.length, successPerc: 0}
  }
  const invalid = report.results.filter(r => { return r.invalid })
  const invalidSuccess = invalid.filter(r => { return r.success })
  stats.invalid.total = invalid.length
  stats.invalid.success = invalidSuccess.length
  stats.invalid.successPerc = calculateSuccessPerc(stats.invalid)

  const valid = report.results.filter(r => { return !r.invalid })
  const validSuccess = valid.filter(r => { return r.success })
  stats.valid.total = valid.length
  stats.valid.success = validSuccess.length
  stats.valid.successPerc = calculateSuccessPerc(stats.valid)

  stats.all.success = invalidSuccess.length + validSuccess.length
  stats.all.successPerc = calculateSuccessPerc(stats.all)

  return stats
}

/* Calculates success percentage */
function calculateSuccessPerc (data) {
  let successPerc = Math.round((data.success / data.total) * 100)
  if (isNaN(successPerc)) {
    successPerc = 100
  }
  return successPerc
}

/*
  Composes single parser features report.
  It includes features names and number of passed/all valid/invalid
  files for each parser.
*/
function composeFeaturesStats (report) {
  let frep = {
    parser: report.parser,
    stats: []
  }
  // Group by feature name
  let grouped = {}
  report.results.forEach(result => {
    if (grouped[result.feature] === undefined) {
      grouped[result.feature] = []
    }
    grouped[result.feature].push(result)
  })
  // Compose stats for each feature
  for (var featureName in grouped) {
    if (grouped.hasOwnProperty(featureName)) {
      let stats = composeReportStats({
        results: grouped[featureName]
      })
      stats.feature = featureName
      frep.stats.push(stats)
    }
  }
  return frep
}

/* Renders single Mustache template with data and writes it to html file */
function renderTemplate (data, tmplName, htmlName) {
  const inPath = path.join(
    __dirname, '..', 'templates', `${tmplName}.mustache`)
  const tmplStr = fs.readFileSync(inPath, 'utf-8')
  const htmlStr = Mustache.render(tmplStr, data)
  const outDir = path.join(__dirname, '..', '..', 'reports', 'html')
  const outPath = path.join(outDir, `${htmlName}.html`)
  fs.writeFileSync(outPath, htmlStr)
  console.log(`Rendered HTML: ${outPath}`)
}

/* Checks whether a file is expected to fail */
function shouldFail (fpath) {
  return fpath.toLowerCase().includes('invalid')
}

main()
