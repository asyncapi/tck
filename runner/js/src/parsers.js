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
  const isV3 = fpath.includes('asyncapi-3.0')
  const spec = isV3 ? 'ASYNC 3.0' : 'ASYNC 2.0'
  const profile = isV3 ? amf.ProfileNames.ASYNC30 : amf.ProfileNames.ASYNC20
  const parser = amf.Core.parser(spec, 'application/yaml')
  const model = await parser.parseFileAsync(`file://${fpath}`)
  const report = await amf.AMF.validate(
    model, profile, amf.MessageStyles.ASYNC)
  if (!report.conforms) {
    report.results.map(res => {
      if (res.level.toLowerCase() === 'violation') {
        throw new Error(res.message)
      }
    })
  }
}

module.exports = {
  asyncapiParse: asyncapiParse,
  amfParse: amfParse
}
