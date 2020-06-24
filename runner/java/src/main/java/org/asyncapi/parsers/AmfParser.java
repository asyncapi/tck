package org.asyncapi.parsers;

import amf.client.AMF;
import amf.ProfileNames;
import amf.MessageStyles;
import amf.client.parse.Async20Parser;
import amf.client.model.domain.BaseUnit;
import amf.client.validate.ValidationReport;
import amf.client.validate.ValidationResult;

import java.util.concurrent.ExecutionException;
import java.util.List;


// https://github.com/aml-org/amf
public class AmfParser implements IParser {
  public void parse(String fpath) throws InterruptedException, ExecutionException, IllegalArgumentException {
    AMF.init().get();
    BaseUnit model = (BaseUnit) new Async20Parser().parseFileAsync("file://" + fpath).get();
    ValidationReport report = AMF.validate(model, ProfileNames.ASYNC20, MessageStyles.ASYNC20).get();
    List<ValidationResult> results = report.results();
    for (ValidationResult res : results) {
      if (!report.conforms() && res.level().toLowerCase().equals("violation")) {
        throw new IllegalArgumentException(res.message());
      }
    }
  }
}
