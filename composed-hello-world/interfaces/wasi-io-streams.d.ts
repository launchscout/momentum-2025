export namespace WasiIoStreams {
  export { OutputStream };
}
import type { Error } from './wasi-io-error.js';
export { Error };
export type StreamError = StreamErrorLastOperationFailed | StreamErrorClosed;
export interface StreamErrorLastOperationFailed {
  tag: 'last-operation-failed',
  val: Error,
}
export interface StreamErrorClosed {
  tag: 'closed',
}

export class OutputStream {
  blockingWriteAndFlush(contents: Uint8Array): void;
}
