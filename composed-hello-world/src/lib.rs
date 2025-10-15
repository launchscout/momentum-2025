#[allow(warnings)]
mod bindings;

use bindings::Guest;
use bindings::additional_greeting;

struct Component;

impl Guest for Component {
    /// Say hello!
    fn greet(greetee: String) -> String {
        format!("Hello from Rust and {}, {}!", additional_greeting(), greetee)
    }
}

bindings::export!(Component with_types_in bindings);
