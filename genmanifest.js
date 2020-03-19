const path = require('path')
const fs = require('fs')
const walk = require('walk')

// Features listed in order they appear in the spec spec.
const FEATURES_PRIORITY = [
  'Format',
  'File Structure',
  'AsyncAPI Object',
  'AsyncAPI Version String',
  'Identifier',
  'Info Object',
  'Contact Object',
  'License Object',
  'Servers Object',
  'Server Object',
  'Server Variable Object',
  'Channels Object',
  'Channel Item Object',
  'Operation Object',
  'Operation Trait Object',
  'Message Object',
  'Message Trait Object',
  'Tags Object',
  'Tag Object',
  'External Documentation Object',
  'Components Object',
  'Reference Object',
  'Schema Object',
  'Security Scheme Object',
  'Security Requirement Object',
  'Parameters Object',
  'Parameter Object',
  'Server Bindings Object',
  'Channel Bindings Object',
  'Operation Bindings Object',
  'Message Bindings Object',
  'Correlation ID Object',
  'Specification Extensions'
]

const EXT = '.yaml'

function main () {
  const projRoot = path.resolve(__dirname)
  const inputRoot = getInputDirPath()
  let filesPaths = listFiles(inputRoot)
  filesPaths = sortFilesPaths(inputRoot, filesPaths)
  filesPaths = makePathsRelative(projRoot, filesPaths)
  generateManifest(projRoot, filesPaths)
}

// Gets absolute path of input folder
function getInputDirPath () {
  let dirPath = process.argv[2]

  if (!fs.existsSync(dirPath)) {
    console.error(`'${dirPath}' not found`)
    return
  }

  dirPath = path.resolve(dirPath)
  if (!fs.lstatSync(dirPath).isDirectory()) {
    console.error(`'${dirPath}' is not a directory`)
    return
  }
  return dirPath
}

// Lists files with a particular extension under directory path
function listFiles (dirPath) {
  let files = []
  const options = {
    listeners: {
      file: (root, fileStats, next) => {
        if (fileStats.name.indexOf(EXT) >= 0) {
          files.push(path.join(root, fileStats.name))
        }
        next()
      }
    }
  }
  walk.walkSync(dirPath, options)
  return files
}

// Sorts string filesPaths according to features definition order in a spec
function sortFilesPaths (filesRoot, filesPaths) {
  const pathObjs = extendWithPriority(
    filesRoot, filesPaths, FEATURES_PRIORITY.slice())
  const sortedPathObjs = pathObjs.sort((obj1, obj2) => {
    return obj1.priority - obj2.priority
  })
  return sortedPathObjs.map((obj) => {
    return obj.path
  })
}

// Makes fiels paths relative to a directory
function makePathsRelative (dirPath, filesPaths) {
  return filesPaths.map((pth) => {
    return path.relative(dirPath, pth)
  })
}

// Turns plain file paths into objects of type {priority: INT, path: STRING}
// E.g.:
// > let featuresPriority = ['methodresponses', 'overlays']
// > extendWithPriority('/foo/bar', '/foo/bar/Overlays/some/file.ext')
// > {priority: 2, path: '/foo/bar/Overlays/some/file.ext'}
// > extendWithPriority('/foo/bar', '/foo/bar/qweqwe/some/file.ext')
// > {priority: 3, path: '/foo/bar/qweqwe/some/file.ext'}
//
// Override this to change logic of picking priority.
function extendWithPriority (filesRoot, filesPaths, featuresPriority) {
  featuresPriority = featuresPriority.map(x => x.toLowerCase())
  return filesPaths.map((pth) => {
    const piece = getFirstPathPiece(filesRoot, pth).toLowerCase()
    let priority = featuresPriority.findIndex(el => el === piece)

    // Feature name not found. Adding it to the list allows sorting not
    // found features.
    if (priority === -1) {
      featuresPriority.push(piece)
      priority = featuresPriority.length - 1
    }
    priority += 1 // Make 1-based
    return {path: pth, priority: priority}
  })
}

// Gets relative folder 'root' name of files file path.
// E.g.:
//  > const filesRoot = '/foo/bar'
//  > const fielPath = '/foo/bar/MethodResponses/some/file.ext'
//  > getFirstPathPiece(filesRoot, fielPath)
//  > 'methodresponses'
function getFirstPathPiece (filesRoot, fielPath) {
  const relPath = path.relative(filesRoot, fielPath)
  return relPath.split(path.sep)[0].toLowerCase()
}

// Generates and writes manifest file
function generateManifest (dirPath, filesPaths) {
  const data = {
    description: 'Files listed in order corresponding AsyncAPI ' +
                 'feature appears in AsyncAPI 2.0 Specification',
    filePaths: filesPaths
  }
  const manifestPath = path.join(dirPath, 'manifest.json')
  console.log(`Writing manifest file to ${manifestPath}`)
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 4))
}

main()
