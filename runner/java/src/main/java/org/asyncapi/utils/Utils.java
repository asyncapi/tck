package org.asyncapi.utils;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;


public class Utils {

  // Lists YAML files in `folderPath`
  // Produces paths similar to: tests/asyncapi-2.0/Format/valid.yaml
  public static List<String> listYamls(String folderPath) {


  }

  // Saves JSON report as JSON files to the `outdir` directory
  public static void saveReport(JSONObject report, String outdir) {
    String outDirPath = Paths.get(outdir).toAbsolutePath().toString();
    File outDirFile = new File(outDirPath);
    outDirFile.mkdirs();
    JSONObject parserMeta = (JSONObject) report.get("parser");
    String parserName = (String) parserMeta.get("name");
    String parserLang = (String) parserMeta.get("language");
    String fname = parserName + "_" + parserLang + ".json";
    String outFilePath = Paths.get(outDirPath, fname).toAbsolutePath().toString();
    try (FileWriter file = new FileWriter(outFilePath)) {
      file.write(report.toJSONString());
      file.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return;
  }
}
