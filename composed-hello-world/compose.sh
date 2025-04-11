wac plug target/wasm32-wasip1/release/composed_hello_world.wasm --plug ../additional-greeting/additional-greeting.wasm -o composed-hello-world.wasm
jco transpile composed-hello-world.wasm -o .