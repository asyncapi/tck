package org.asyncapi.runner;

import org.asyncapi.parsers.IParser;
import org.asyncapi.parsers.AmfParser;
import org.asyncapi.utils.Utils;

import picocli.CommandLine;
import picocli.CommandLine.ParameterException;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Command(name = "asyncapi-tck-runner", mixinStandardHelpOptions = true, version = "1.0.0")
public class AsyncapiTckRunner implements Runnable {
    @Option(names = "--parser", description = "name of a parser to run", required = true)
    String parserName;

    @Option(names = "--outdir", description = "output JSON report directory")
    String outdir = "./";

    private static final Map<String, IParser> PARSER_MAP = new ConcurrentHashMap<>();

    static {
        PARSER_MAP.put("amf", new AmfParser());
    }

    public IParser pickParser() {
        if (parserName == null || parserName.isEmpty()) {
            throw new ParameterException(new CommandLine(this), "Parser name cannot be null or empty");
        }
        IParser parser = PARSER_MAP.get(parserName);
        if (parser == null) {
            throw new ParameterException(new CommandLine(this), "Not supported parser: " + parserName);
        }
        return parser;
    }

    /**
     * Returns metadata about the parser for generating reports.
     */
    public JSONObject pickParserMeta() {
        JSONObject parserMeta = new JSONObject();
        parserMeta.put("name", parserName);
        parserMeta.put("language", "java");
        if ("amf".equals(parserName)) {
            parserMeta.put("url", "https://github.com/aml-org/amf");
            parserMeta.put("version", "4.1.2");
        } else {
            throw new ParameterException(new CommandLine(this), "Not supported parser: " + parserName);
        }
        return parserMeta;
    }

    public void run() {
        IParser parser = this.pickParser();
        JSONObject parserMeta = this.pickParserMeta();

        // Get asyncapi/tck root path
        Path rootDirRel = Paths.get("../../");
        String rootDir = rootDirRel.toAbsolutePath().toString();
        String testsDir = Paths.get(rootDir, "tests").toString();
        Stream<String> fileList = Utils.listYamls(testsDir);

        JSONObject report = new JSONObject();
        report.put("parser", parserMeta);
        JSONArray results = new JSONArray();

        List<JSONObject> resultsList = Collections.synchronizedList(new ArrayList<>());
        fileList.forEach(fpath -> {
            boolean success = true;
            String error = "";
            try {
                parser.parse(fpath);
            } catch (Exception e) {
                success = false;
                error = (e.getMessage() != null) ? e.getMessage() : "Unknown parsing error";
                e.printStackTrace(); // Log the error for debugging
            }
            JSONObject result = new JSONObject();
            Path relativePath = Paths.get(rootDir).relativize(Paths.get(fpath));
            result.put("file", relativePath.toString());
            result.put("success", success);
            result.put("error", error);
            resultsList.add(result);
        });

        results.addAll(resultsList);
        report.put("results", results);
        Utils.saveReport(report, outdir);
    }

    public static void main(String[] args) {
        int exitCode = new CommandLine(new AsyncapiTckRunner()).execute(args);
        System.exit(exitCode);
    }
}
