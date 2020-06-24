package main

import (
	"errors"
	"flag"
	"fmt"
	"strings"
	"path/filepath"
)

// FileResult represents a single file parsing result
type FileResult struct {
	File    string `json:"file"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

// ParserMeta represents a single parser meta-data
type ParserMeta struct {
	Language string `json:"language"`
	Name     string `json:"name"`
	Url      string `json:"url"`
	Version  string `json:"version"`
}

// Report represents a parser parsing results
type Report struct {
	Parser  ParserMeta    `json:"parser"`
	Results []*FileResult `json:"results"`
}

func main() {
	parserFl := flag.String(
		"parser", "asyncapi-parser-go",
		"Parser to test. Supported: asyncapi-parser-go.")
	outdirFl := flag.String(
		"outdir", "./", "Output report directory path.")
	flag.Parse()

	parsersRunners := map[string]Parser{
		"asyncapi-parser-go": Asyncapi,
	}

	/**
	 * Parsers meta-data which helps generating pretty reports.
	 * Required fields are: language, name, url, version.
	 * Name and language are used in links creation.
	 */
	parsersMeta := map[string]ParserMeta{
		"asyncapi-parser-go": {
			Language: "go",
			Name:     "asyncapi-parser-go",
			Url:      "https://github.com/asyncapi/parser-go",
			Version:  "0.3.0",
		},
	}
	parser, ok := parsersRunners[*parserFl]
	if !ok {
		fmt.Println("Not supported parser. See help (-h).")
		return
	}

	// Go to asyncapi/tck root. Paths are relative to a place command is fun from.
	// When running via Makefile, paths are relative to
	// asyncapi/tck/runner
	rootFl, _ := filepath.Abs(filepath.Join(".."))

	testsFl, _ := filepath.Abs(filepath.Join(rootFl, "tests", "asyncapi-2.0"))
	fileList, err := ListYamls(testsFl)
	if err != nil {
		fmt.Printf("Failed to list YAML files: %s\n", err)
		return
	}

	report := &Report{
		Parser:  parsersMeta[*parserFl],
		Results: []*FileResult{},
	}

	for _, fpath := range fileList {
		err, notPanic := parser(fpath)
		if !notPanic {
			err = errors.New("Parser crashed")
		}

		result := &FileResult{
			File:    strings.Replace(fpath, rootFl, "", -1),
			Success: err == nil,
			Error:   "",
		}
		if err != nil {
			result.Error = err.Error()
		}
		report.Results = append(report.Results, result)
	}

	SaveReport(report, *outdirFl)
}
