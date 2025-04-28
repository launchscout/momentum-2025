mod bindings;

pub use bindings::wasi::http::types::{
    Fields, IncomingRequest, OutgoingBody, OutgoingResponse, ResponseOutparam,
};

use bindings::greet;

struct Component;

impl bindings::exports::wasi::http::incoming_handler::Guest for Component {
    fn handle(_request: IncomingRequest, response_out: ResponseOutparam) {
      let response = OutgoingResponse::new(Fields::new());
      response.set_status_code(200).unwrap();
      let response_body = response.body().unwrap();
      response_body
          .write()
          .unwrap()
          .blocking_write_and_flush(greet("Fiends").as_bytes())
          .unwrap();
      OutgoingBody::finish(response_body, None).expect("failed to finish response body");
      ResponseOutparam::set(response_out, Ok(response));
    }
}

bindings::export!(Component with_types_in bindings);
