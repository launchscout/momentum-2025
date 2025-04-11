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
# Agenda
## WebAssembly Components
- Why we need them
- What are they
- How to build them
- How to run them
- Use cases
- Future

---

# A brief history of WebAssembly
- 2015: WebAssembly project announced
- 2017: MVP released with support in all major browsers
- 2019: W3C recommendation status achieved
- 2019: WASI (WebAssembly System Interface) introduced
- 2022: Component Model proposal

---

# WebAssembly Origins
- Born from asm.js (Mozilla 2013)
- Designed to be a portable compilation target
- Created through collaboration between major browser vendors
- Goals: Speed, security, and platform independence

---

# From Binary to Ecosystem
- Started as a binary instruction format
- Evolved into a complete ecosystem
- Support expanded beyond browsers to server-side
- Growing language support: Rust, C/C++, AssemblyScript, and more
- Standardized text format (.wat) for human readability

---

# Limitations of Core WebAssembly
- No direct language interoperability
- Limited data types (only numbers)
- Manual memory management needed
- Each module is isolated
- Complex host bindings
- Challenging to use across language boundaries

---
# Saying hello from Core WebAssembly
- Let's allocate some shared memory
- passing pointers and offsets and lengths, oh my!
- oh yeah, we should figure out what encoding to use
- Are you sad yet?

---

# WebAssembly Components
- Higher-level abstraction on top of core WebAssembly
- Enables language-agnostic interfaces
- Standardized way to share complex data between modules
- Simplifies interoperability between programming languages
- Better ergonomics for developers

---

# WIT (WebAssembly Interface Types)
- Human-readable interface description language
- Describes components' interfaces
- Defines data types and functions
- Enables language-agnostic communication
- Powers the Component Model

---

# Hello WIT
```wit
package component:hello-world;

/// An example world for the component to target.
world example {
    export greet: func(greetee: string) -> string;
}
```

---

# Hello components

---

# Component composition

---

# Software extensibility

---

# Replacing containers

---

# Spin demo

---

# Universal libraries

---