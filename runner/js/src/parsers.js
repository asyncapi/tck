const fs = require('fs')

const asyncapi = require('@asyncapi/parser')
const amf = require('amf-client-js')

// https://github.com/asyncapi/parser-js
async function asyncapiParse (fpath) {
  const content = fs.readFileSync(fpath).toString()
  // According to parser's API, it:
  // "Parses and validate an AsyncAPI document from YAML or JSON"
  try {
    await asyncapi.parse(content, {
      path: fpath
    })
  } catch (e) {
    throw new Error(e.message || e.toString())
  }
}

// https://github.com/aml-org/amf
async function amfParse (fpath) {
  await amf.AMF.init()
  // Try v3 first, fallback to v2
  let parser = amf.Core.parser('ASYNC 3.0', 'application/yaml')
  let model = await parser.parseFileAsync(`file://${fpath}`)
  let profileName = amf.ProfileNames.ASYNC30
  
  // If v3 parsing fails, try v2
  try {
    const report = await amf.AMF.validate(
      model, profileName, amf.MessageStyles.ASYNC)
    if (!report.conforms) {
      report.results.map(res => {
        if (res.level.toLowerCase() === 'violation') {
          throw new Error(res.message)
        }
      })
    }
  } catch (e) {
    parser = amf.Core.parser('ASYNC 2.0', 'application/yaml')
    model = await parser.parseFileAsync(`file://${fpath}`)
    profileName = amf.ProfileNames.ASYNC20
    const report = await amf.AMF.validate(
      model, profileName, amf.MessageStyles.ASYNC)
    if (!report.conforms) {
      report.results.map(res => {
        if (res.level.toLowerCase() === 'violation') {
          throw new Error(res.message)
        }
      })
    }
  }
}

module.exports = {
  asyncapiParse: asyncapiParse,
  amfParse: amfParse
}
