const path = require('path')
const fs = require('fs')
const walk = require('walk')

/* Lists spec files in folder */
function listYamlFiles (dirPath) {
  let files = []
  const options = {
    listeners: {
      file: (root, fileStats, next) => {
        if (fileStats.name.includes('.yaml')) {
          files.push(path.join(root, fileStats.name))
        }
        next()
      }
    }
  }
  walk.walkSync(dirPath, options)
  return files.sort()
}

/* Writes JSON report to output folder */
function saveReport (report, outdir) {
  outdir = path.resolve(outdir)
  try { fs.mkdirSync(outdir) } catch (e) {}
  const fpath = path.join(outdir, `${report.parser}.json`)
  fs.writeFileSync(fpath, JSON.stringify(report, null, 2))
}

module.exports = {
  listYamlFiles: listYamlFiles,
  saveReport: saveReport
}
