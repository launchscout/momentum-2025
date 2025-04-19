---
marp: true
style: |

  section h1 {
    color: #6042BC;
  }

  section code {
    background-color: #e0e0ff;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
  }

  footer img {
    position: absolute;
    width: 120px;
    right: 20px;
    top: 0;

  }
  section #title-slide-logo {
    margin-left: -60px;
  }
---

# WebAssembly beyond the browser: a better way to build extensible software
## Chris Nelson
### @superchris.launchscout.com (BlueSky)
### @superchris (github)

---
# Agenda
## WebAssembly Components
- Why we need them
- How to build them
- How to run them
- Use cases
- Future

---

# WebAssembly Origins

- Designed to be a portable compilation target
- Created through collaboration between major browser vendors
- Goals: Speed, security, and platform independence

---

# A brief history of WebAssembly
- 2013: asm.js (Mozilla)
- 2015: WebAssembly project announced
- 2017: MVP released with support in all major browsers
- 2019: W3C recommendation status achieved
- 2019: WASI (WebAssembly System Interface) introduced
- 2022: Component Model proposal

---

# WebAssembly MVP
- Supports only numeric types
- Shared linear memory
  - Your job to manage
  - Your job to figure out what to put there

---

# Saying hello from WebAssembly
- Let's allocate some shared memory
- passing pointers and offsets and lengths, oh my!
- oh yeah, we should figure out what encoding to use
- Are you sad yet?

---

# WebAssembly Components
- Higher-level abstraction on top of core WebAssembly
- Enables language-agnostic type system
- Establishes canonical ABI
  - how to map high level types to memory
- Enables language-agnostic communication

---

# WIT (WebAssembly Interface Types)
- Human-readable interface description language
- Describes components' interfaces
- Defines data types and functions
- imports and exports

---

# WIT structure
- package - top level container of the form `namespace:name@version` 
- worlds - specifies the "contract" for a component and contains imports and exports
- interfaces - named group of types, imports and exports
- exports - functions provided by a component
- imports - functions a component needs provided to it

---

# WIT types
- Primitive types
  - u8, u16, u32, u64, s8, s16, s32, s64, f32, f64
  - bool, char, string
- Compound types
  - lists, options, results, tuples
- User Defined Types
  - records, variants, enums, flags, 
- Resources

---

# Language support
- Rust
- Javascript
- C/C++
- C# (.NET)
- Go
- Python
- Moonbit
- Elixir (host only)

---

# Definitions
- **bindings** - language specific stubs generated from WIT
- **exports** - functions that a component provides
- **imports** - functions that a component can call
- **Hosts** - Code which calls into webassembly components
- **Guests** - Code which produces webassembly components to be called from Hosts
- **Runtimes** - Provides all required services to access the outside world
  - browser (jco)
  - server (wasmtime)

---

# Hello World WIT
```wit
package component:hello-world;

/// An example world for the component to target.
world example {
    export greet: func(greetee: string) -> string;
}
```

---

# Hello world component in Rust
```rust
#[allow(warnings)]
mod bindings;

use bindings::Guest;

struct Component;

impl Guest for Component {
    /// Say hello!
    fn greet(greetee: String) -> String {
        format!("Hello from Rust, {}!", greetee)
    }
}

bindings::export!(Component with_types_in bindings);
```

---

# Using it the browser with jco
- javascript toolchain for WebAssembly Component runtime
- handles both hosting and guesting
- `jco componentize` creates guest components from javascript
- `jco transpile` creates an ES module wrapper to host a component

---

# [Demo time!](./demo1.html)

---

# Let's talk imports
## Where do they come from?
- Provided by host
- Provided by another component
- **Component composition**

---

# Hello, with imports
```wit
package component:composed-hello-world;

/// An example world for the component to target.
world example {
  import additional-greeting: func() -> string;
  export greet: func(greetee: string) -> string;
}
```

---

## A component which exports `additional-greeting`
```wit
package local:additional-greeting;

world additional-greeting {
  export additional-greeting: func() -> string;
}
```
---

# Implementing `additional-greeting` in Go
```golang
package main

import (
	"additionalgreeting/internal/local/additional-greeting/additional-greeting"
)

func init() {
	additionalgreeting.Exports.AdditionalGreeting = func() string {
		return "Hello from Go!"
	}
}

func main() {}
```
---

# WAC - A tool for composing WebAssembly Components
- **socket** - A component with an (unsatisified import)
- **plug** - A component with an export that matches the socket
- `wac` composes plug components into socket components to produce a composed component
- simple scenarios "just work"
- a configuration language can handle more complex scenarios

---

# Composition [demo](demo2.html)

---

# But I thought you said "Beyond the Browser"

---

# WASI

- WebAssembly System Interface
- Standardized API for WebAssembly to interact with the operating system
- Enables WebAssembly modules to run outside browsers

---

# WASI Evolution

- WASI Preview 1 (2019): First specification with basic system calls
  - modeled after POSIX C api
- WASI Preview 2: Components-based approach
- More expressive interfaces through WIT
- Multiple interface groups:
  - wasi-cli: Command-line functionality
  - wasi-http: HTTP client/server capabilities
  - wasi-io: Input/output operations
  - wasi-filesystem: File system access

---

# Why WASI Matters

- Portable binary execution across platforms
- Same security sandboxing as browser WebAssembly
- Lower resource usage than containers
- Language agnostic: write in any supported language
- Enables WebAssembly to be a universal runtime for apps and services

---

# WASI Security Model

- Capability-based security: explicit permissions
  - no priviliges are the default
- No ambient authority (no global system access)
- Fine-grained control over resources
- Pre-opened file descriptors
- Directory-based sandboxing

---

# Hello server

---

# Software extensibility
### How do we do it today?
- Webhooks
- API calls

---

# Problems
- Latency
- Complexity
- Documentation
- SDK development

---

## What if we could let our customers give us code to
**safely** execute in the language of their choice

---

# Example: WasmCommerce
- A 100% vibe coded ecommerce platform!
- Now with customer provided shipping calculation!

---

# Replacing containers

---

# Spin demo

---

# Universal libraries

---