package org.asyncapi.utils;

import org.json.simple.JSONObject;

import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.stream.Stream;


public class Utils {

  /*
    Lists YAML files in `folderPath` recursively.
    Returned paths are sorted and absolute.
  */
  public static Stream<String> listYamls(String folderPath) {
    Stream<Path> fpaths = Stream.empty();
    try {
      fpaths = Files.walk(Paths.get(folderPath));
    } catch (IOException e) {
      System.out.println("Failed to list YAML files: " + e.toString());
      System.exit(1);
    }
    return fpaths.filter(Files::isRegularFile)
      .map(el -> el.toAbsolutePath().toString())
      .filter(el -> el.endsWith(".yaml"))
      .sorted();
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
