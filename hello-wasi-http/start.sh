cargo component build --release
wac plug target/wasm32-wasip1/release/hello_wasi_http.wasm --plug ../composed-hello-world/composed-hello-world.wasm -o hello_composed_http.wasm
wasmtime serve -S cli=y hello_composed_http.wasm
