const path = require('path')
const fs = require('fs')

/* Lists spec files in folder */
function listFiles (foldPath) {
  const manifestPath = path.join(foldPath, 'manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  return manifest.filePaths.map(fp => path.join(foldPath, fp))
}

/* Writes JSON report to output folder */
function saveReport (report, outdir) {
  outdir = path.resolve(outdir)
  try { fs.mkdirSync(outdir) } catch (e) {}
  const fpath = path.join(outdir, `${report.parser}.json`)
  fs.writeFileSync(fpath, JSON.stringify(report, null, 2))
}

module.exports = {
  listFiles: listFiles,
  saveReport: saveReport
}
