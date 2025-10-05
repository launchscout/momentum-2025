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

  /* Small logo for all slides except title */
  section:not(:first-child)::after {
    content: '';
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 80px;
    height: 60px;
    background: url('images/full-color.png') no-repeat center;
    background-size: contain;
    z-index: 1000;
  }
---

## Extending the reach of Elixir with WebAssembly Components
Chris Nelson
@superchris
BlueSky: @superchris.launchscout.com
chris@launchscout.com
![h:200](images/full-color.png#title-slide-logo)

---

# About me
- Long time Elixir developer and fan
- Co-founder of Launch Scout
- Creator of LiveState
- Contributor to Wasmex

---

<!-- _footer: '![](images/full-color.png)' -->

# Agenda
- Intro to WASM components
  - how they are different from core WASM
  - why we need them
- Wasmex
  - using wasm components from wasmex
- What can we do with it?

---

# The naming conflict
## These may or may not be the components you are looking for...
### WebAssembly Components != Web Components

---

<!-- _footer: '![](images/full-color.png)' -->

# What is WebAssembly?
- A binary instruction format for a stack-based virtual machine
- Portable compilation target for programming languages
- Supported by all three browsers since 2017
- WASI standardizes server side WebAssembly since 2019

---

<!-- _footer: '![](images/full-color.png)' -->

# WebAssembly Core (2.0)
- Supports only:
  - numeric types
  - functions
  - linear memory
  - external references
- Linear memory
  - Your job to manage
  - Your job to figure out what to put there

---

<!-- _footer: '![](images/full-color.png)' -->

# Saying hello from WebAssembly
- Let's allocate some shared memory
- passing pointers and offsets and lengths, oh my!
- oh yeah, we should figure out what encoding to use
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

<!-- _footer: '![](images/full-color.png)' -->

# WIT (WebAssembly Interface Types)
- Interface Definition Language
- Describes components' interfaces
- Function imports and exports
- User defined data types

---

<!-- _footer: '![](images/full-color.png)' -->

# WIT structure
- package - top level container of the form `namespace:name@version` 
- worlds - specifies the "contract" for a component and contains
  - exports - functions (or interfaces) provided by a component
  - imports - functions (or interfaces) required by a component
- interfaces - named group of types and functions
- types

---

<!-- _footer: '![](images/full-color.png)' -->

# WIT types
- Primitive types
  - u8, u16, u32, u64, s8, s16, s32, s64, f32, f64
  - bool, char, string
- Compound types
  - lists, options, results, tuples
- User Defined Types
  - records, variants, enums, flags, 
- Resources
  - references to things that live outside the component

---

<!-- _footer: '![](images/full-color.png)' -->

# Hello World WIT
```wit
package component:hello-world;

world hello-world {
    export greet: func(greetee: string) -> string;
}
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Language support
- Rust
- Javascript
- C/C++
- C# (.NET)
- Go
- Python
- WASM specific languages: Moonbit, Grain
- Elixir (host only)
- Ruby (host only)

---

<!-- _footer: '![](images/full-color.png)' -->

# HelloWorld in Rust
```rust
#[allow(warnings)]
mod bindings;

use bindings::Guest;

struct Component;

impl Guest for Component {
    /// Say hello!
    fn greet(greetee: String) -> String {
        format!("Hello from a WebAssembly Component, {}!", greetee)
    }
}

bindings::export!(Component with_types_in bindings);
```
```bash
cargo component build
```
---

<!-- _footer: '![](images/full-color.png)' -->

# WASM component security model
- Components can only can only call imported functions
  - 0 privilege by default
- WASI standardized host provided imports for:
  - clocks
  - random
  - filesystem
  - http
  - I/O
- enabling these is runtime specific

---

<!-- _footer: '![](images/full-color.png)' -->

# Introducing Wasmex
- Elixir wrapper for wasmtime
- Started by Philipp Tessenow (thanks Philipp!!)
- First release in 2020
- Originally supported core WebAssembly
- Supports components since 0.10

---

<!-- _footer: '![](images/full-color.png)' -->

# Wasmex component support
## Mapping types
<table>
  <tr>
    <th>WIT</th>
    <th>Elixir</th>
  </tr>
  <tr>
    <td>String, UXX, SXX, FloatXX, bool, List</td>
    <td>direct equivalent in Elixir</td>
  </tr>
  <tr>
    <td>Record</td>
    <td>map (structs TBD)</td>
  </tr>
  <tr>
    <td>Variant</td>
    <td>:atom or {:atom, value}</td>
  </tr>
  <tr>
    <td>Result</td>
    <td>{:ok, value} or {:error, value}</td>
  </tr>
  <tr>
    <td>Flags</td>
    <td>map of booleans</td>
  </tr>
  <tr>
    <td>Enum</td>
    <td>atom</td>
  </tr>
  <tr>
    <td>Option</td>
    <td>:none or {:some, value}</td>
  </tr>
</table>

---

<!-- _footer: '![](images/full-color.png)' -->

# Under the covers
- Uses rustler to talk to wasmtime
- function calls in both directions are async
  - rust threads
  - elixir processes
  - PR out for Tokio

---

<!-- _footer: '![](images/full-color.png)' -->

# How to Wasmex
## Step 1: Supervise your component
```elixir
defmodule HelloWasmex.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Wasmex.Components, path: "wherever/component.wasm", name: HelloWasmex}
    ]

    opts = [strategy: :one_for_one, name: HelloWasmex.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Calling functions
### "low level" api via `Wasmex.Components`
```elixir
iex>Wasmex.Components.call_function(pid, "function-name", [args])
{:ok, result}
```

---

<!-- _footer: '![](images/full-color.png)' -->

## More idiomatic Elixir
- use `Wasmex.Components.ComponentServer`
- Generates wrapper functions for all exported functions
```elixir
defmodule HelloWorld do
  use Wasmex.Components.ComponentServer,
    wit: "priv/wasm/hello-world.wit",
end

iex>HelloWorld.function_name(pid, arg1, arg2, ...)
{:ok, result}
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Getting practical
## What can we do with all this?
- [Leverage libraries from other languages](https://www.youtube.com/watch?v=pT3qkgzux1w)
- [Allowing other languages to benefit from OTP](https://www.youtube.com/watch?v=F-VyDJKWG_k)
- User extensible systems
  - I'm gonna focus here

---

<!-- _footer: '![](images/full-color.png)' -->

# Extensible systems
### How do we do it today?
- Webhooks
- API calls
- Customer provided code
  - Lua, javascript, etc
  - DSL or custom language

---

<!-- _footer: '![](images/full-color.png)' -->

# Problems
- Latency
- Complexity
- Documentation
- Language choice
- Security

---

<!-- _footer: '![](images/full-color.png)' -->

# Solution: WebAssembly Components
- customer provided code
- language agnostic
- securely sandboxed runtime

---

<!-- _footer: '![](images/full-color.png)' -->

# Example: [WasmCommerce](http://localhost:4000)
### A ~~100%~~ mostly vibe coded ecommerce platform

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

<!-- _footer: '![](images/full-color.png)' -->

# Using our Shipping Calculator component...
### Our elixir wrapper module
```elixir
defmodule WasmCommerce.Orders.ShippingCalculator do
  use Wasmex.Components.ComponentServer,
    wit: "wasm/shipping-calculator.wit"

  def calculate_shipping(order), do: calculate_shipping(__MODULE__, order)
end
```
### orders.ex
```elixir
  def shipping_amount(order) do
    {:ok, shipping_cents} = ShippingCalculator.calculate_shipping(order |> convert_fields())
    Decimal.from_float(shipping_cents / 100)
  end
```
---

<!-- _footer: '![](images/full-color.png)' -->

# Supervising our component
```elixir
defmodule WasmCommerce.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {WasmCommerce.Orders.ShippingCalculator,
       path: "priv/wasm/shipping-calculator.wasm", wasi: %Wasmex.Wasi.WasiP2Options{},
       name: WasmCommerce.Orders.ShippingCalculator},
    ...
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Let's write some javascript at Elixirconf!!!

---

<!-- _footer: '![](images/full-color.png)' -->

# Calling Elixir from components
### We can import as well as export...
```wit
package wasm:commerce;

world shipping-calculator-component {

  import product-surcharge: func(product: product) -> u32;

  export calculate-shipping: func(order: order) -> u32;
```

---
# Providing the imports from Elixir
```elixir
defmodule WasmCommerce.Orders.ShippingCalculator do
  use Wasmex.Components.ComponentServer,
    wit: "wasm/shipping-calculator.wit",
    imports: %{
      "product-surcharge" => {:fn, &get_product_surcharge/1}
    }

  def calculate_shipping(order), do: calculate_shipping(__MODULE__, order)

  def get_product_surcharge(%{name: product_name}) do
    if String.contains?(product_name, "Premium") do
      500
    else
      0
    end
  end
end
```
---

<!-- _footer: '![](images/full-color.png)' -->

# Let's add surcharges!

---

<!-- _footer: '![](images/full-color.png)' -->

# Calling the outside word
- WASI provides standard imports for http
- JCO maps fetch to WASI http
- This means can can make requests in our js component
- We just need to allow it!
### application.ex
```elixir
children = [
  {WasmCommerce.Orders.ShippingCalculator,
    path: "priv/wasm/shipping-calculator.wasm", wasi: %Wasmex.Wasi.WasiP2Options{allow_http: true},
    name: WasmCommerce.Orders.ShippingCalculator},
...
```

---

<!-- _footer: '![](images/full-color.png)' -->

# Let's make a sunny day discount!

---

<!-- _footer: '![](images/full-color.png)' -->

# Future stuff!

---

<!-- _footer: '![](images/full-color.png)' -->

# WASI P3
- Async functions in components
- will likely require some wasmex changes

---

<!-- _footer: '![](images/full-color.png)' -->

# What about creating components in Elixir?
- Popcorn lets us write (core) wasm in Elixir
- Builds on top of AtomVM
- Supporting WASM components would mainly be mapping types
- If you are interested, let's talk!

---

<!-- _footer: '![](images/full-color.png)' -->

# Thanks!

## Repository
![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://github.com/launchscout/elixirconf-2025)

https://github.com/launchscout/elixirconf-2025

---