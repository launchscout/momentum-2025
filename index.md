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
@superchris.launchscout.com (BlueSky)
github.com/superchris
![h:200](/images/full-color.png#title-slide-logo)

---

# Agenda
## WebAssembly Components
- What and Why
- Building and running
- Use cases
- Future

---

<!-- _footer: '![](images/full-color.png)' -->

# What is WebAssembly?
- A binary instruction format for a stack-based virtual machine
- Portable compilation target for programming languages
- Standardized by W3C
- Supported by all three browsers since 2017
- WASI standardizes server side WebAssembly since 2019

---

<!-- _footer: '![](images/full-color.png)' -->

# WebAssembly Core (3.0)
- Supports only:
  - numeric types
  - functions
  - linear memory
  - external references
  - strings (javascript only)
- Linear memory
  - Your job to manage
  - Your job to figure out what to put there

---

<!-- _footer: '![](images/full-color.png)' -->

# Complex data types in WebAssembly
- Let's allocate some shared memory
- Let's figure out how we wanna encode it
- Passing pointers and offsets and lengths, oh my!
- Are you sad yet?

---

<!-- _footer: '![](images/full-color.png)' -->

# WebAssembly Components
- Higher-level abstraction layer on top of core WebAssembly
- Emerged out of WASI (P2)
- Enables language-agnostic type system
- Establishes canonical ABI
  - how to map high level types to memory
- Enables language-agnostic communication

---

# WASM Component Glossary

## Hosts
Runtime environment that provides services and executes a WASM component
## Guests
The component itselt that is "hosted" by a runtime environment

---

<!-- _footer: '![](images/full-color.png)' -->

# WIT (WebAssembly Interface Types)
- Interface Definition Language
- Describes components' interfaces
- Function imports and exports
- User defined data types

---

# WIT structure
- package - top level container of the form `namespace:name@version` 
- worlds - specifies the "contract" for a component and contains
  - exports - functions (or interfaces) provided **by** a component
  - imports - functions (or interfaces) provided **to** a component
- interfaces - named group of types and functions
- types

---

# WIT types
- Primitive types
  - u8, u16, u32, u64, s8, s16, s32, s64, f32, f64
  - bool, char, string
- Compound types
  - lists, tuples, options, results
- User Defined Types
  - records, variants, enums, flags, 
- Resources
  - references to things that live outside the component

---

# Language support
- Rust
- Javascript
- C/C++
- C# (.NET)
- Go
- Python
- Moonbit, Grain
- Elixir (host only)
- Ruby (host only)

---

# Hello World WIT
```wit
package component:hello-world;

world hello-world {
    export greet: func(greetee: string) -> string;
}
```

---

# Implementing Hello world in Rust
## Step 1: generate bindings
```
cargo component bindings
```

---
# Implement the component
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

# Build
```
cargo component build
```

---

# Now we need a runtime...
## Guess what: we already have one!

---

# WASM Components in the browser with jco
- javascript toolchain for WebAssembly Component runtime
- handles both hosting and guesting
- `jco componentize` creates guest components from javascript
- `jco transpile` creates an ES module wrapper for our component

---
# Using our wrapper in the browser
```html
<head>
  <script type="importmap">
    ...
  </script>
  <script type="module">
    import { greet } from './hello-world/hello_world.js';
    document.getElementById('greeting').innerHTML = greet("World");
  </script>
</head>

<body>
  <h1 id="greeting"></h1>
</body>
```
---

# [Demo time!](./demo1.html)
- change some code in `hello-world/src/lib.rs`
- run build.sh

---

# WASM Component imports
## Where do they come from?
- Provided by host
- Provided by another component
- **Component composition**

---

# Hello, with imports
```wit
package component:composed-hello-world;

world composed-hello-world {
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
# Our Rust component, now calling an import
```rust
#[allow(warnings)]
mod bindings;

use bindings::Guest;
use bindings::additional_greeting;

struct Component;

impl Guest for Component {
    /// Say hello!
    fn greet(greetee: String) -> String {
        format!("Hello from Rust, {} and {}!", greetee, additional_greeting())
    }
}

bindings::export!(Component with_types_in bindings);

```
---

# WAC - A tool for composing WebAssembly Components
- **socket** - A component with an (unsatisified import)
- **plug** - A component with an export that matches the socket
- `wac` composes plug components into socket components to produce a composed component
- simple scenarios "just work"
- a configuration language can handle more complex scenarios

---

# A component [turducken](demo2.html)
- Make a change in `additional-greeting/main.go`
- Run `additional-greeting/build.sh`
  - builds the go component
- Run `composed-hello-world/build.sh`
  - builds the rust wrapper component
  - runs wac to build the composed component

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

# WASI Security Model
- Zero priviliges are the default
  - Component can only call imports
- Capability-based security: explicit permissions to allow imports
- Granting permissions is runtime specific

---

# Let's serve our component!
```wit
package demo:hello-wasi-http;

world hello-wasi-http {
  import greet: func(greetee: string) -> string;
  include wasi:http/proxy@0.2.3;
}
```

---
# A peek inside `wasi:http/proxy`
### *very greatly* simplified
```
interface incoming-handler {
  use types.{incoming-request, response-outparam};
  handle: func(request: incoming-request, response-out: response-outparam);
}

world proxy {
  export incoming-handler;
}
```

---
# Implementing in Rust
```rust
use bindings::greet;

impl bindings::exports::wasi::http::incoming_handler::Guest for Component {
    fn handle(_request: IncomingRequest, response_out: ResponseOutparam) {
      let response = OutgoingResponse::new(Fields::new());
      response.set_status_code(200).unwrap();
      let response_body = response.body().unwrap();
      response_body
          .write()
          .unwrap()
          .blocking_write_and_flush(greet("Friends").as_bytes())
          .unwrap();
      OutgoingBody::finish(response_body, None).expect("failed to finish response body");
      ResponseOutparam::set(response_out, Ok(response));
    }
}
```
---

# wasmtime
- runtime which supports the component model
- run - invokes a component
- serve - serves a component over http

---

# Hello [server](http://localhost:8081)
- change some code
- Run start.sh

---

# Let's get practical!

---

# Use case #1: SAAS plugins
### How do we do it today?
- Webhooks
- API calls
- Customer provided code
  - Lua, javascript, etc
  - DSL or custom language

---

# Problems
- Latency
- Complexity
- Security
- Documentation
- Language choice

---

# Solution: WebAssembly Components
- customer provided code
- language agnostic
- securely sandboxed runtime

---

# Example: [WasmCommerce](http://localhost:4000)
### A 100% vibe coded ecommerce platform (Elixir)

---

<!-- _footer: '![](images/full-color.png)' -->

# Let's add custom shipping calculation
- We want to see the result immediately on the order screen
- Latency is a problem
- webhooks/API calls are not ideal

---

<!-- _footer: '![](images/full-color.png)' -->

# A shipping calculator WebAssembly component
```wit
package wasm:commerce;

world shipping-calculator-component {

  export calculate-shipping: func(order: order) -> u32;

  record order {
    id: u32,
    customer: customer,
    status: string,
    total-cents: u32,  // in cents
    line-items: list<line-item>
  }

  record customer {
    id: u32,
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zip: string
  }
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Continued...

```wit
  record line-item {
    product-id: u32,
    product: product,
    quantity: u32,
    unit-price-cents: u32,  // in cents
    subtotal-cents: u32     // in cents
  }

  record product {
    id: u32,
    name: string,
    sku: string,
    price-cents: u32  // in cents
  }

}
```

---

# Let's try it!
- edit shipping-calculator.js
- run build.sh
- upload it in the admin

---

# Use case #2: Wassette
- Open source MCP server from Microsoft
- Add tools as WASM components
- Leverage the WASM security sandbox

---

# Let's teach Claude to generate a QR code!
## First we'll need a QR code genearator...
```wit
package component:qr-code;

world qr-code {
    /// Generate a QR code SVG from the given text or URL
    export generate-qr: func(input: string) -> result<string, string>;
    
    /// Generate a QR code with custom settings
    export generate-qr-custom: func(input: string, size: u32) -> result<string, string>;
    
}
```

---

# Let's add a QR Code
- fire up claude
- ask them to add a QR code to my slides

---

# Hosting for WASM components
- Fermyon Spin
- WasmCloud
- NGINX Unit
- MS Hyperlight WASM

---

# Components on the Edge
- Fastly
- Ferymon/Akamai
- WasmCloud/Akamai
- Edgee

---

# WASI P3
- Async!
- currently we have poll
  - only 1 component can poll at a time
  - everybody is blocked
- future, stream

---

# Questions?

---
