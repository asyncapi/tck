const fs = require('fs')

const asyncapi = require('asyncapi-parser')
const amf = require('amf-client-js')

// https://github.com/asyncapi/parser-js
async function asyncapiParse (fpath) {
  const content = fs.readFileSync(fpath).toString()
  // According to parser's API, it:
  // "Parses and validate an AsyncAPI document from YAML or JSON"
  try {
    await asyncapi.parse(content)
  } catch (e) {
    throw new Error(e.message || e.toString())
  }
}

// https://github.com/aml-org/amf
async function amfParse (fpath) {
  await amf.AMF.init()
  const parser = amf.AMF.raml10Parser()
  const model = await parser.parseFileAsync(`file://${fpath}`)
  const report = await amf.AMF.validate(
    model, amf.ProfileNames.RAML10, amf.MessageStyles.RAML)
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
