package main

import (
	"bufio"
	"bytes"
	"fmt"
	asyncapi "github.com/asyncapi/parser/pkg/parser"
	"os"
)

// Parser is a parsing type function
type Parser func(string) (error, bool)

func recovery() {
	if r := recover(); r != nil {
		fmt.Println("PANIC:", r)
	}
}

// Asyncapi runs https://github.com/asyncapi/parser-go
func Asyncapi(fpath string) (error, bool) {
	defer recovery()
	var noopMessageProcessor asyncapi.MessageProcessor = func(_ *map[string]interface{}) error { return nil }
	parse := noopMessageProcessor.BuildParse()
	f, err := os.Open(fpath)
	defer f.Close()
	if err != nil {
		return err, true
	}
	var b bytes.Buffer
	noopWriter := bufio.NewWriter(&b)
	return parse(f, noopWriter), true
}
