package org.asyncapi.parsers;

import amf.client.AMF;
import amf.ProfileNames;
import amf.MessageStyles;
import amf.client.parse.Async20Parser;
import amf.client.parse.Async30Parser;
import amf.client.model.document.BaseUnit;
import amf.client.validate.ValidationReport;
import amf.client.validate.ValidationResult;

import java.util.concurrent.ExecutionException;
import java.util.List;


// https://github.com/aml-org/amf
public class AmfParser implements IParser {
  public void parse(String fpath) throws InterruptedException, ExecutionException, IllegalArgumentException {
    AMF.init().get();
    boolean isV3 = fpath.contains("asyncapi-3.0");
    String fileUrl = "file://" + fpath;
    BaseUnit model = isV3
      ? (BaseUnit) new Async30Parser().parseFileAsync(fileUrl).get()
      : (BaseUnit) new Async20Parser().parseFileAsync(fileUrl).get();
    ValidationReport report = AMF.validate(
      model,
      isV3 ? ProfileNames.ASYNC30() : ProfileNames.ASYNC20(),
      MessageStyles.ASYNC()
    ).get();
    List<ValidationResult> results = report.results();
    for (ValidationResult res : results) {
      if (!report.conforms() && res.level().toLowerCase().equals("violation")) {
        throw new IllegalArgumentException(res.message());
      }
    }
  }
}
