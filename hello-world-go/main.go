package main

import (
	"fmt"

	"hello/internal/component/hello-world/example"
)

func init() {
	example.Exports.Greet = func(greetee string) string {
		return fmt.Sprintf("Hello from Go, %s!", greetee)
	}
}

func main() {
}