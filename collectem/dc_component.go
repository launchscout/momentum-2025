package main

import (
	dc "example-go-component/internal/edgee/components/data-collection"

	"go.bytecodealliance.org/cm"
)

type Settings struct {
	Example string
}

func parseSettings(settings dc.Dict) *Settings {
	slice := settings.Slice()

	example := ""

	for _, v := range slice {
		if v[0] == "example" {
			example = v[1]
		}
	}

	return &Settings{
		Example: example,
	}
}

// Implement the datacollection.Exports.Page, datacollection.Exports.Track, and datacollection.Exports.User functions.
// These functions are called by the Edgee runtime to get the HTTP request to make to the provider's API for each event type.
func PageHandler(e dc.Event, settings dc.Dict) dc.EdgeeRequest {
	parsedSettings := parseSettings(settings)

	headers := [][2]string{
		{"Content-Type", "application/json"},
		{"Authorization", "Bearer token123"},
		{"Example", parsedSettings.Example},
	}
	list := cm.NewList(&headers[0], len(headers))
	dict := dc.Dict(list)
	edgeeRequest := dc.EdgeeRequest{
		Method:               dc.HTTPMethodGET,
		URL:                  "https://example.com/api/resource",
		Headers:              dict,
		Body:                 `{"key": "value"}`,
		ForwardClientHeaders: true,
	}

	return edgeeRequest
}

func TrackHandler(e dc.Event, settings dc.Dict) dc.EdgeeRequest {
	parsedSettings := parseSettings(settings)

	headers := [][2]string{
		{"Content-Type", "application/json"},
		{"Authorization", "Bearer token123"},
		{"Example", parsedSettings.Example},
	}
	list := cm.NewList(&headers[0], len(headers))
	dict := dc.Dict(list)
	edgeeRequest := dc.EdgeeRequest{
		Method:               dc.HTTPMethodGET,
		URL:                  "https://example.com/api/resource",
		Headers:              dict,
		Body:                 `{"key": "value"}`,
		ForwardClientHeaders: true,
	}

	return edgeeRequest
}

func UserHandler(e dc.Event, settings dc.Dict) dc.EdgeeRequest {
	parsedSettings := parseSettings(settings)

	headers := [][2]string{
		{"Content-Type", "application/json"},
		{"Authorization", "Bearer token123"},
		{"Example", parsedSettings.Example},
	}
	list := cm.NewList(&headers[0], len(headers))
	dict := dc.Dict(list)
	edgeeRequest := dc.EdgeeRequest{
		Method:               dc.HTTPMethodGET,
		URL:                  "https://example.com/api/resource",
		Headers:              dict,
		Body:                 `{"key": "value"}`,
		ForwardClientHeaders: true,
	}

	return edgeeRequest
}
