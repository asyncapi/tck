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
    // Try v3 first, fallback to v2
    BaseUnit model;
    ValidationReport report;
    try {
      model = (BaseUnit) new Async30Parser().parseFileAsync("file://" + fpath).get();
      report = AMF.validate(model, ProfileNames.ASYNC30(), MessageStyles.ASYNC()).get();
    } catch (Exception e) {
      model = (BaseUnit) new Async20Parser().parseFileAsync("file://" + fpath).get();
      report = AMF.validate(model, ProfileNames.ASYNC20(), MessageStyles.ASYNC()).get();
    }
    List<ValidationResult> results = report.results();
    for (ValidationResult res : results) {
      if (!report.conforms() && res.level().toLowerCase().equals("violation")) {
        throw new IllegalArgumentException(res.message());
      }
    }
  }
}
