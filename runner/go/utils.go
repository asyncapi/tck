package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

type manifest struct {
	Description string   `json:"description"`
	FilePaths   []string `json:"filePaths"`
}

// ListYamls lists YAML files in :folderPath: folder;
func ListYamls(folderPath string) ([]string, error) {


}

// SaveReport writes parsing run report as JSON file
func SaveReport(report *Report, outdir string) {
	outdir, err := filepath.Abs(outdir)
	if err != nil {
		panic(fmt.Sprintf(
			"Failed to get absolute path to output dir %s: %s",
			outdir, err.Error()))
	}
	err = os.MkdirAll(outdir, os.ModePerm)
	if err != nil {
		panic(fmt.Sprintf(
			"Failed to create output dir at %s: %s",
			outdir, err.Error()))
	}
	repFilePath := filepath.Join(
		outdir, fmt.Sprintf("%s_%s.json", report.Parser.Name, report.Parser.Language))
	reportJson, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		panic(fmt.Sprintf(
			"Failed to marshal report: %s", err.Error()))
	}
	err = ioutil.WriteFile(repFilePath, reportJson, 0644)
	if err != nil {
		panic(fmt.Sprintf(
			"Failed to write report to %s: %s",
			repFilePath, err.Error()))
	}
}
