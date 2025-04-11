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
