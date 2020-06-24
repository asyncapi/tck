package main

import (
	"fmt"
	// asyncapi "github.com/postatum/go-raml/raml"
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
	// defer recovery()
	// apiDef := &asyncapi.APIDefinition{}
	// return asyncapi.ParseFile(fpath, apiDef), true
}
