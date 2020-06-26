package org.asyncapi.runner;

import org.asyncapi.parsers.IParser;
import org.asyncapi.parsers.AmfParser;
import org.asyncapi.utils.Utils;

import picocli.CommandLine;
import picocli.CommandLine.ParameterException;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;


@Command(name = "asyncapi-tck-runner", mixinStandardHelpOptions = true, version = "1.0.0")
public class AsyncapiTckRunner implements Runnable {
  @Option(names = "--parser", description = "name of a parser to run")
  String parserName;

  @Option(names = "--outdir", description = "output JSON report directory")
  String outdir = "./";

  public IParser pickParser() {
    IParser parser;
    switch (parserName) {
      case "amf":
        parser = new AmfParser();
        break;
      default:
        throw new ParameterException(
          new CommandLine(this),
          "Not supported parser: " + parserName);
    }
    return parser;
  }


  /**
   * Parsers meta-data which helps generating pretty reports.
   * Required fields are: name, language, url, version.
   * Name and language are used in links creation.
   */
  public JSONObject pickParserMeta() {
    JSONObject parserMeta = new JSONObject();
    parserMeta.put("name", parserName);
    parserMeta.put("language", "java");
    switch (parserName) {
      case "amf":
        parserMeta.put("url", "https://github.com/aml-org/amf");
        parserMeta.put("version", "4.1.2");
        break;
      default:
        throw new ParameterException(
          new CommandLine(this),
          "Not supported parser: " + parserName);
    }
    return parserMeta;
  }

  public void run() {
    IParser parser = this.pickParser();
    JSONObject parserMeta = this.pickParserMeta();

    // Get asyncapi/tck root path. When running via Makefile paths are relative to
    // tck/runner/java
    Path rootDirRel = Paths.get("../../");
    String rootDir = rootDirRel.toAbsolutePath().toString();
    String testsDir = Paths.get(rootDir, "tests", "asyncapi-2.0").toString();
    Stream<String> fileList = Utils.listYamls(testsDir);

    JSONObject report = new JSONObject();
    report.put("parser", parserMeta);
    JSONArray results = new JSONArray();

    fileList.forEach(fpath -> {
      Boolean success = true;
      String error = "";
      try {
        parser.parse(fpath);
      } catch (Exception e) {
        success = false;
        error = e.getMessage();
      }
      JSONObject result = new JSONObject();
      result.put("file", fpath.replaceAll(rootDir, ""));
      result.put("success", success);
      result.put("error", error);
      results.add(result);
    });

    report.put("results", results);
    Utils.saveReport(report, outdir);
  }

  public static void main(String[] args) {
    CommandLine.run(new AsyncapiTckRunner(), args);
  }
}
