package main

import (
	"additionalgreeting/internal/local/additional-greeting/additional-greeting"
)

func init() {
	additionalgreeting.Exports.AdditionalGreeting = func() string {
		return "Hello from Go"
	}
}

func main() {
}