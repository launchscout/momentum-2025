import { environment, exit as exit$1, stderr, stdin, stdout } from '@bytecodealliance/preview2-shim/cli';
import { preopens, types } from '@bytecodealliance/preview2-shim/filesystem';
import { error, streams } from '@bytecodealliance/preview2-shim/io';
import { random } from '@bytecodealliance/preview2-shim/random';
const { getEnvironment } = environment;
const { exit } = exit$1;
const { getStderr } = stderr;
const { getStdin } = stdin;
const { getStdout } = stdout;
const { getDirectories } = preopens;
const { Descriptor,
  filesystemErrorCode } = types;
const { Error: Error$1,
  Error: Error$2 } = error;
const { InputStream,
  OutputStream,
  OutputStream: OutputStream$1 } = streams;
const { getRandomU64 } = random;

const base64Compile = str => WebAssembly.compile(typeof Buffer !== 'undefined' ? Buffer.from(str, 'base64') : Uint8Array.from(atob(str), b => b.charCodeAt(0)));

let curResourceBorrows = [];

let dv = new DataView(new ArrayBuffer());
const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile (url) {
  if (isNode) {
    _fs = _fs || await import('fs/promises');
    return WebAssembly.compile(await _fs.readFile(url));
  }
  return fetch(url).then(WebAssembly.compileStreaming);
}

function getErrorPayload(e) {
  if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
  if (e instanceof Error) throw e;
  return e;
}

const handleTables = [];

const hasOwnProperty = Object.prototype.hasOwnProperty;

const instantiateCore = WebAssembly.instantiate;

const T_FLAG = 1 << 30;

function rscTableCreateOwn (table, rep) {
  const free = table[0] & ~T_FLAG;
  if (free === 0) {
    table.push(0);
    table.push(rep | T_FLAG);
    return (table.length >> 1) - 1;
  }
  table[0] = table[free << 1];
  table[free << 1] = 0;
  table[(free << 1) + 1] = rep | T_FLAG;
  return free;
}

function rscTableRemove (table, handle) {
  const scope = table[handle << 1];
  const val = table[(handle << 1) + 1];
  const own = (val & T_FLAG) !== 0;
  const rep = val & ~T_FLAG;
  if (val === 0 || (scope & T_FLAG) !== 0) throw new TypeError('Invalid handle');
  table[handle << 1] = table[0] | T_FLAG;
  table[0] = handle | T_FLAG;
  return { rep, scope, own };
}

const symbolCabiDispose = Symbol.for('cabiDispose');

const symbolRscHandle = Symbol('handle');

const symbolRscRep = Symbol.for('cabiRep');

const symbolDispose = Symbol.dispose || Symbol.for('dispose');

const toUint64 = val => BigInt.asUintN(64, BigInt(val));

function toUint32(val) {
  return val >>> 0;
}

const utf8Decoder = new TextDecoder();

const utf8Encoder = new TextEncoder();

let utf8EncodedLen = 0;
function utf8Encode(s, realloc, memory) {
  if (typeof s !== 'string') throw new TypeError('expected a string');
  if (s.length === 0) {
    utf8EncodedLen = 0;
    return 1;
  }
  let buf = utf8Encoder.encode(s);
  let ptr = realloc(0, 0, 1, buf.length);
  new Uint8Array(memory.buffer).set(buf, ptr);
  utf8EncodedLen = buf.length;
  return ptr;
}


let exports0;
const handleTable6 = [T_FLAG, 0];
const captureTable5= new Map();
let captureCnt5 = 0;
handleTables[6] = handleTable6;

function trampoline0() {
  const ret = getStdout();
  if (!(ret instanceof OutputStream)) {
    throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
  }
  var handle0 = ret[symbolRscHandle];
  if (!handle0) {
    const rep = ret[symbolRscRep] || ++captureCnt5;
    captureTable5.set(rep, ret);
    handle0 = rscTableCreateOwn(handleTable6, rep);
  }
  return handle0;
}

function trampoline1() {
  const ret = getRandomU64();
  return toUint64(ret);
}
let exports1;
let memory0;
const handleTable7 = [T_FLAG, 0];
const captureTable4= new Map();
let captureCnt4 = 0;
handleTables[7] = handleTable7;

function trampoline2(arg0, arg1, arg2, arg3) {
  var handle1 = arg0;
  var rep2 = handleTable6[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable5.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(OutputStream.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  var ptr3 = arg1;
  var len3 = arg2;
  var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.blockingWriteAndFlush(result3)};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant6 = ret;
  switch (variant6.tag) {
    case 'ok': {
      const e = variant6.val;
      dataView(memory0).setInt8(arg3 + 0, 0, true);
      break;
    }
    case 'err': {
      const e = variant6.val;
      dataView(memory0).setInt8(arg3 + 0, 1, true);
      var variant5 = e;
      switch (variant5.tag) {
        case 'last-operation-failed': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg3 + 4, 0, true);
          if (!(e instanceof Error$1)) {
            throw new TypeError('Resource error: Not a valid "Error" resource.');
          }
          var handle4 = e[symbolRscHandle];
          if (!handle4) {
            const rep = e[symbolRscRep] || ++captureCnt4;
            captureTable4.set(rep, e);
            handle4 = rscTableCreateOwn(handleTable7, rep);
          }
          dataView(memory0).setInt32(arg3 + 8, handle4, true);
          break;
        }
        case 'closed': {
          dataView(memory0).setInt8(arg3 + 4, 1, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
        }
      }
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
let exports2;
let exports3;
let exports4;
let exports5;
const handleTable9 = [T_FLAG, 0];
const captureTable1= new Map();
let captureCnt1 = 0;
handleTables[9] = handleTable9;

function trampoline7() {
  const ret = getStderr();
  if (!(ret instanceof OutputStream$1)) {
    throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
  }
  var handle0 = ret[symbolRscHandle];
  if (!handle0) {
    const rep = ret[symbolRscRep] || ++captureCnt1;
    captureTable1.set(rep, ret);
    handle0 = rscTableCreateOwn(handleTable9, rep);
  }
  return handle0;
}
const handleTable10 = [T_FLAG, 0];
const captureTable2= new Map();
let captureCnt2 = 0;
handleTables[10] = handleTable10;

function trampoline8() {
  const ret = getStdin();
  if (!(ret instanceof InputStream)) {
    throw new TypeError('Resource error: Not a valid "InputStream" resource.');
  }
  var handle0 = ret[symbolRscHandle];
  if (!handle0) {
    const rep = ret[symbolRscRep] || ++captureCnt2;
    captureTable2.set(rep, ret);
    handle0 = rscTableCreateOwn(handleTable10, rep);
  }
  return handle0;
}

function trampoline9() {
  const ret = getStdout();
  if (!(ret instanceof OutputStream$1)) {
    throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
  }
  var handle0 = ret[symbolRscHandle];
  if (!handle0) {
    const rep = ret[symbolRscRep] || ++captureCnt1;
    captureTable1.set(rep, ret);
    handle0 = rscTableCreateOwn(handleTable9, rep);
  }
  return handle0;
}

function trampoline10(arg0) {
  let variant0;
  switch (arg0) {
    case 0: {
      variant0= {
        tag: 'ok',
        val: undefined
      };
      break;
    }
    case 1: {
      variant0= {
        tag: 'err',
        val: undefined
      };
      break;
    }
    default: {
      throw new TypeError('invalid variant discriminant for expected');
    }
  }
  exit(variant0);
}
let exports6;
let memory1;
let exports7;
let realloc0;

function trampoline12(arg0) {
  const ret = getEnvironment();
  var vec3 = ret;
  var len3 = vec3.length;
  var result3 = realloc0(0, 0, 4, len3 * 16);
  for (let i = 0; i < vec3.length; i++) {
    const e = vec3[i];
    const base = result3 + i * 16;var [tuple0_0, tuple0_1] = e;
    var ptr1 = utf8Encode(tuple0_0, realloc0, memory1);
    var len1 = utf8EncodedLen;
    dataView(memory1).setInt32(base + 4, len1, true);
    dataView(memory1).setInt32(base + 0, ptr1, true);
    var ptr2 = utf8Encode(tuple0_1, realloc0, memory1);
    var len2 = utf8EncodedLen;
    dataView(memory1).setInt32(base + 12, len2, true);
    dataView(memory1).setInt32(base + 8, ptr2, true);
  }
  dataView(memory1).setInt32(arg0 + 4, len3, true);
  dataView(memory1).setInt32(arg0 + 0, result3, true);
}
const handleTable11 = [T_FLAG, 0];
const captureTable0= new Map();
let captureCnt0 = 0;
handleTables[11] = handleTable11;

function trampoline13(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable0.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(Error$2.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  const ret = filesystemErrorCode(rsc0);
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant4 = ret;
  if (variant4 === null || variant4=== undefined) {
    dataView(memory1).setInt8(arg1 + 0, 0, true);
  } else {
    const e = variant4;
    dataView(memory1).setInt8(arg1 + 0, 1, true);
    var val3 = e;
    let enum3;
    switch (val3) {
      case 'access': {
        enum3 = 0;
        break;
      }
      case 'would-block': {
        enum3 = 1;
        break;
      }
      case 'already': {
        enum3 = 2;
        break;
      }
      case 'bad-descriptor': {
        enum3 = 3;
        break;
      }
      case 'busy': {
        enum3 = 4;
        break;
      }
      case 'deadlock': {
        enum3 = 5;
        break;
      }
      case 'quota': {
        enum3 = 6;
        break;
      }
      case 'exist': {
        enum3 = 7;
        break;
      }
      case 'file-too-large': {
        enum3 = 8;
        break;
      }
      case 'illegal-byte-sequence': {
        enum3 = 9;
        break;
      }
      case 'in-progress': {
        enum3 = 10;
        break;
      }
      case 'interrupted': {
        enum3 = 11;
        break;
      }
      case 'invalid': {
        enum3 = 12;
        break;
      }
      case 'io': {
        enum3 = 13;
        break;
      }
      case 'is-directory': {
        enum3 = 14;
        break;
      }
      case 'loop': {
        enum3 = 15;
        break;
      }
      case 'too-many-links': {
        enum3 = 16;
        break;
      }
      case 'message-size': {
        enum3 = 17;
        break;
      }
      case 'name-too-long': {
        enum3 = 18;
        break;
      }
      case 'no-device': {
        enum3 = 19;
        break;
      }
      case 'no-entry': {
        enum3 = 20;
        break;
      }
      case 'no-lock': {
        enum3 = 21;
        break;
      }
      case 'insufficient-memory': {
        enum3 = 22;
        break;
      }
      case 'insufficient-space': {
        enum3 = 23;
        break;
      }
      case 'not-directory': {
        enum3 = 24;
        break;
      }
      case 'not-empty': {
        enum3 = 25;
        break;
      }
      case 'not-recoverable': {
        enum3 = 26;
        break;
      }
      case 'unsupported': {
        enum3 = 27;
        break;
      }
      case 'no-tty': {
        enum3 = 28;
        break;
      }
      case 'no-such-device': {
        enum3 = 29;
        break;
      }
      case 'overflow': {
        enum3 = 30;
        break;
      }
      case 'not-permitted': {
        enum3 = 31;
        break;
      }
      case 'pipe': {
        enum3 = 32;
        break;
      }
      case 'read-only': {
        enum3 = 33;
        break;
      }
      case 'invalid-seek': {
        enum3 = 34;
        break;
      }
      case 'text-file-busy': {
        enum3 = 35;
        break;
      }
      case 'cross-device': {
        enum3 = 36;
        break;
      }
      default: {
        if ((e) instanceof Error) {
          console.error(e);
        }
        
        throw new TypeError(`"${val3}" is not one of the cases of error-code`);
      }
    }
    dataView(memory1).setInt8(arg1 + 1, enum3, true);
  }
}
const handleTable8 = [T_FLAG, 0];
const captureTable3= new Map();
let captureCnt3 = 0;
handleTables[8] = handleTable8;

function trampoline14(arg0, arg1, arg2) {
  var handle1 = arg0;
  var rep2 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable3.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(Descriptor.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.writeViaStream(BigInt.asUintN(64, arg1))};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant5 = ret;
  switch (variant5.tag) {
    case 'ok': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg2 + 0, 0, true);
      if (!(e instanceof OutputStream$1)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle3 = e[symbolRscHandle];
      if (!handle3) {
        const rep = e[symbolRscRep] || ++captureCnt1;
        captureTable1.set(rep, e);
        handle3 = rscTableCreateOwn(handleTable9, rep);
      }
      dataView(memory1).setInt32(arg2 + 4, handle3, true);
      break;
    }
    case 'err': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg2 + 0, 1, true);
      var val4 = e;
      let enum4;
      switch (val4) {
        case 'access': {
          enum4 = 0;
          break;
        }
        case 'would-block': {
          enum4 = 1;
          break;
        }
        case 'already': {
          enum4 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum4 = 3;
          break;
        }
        case 'busy': {
          enum4 = 4;
          break;
        }
        case 'deadlock': {
          enum4 = 5;
          break;
        }
        case 'quota': {
          enum4 = 6;
          break;
        }
        case 'exist': {
          enum4 = 7;
          break;
        }
        case 'file-too-large': {
          enum4 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum4 = 9;
          break;
        }
        case 'in-progress': {
          enum4 = 10;
          break;
        }
        case 'interrupted': {
          enum4 = 11;
          break;
        }
        case 'invalid': {
          enum4 = 12;
          break;
        }
        case 'io': {
          enum4 = 13;
          break;
        }
        case 'is-directory': {
          enum4 = 14;
          break;
        }
        case 'loop': {
          enum4 = 15;
          break;
        }
        case 'too-many-links': {
          enum4 = 16;
          break;
        }
        case 'message-size': {
          enum4 = 17;
          break;
        }
        case 'name-too-long': {
          enum4 = 18;
          break;
        }
        case 'no-device': {
          enum4 = 19;
          break;
        }
        case 'no-entry': {
          enum4 = 20;
          break;
        }
        case 'no-lock': {
          enum4 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum4 = 22;
          break;
        }
        case 'insufficient-space': {
          enum4 = 23;
          break;
        }
        case 'not-directory': {
          enum4 = 24;
          break;
        }
        case 'not-empty': {
          enum4 = 25;
          break;
        }
        case 'not-recoverable': {
          enum4 = 26;
          break;
        }
        case 'unsupported': {
          enum4 = 27;
          break;
        }
        case 'no-tty': {
          enum4 = 28;
          break;
        }
        case 'no-such-device': {
          enum4 = 29;
          break;
        }
        case 'overflow': {
          enum4 = 30;
          break;
        }
        case 'not-permitted': {
          enum4 = 31;
          break;
        }
        case 'pipe': {
          enum4 = 32;
          break;
        }
        case 'read-only': {
          enum4 = 33;
          break;
        }
        case 'invalid-seek': {
          enum4 = 34;
          break;
        }
        case 'text-file-busy': {
          enum4 = 35;
          break;
        }
        case 'cross-device': {
          enum4 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val4}" is not one of the cases of error-code`);
        }
      }
      dataView(memory1).setInt8(arg2 + 4, enum4, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline15(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable3.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(Descriptor.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.appendViaStream()};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant5 = ret;
  switch (variant5.tag) {
    case 'ok': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 0, true);
      if (!(e instanceof OutputStream$1)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle3 = e[symbolRscHandle];
      if (!handle3) {
        const rep = e[symbolRscRep] || ++captureCnt1;
        captureTable1.set(rep, e);
        handle3 = rscTableCreateOwn(handleTable9, rep);
      }
      dataView(memory1).setInt32(arg1 + 4, handle3, true);
      break;
    }
    case 'err': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 1, true);
      var val4 = e;
      let enum4;
      switch (val4) {
        case 'access': {
          enum4 = 0;
          break;
        }
        case 'would-block': {
          enum4 = 1;
          break;
        }
        case 'already': {
          enum4 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum4 = 3;
          break;
        }
        case 'busy': {
          enum4 = 4;
          break;
        }
        case 'deadlock': {
          enum4 = 5;
          break;
        }
        case 'quota': {
          enum4 = 6;
          break;
        }
        case 'exist': {
          enum4 = 7;
          break;
        }
        case 'file-too-large': {
          enum4 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum4 = 9;
          break;
        }
        case 'in-progress': {
          enum4 = 10;
          break;
        }
        case 'interrupted': {
          enum4 = 11;
          break;
        }
        case 'invalid': {
          enum4 = 12;
          break;
        }
        case 'io': {
          enum4 = 13;
          break;
        }
        case 'is-directory': {
          enum4 = 14;
          break;
        }
        case 'loop': {
          enum4 = 15;
          break;
        }
        case 'too-many-links': {
          enum4 = 16;
          break;
        }
        case 'message-size': {
          enum4 = 17;
          break;
        }
        case 'name-too-long': {
          enum4 = 18;
          break;
        }
        case 'no-device': {
          enum4 = 19;
          break;
        }
        case 'no-entry': {
          enum4 = 20;
          break;
        }
        case 'no-lock': {
          enum4 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum4 = 22;
          break;
        }
        case 'insufficient-space': {
          enum4 = 23;
          break;
        }
        case 'not-directory': {
          enum4 = 24;
          break;
        }
        case 'not-empty': {
          enum4 = 25;
          break;
        }
        case 'not-recoverable': {
          enum4 = 26;
          break;
        }
        case 'unsupported': {
          enum4 = 27;
          break;
        }
        case 'no-tty': {
          enum4 = 28;
          break;
        }
        case 'no-such-device': {
          enum4 = 29;
          break;
        }
        case 'overflow': {
          enum4 = 30;
          break;
        }
        case 'not-permitted': {
          enum4 = 31;
          break;
        }
        case 'pipe': {
          enum4 = 32;
          break;
        }
        case 'read-only': {
          enum4 = 33;
          break;
        }
        case 'invalid-seek': {
          enum4 = 34;
          break;
        }
        case 'text-file-busy': {
          enum4 = 35;
          break;
        }
        case 'cross-device': {
          enum4 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val4}" is not one of the cases of error-code`);
        }
      }
      dataView(memory1).setInt8(arg1 + 4, enum4, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline16(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable3.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(Descriptor.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.getType()};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant5 = ret;
  switch (variant5.tag) {
    case 'ok': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 0, true);
      var val3 = e;
      let enum3;
      switch (val3) {
        case 'unknown': {
          enum3 = 0;
          break;
        }
        case 'block-device': {
          enum3 = 1;
          break;
        }
        case 'character-device': {
          enum3 = 2;
          break;
        }
        case 'directory': {
          enum3 = 3;
          break;
        }
        case 'fifo': {
          enum3 = 4;
          break;
        }
        case 'symbolic-link': {
          enum3 = 5;
          break;
        }
        case 'regular-file': {
          enum3 = 6;
          break;
        }
        case 'socket': {
          enum3 = 7;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val3}" is not one of the cases of descriptor-type`);
        }
      }
      dataView(memory1).setInt8(arg1 + 1, enum3, true);
      break;
    }
    case 'err': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 1, true);
      var val4 = e;
      let enum4;
      switch (val4) {
        case 'access': {
          enum4 = 0;
          break;
        }
        case 'would-block': {
          enum4 = 1;
          break;
        }
        case 'already': {
          enum4 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum4 = 3;
          break;
        }
        case 'busy': {
          enum4 = 4;
          break;
        }
        case 'deadlock': {
          enum4 = 5;
          break;
        }
        case 'quota': {
          enum4 = 6;
          break;
        }
        case 'exist': {
          enum4 = 7;
          break;
        }
        case 'file-too-large': {
          enum4 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum4 = 9;
          break;
        }
        case 'in-progress': {
          enum4 = 10;
          break;
        }
        case 'interrupted': {
          enum4 = 11;
          break;
        }
        case 'invalid': {
          enum4 = 12;
          break;
        }
        case 'io': {
          enum4 = 13;
          break;
        }
        case 'is-directory': {
          enum4 = 14;
          break;
        }
        case 'loop': {
          enum4 = 15;
          break;
        }
        case 'too-many-links': {
          enum4 = 16;
          break;
        }
        case 'message-size': {
          enum4 = 17;
          break;
        }
        case 'name-too-long': {
          enum4 = 18;
          break;
        }
        case 'no-device': {
          enum4 = 19;
          break;
        }
        case 'no-entry': {
          enum4 = 20;
          break;
        }
        case 'no-lock': {
          enum4 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum4 = 22;
          break;
        }
        case 'insufficient-space': {
          enum4 = 23;
          break;
        }
        case 'not-directory': {
          enum4 = 24;
          break;
        }
        case 'not-empty': {
          enum4 = 25;
          break;
        }
        case 'not-recoverable': {
          enum4 = 26;
          break;
        }
        case 'unsupported': {
          enum4 = 27;
          break;
        }
        case 'no-tty': {
          enum4 = 28;
          break;
        }
        case 'no-such-device': {
          enum4 = 29;
          break;
        }
        case 'overflow': {
          enum4 = 30;
          break;
        }
        case 'not-permitted': {
          enum4 = 31;
          break;
        }
        case 'pipe': {
          enum4 = 32;
          break;
        }
        case 'read-only': {
          enum4 = 33;
          break;
        }
        case 'invalid-seek': {
          enum4 = 34;
          break;
        }
        case 'text-file-busy': {
          enum4 = 35;
          break;
        }
        case 'cross-device': {
          enum4 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val4}" is not one of the cases of error-code`);
        }
      }
      dataView(memory1).setInt8(arg1 + 1, enum4, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline17(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable3.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(Descriptor.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.stat()};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant12 = ret;
  switch (variant12.tag) {
    case 'ok': {
      const e = variant12.val;
      dataView(memory1).setInt8(arg1 + 0, 0, true);
      var {type: v3_0, linkCount: v3_1, size: v3_2, dataAccessTimestamp: v3_3, dataModificationTimestamp: v3_4, statusChangeTimestamp: v3_5 } = e;
      var val4 = v3_0;
      let enum4;
      switch (val4) {
        case 'unknown': {
          enum4 = 0;
          break;
        }
        case 'block-device': {
          enum4 = 1;
          break;
        }
        case 'character-device': {
          enum4 = 2;
          break;
        }
        case 'directory': {
          enum4 = 3;
          break;
        }
        case 'fifo': {
          enum4 = 4;
          break;
        }
        case 'symbolic-link': {
          enum4 = 5;
          break;
        }
        case 'regular-file': {
          enum4 = 6;
          break;
        }
        case 'socket': {
          enum4 = 7;
          break;
        }
        default: {
          if ((v3_0) instanceof Error) {
            console.error(v3_0);
          }
          
          throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
        }
      }
      dataView(memory1).setInt8(arg1 + 8, enum4, true);
      dataView(memory1).setBigInt64(arg1 + 16, toUint64(v3_1), true);
      dataView(memory1).setBigInt64(arg1 + 24, toUint64(v3_2), true);
      var variant6 = v3_3;
      if (variant6 === null || variant6=== undefined) {
        dataView(memory1).setInt8(arg1 + 32, 0, true);
      } else {
        const e = variant6;
        dataView(memory1).setInt8(arg1 + 32, 1, true);
        var {seconds: v5_0, nanoseconds: v5_1 } = e;
        dataView(memory1).setBigInt64(arg1 + 40, toUint64(v5_0), true);
        dataView(memory1).setInt32(arg1 + 48, toUint32(v5_1), true);
      }
      var variant8 = v3_4;
      if (variant8 === null || variant8=== undefined) {
        dataView(memory1).setInt8(arg1 + 56, 0, true);
      } else {
        const e = variant8;
        dataView(memory1).setInt8(arg1 + 56, 1, true);
        var {seconds: v7_0, nanoseconds: v7_1 } = e;
        dataView(memory1).setBigInt64(arg1 + 64, toUint64(v7_0), true);
        dataView(memory1).setInt32(arg1 + 72, toUint32(v7_1), true);
      }
      var variant10 = v3_5;
      if (variant10 === null || variant10=== undefined) {
        dataView(memory1).setInt8(arg1 + 80, 0, true);
      } else {
        const e = variant10;
        dataView(memory1).setInt8(arg1 + 80, 1, true);
        var {seconds: v9_0, nanoseconds: v9_1 } = e;
        dataView(memory1).setBigInt64(arg1 + 88, toUint64(v9_0), true);
        dataView(memory1).setInt32(arg1 + 96, toUint32(v9_1), true);
      }
      break;
    }
    case 'err': {
      const e = variant12.val;
      dataView(memory1).setInt8(arg1 + 0, 1, true);
      var val11 = e;
      let enum11;
      switch (val11) {
        case 'access': {
          enum11 = 0;
          break;
        }
        case 'would-block': {
          enum11 = 1;
          break;
        }
        case 'already': {
          enum11 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum11 = 3;
          break;
        }
        case 'busy': {
          enum11 = 4;
          break;
        }
        case 'deadlock': {
          enum11 = 5;
          break;
        }
        case 'quota': {
          enum11 = 6;
          break;
        }
        case 'exist': {
          enum11 = 7;
          break;
        }
        case 'file-too-large': {
          enum11 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum11 = 9;
          break;
        }
        case 'in-progress': {
          enum11 = 10;
          break;
        }
        case 'interrupted': {
          enum11 = 11;
          break;
        }
        case 'invalid': {
          enum11 = 12;
          break;
        }
        case 'io': {
          enum11 = 13;
          break;
        }
        case 'is-directory': {
          enum11 = 14;
          break;
        }
        case 'loop': {
          enum11 = 15;
          break;
        }
        case 'too-many-links': {
          enum11 = 16;
          break;
        }
        case 'message-size': {
          enum11 = 17;
          break;
        }
        case 'name-too-long': {
          enum11 = 18;
          break;
        }
        case 'no-device': {
          enum11 = 19;
          break;
        }
        case 'no-entry': {
          enum11 = 20;
          break;
        }
        case 'no-lock': {
          enum11 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum11 = 22;
          break;
        }
        case 'insufficient-space': {
          enum11 = 23;
          break;
        }
        case 'not-directory': {
          enum11 = 24;
          break;
        }
        case 'not-empty': {
          enum11 = 25;
          break;
        }
        case 'not-recoverable': {
          enum11 = 26;
          break;
        }
        case 'unsupported': {
          enum11 = 27;
          break;
        }
        case 'no-tty': {
          enum11 = 28;
          break;
        }
        case 'no-such-device': {
          enum11 = 29;
          break;
        }
        case 'overflow': {
          enum11 = 30;
          break;
        }
        case 'not-permitted': {
          enum11 = 31;
          break;
        }
        case 'pipe': {
          enum11 = 32;
          break;
        }
        case 'read-only': {
          enum11 = 33;
          break;
        }
        case 'invalid-seek': {
          enum11 = 34;
          break;
        }
        case 'text-file-busy': {
          enum11 = 35;
          break;
        }
        case 'cross-device': {
          enum11 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val11}" is not one of the cases of error-code`);
        }
      }
      dataView(memory1).setInt8(arg1 + 8, enum11, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline18(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable1.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.checkWrite()};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant5 = ret;
  switch (variant5.tag) {
    case 'ok': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 0, true);
      dataView(memory1).setBigInt64(arg1 + 8, toUint64(e), true);
      break;
    }
    case 'err': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 1, true);
      var variant4 = e;
      switch (variant4.tag) {
        case 'last-operation-failed': {
          const e = variant4.val;
          dataView(memory1).setInt8(arg1 + 8, 0, true);
          if (!(e instanceof Error$2)) {
            throw new TypeError('Resource error: Not a valid "Error" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable11, rep);
          }
          dataView(memory1).setInt32(arg1 + 12, handle3, true);
          break;
        }
        case 'closed': {
          dataView(memory1).setInt8(arg1 + 8, 1, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
        }
      }
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline19(arg0, arg1, arg2, arg3) {
  var handle1 = arg0;
  var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable1.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  var ptr3 = arg1;
  var len3 = arg2;
  var result3 = new Uint8Array(memory1.buffer.slice(ptr3, ptr3 + len3 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.write(result3)};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant6 = ret;
  switch (variant6.tag) {
    case 'ok': {
      const e = variant6.val;
      dataView(memory1).setInt8(arg3 + 0, 0, true);
      break;
    }
    case 'err': {
      const e = variant6.val;
      dataView(memory1).setInt8(arg3 + 0, 1, true);
      var variant5 = e;
      switch (variant5.tag) {
        case 'last-operation-failed': {
          const e = variant5.val;
          dataView(memory1).setInt8(arg3 + 4, 0, true);
          if (!(e instanceof Error$2)) {
            throw new TypeError('Resource error: Not a valid "Error" resource.');
          }
          var handle4 = e[symbolRscHandle];
          if (!handle4) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle4 = rscTableCreateOwn(handleTable11, rep);
          }
          dataView(memory1).setInt32(arg3 + 8, handle4, true);
          break;
        }
        case 'closed': {
          dataView(memory1).setInt8(arg3 + 4, 1, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
        }
      }
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline20(arg0, arg1) {
  var handle1 = arg0;
  var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable1.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.blockingFlush()};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant5 = ret;
  switch (variant5.tag) {
    case 'ok': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 0, true);
      break;
    }
    case 'err': {
      const e = variant5.val;
      dataView(memory1).setInt8(arg1 + 0, 1, true);
      var variant4 = e;
      switch (variant4.tag) {
        case 'last-operation-failed': {
          const e = variant4.val;
          dataView(memory1).setInt8(arg1 + 4, 0, true);
          if (!(e instanceof Error$2)) {
            throw new TypeError('Resource error: Not a valid "Error" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable11, rep);
          }
          dataView(memory1).setInt32(arg1 + 8, handle3, true);
          break;
        }
        case 'closed': {
          dataView(memory1).setInt8(arg1 + 4, 1, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
        }
      }
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline21(arg0, arg1, arg2, arg3) {
  var handle1 = arg0;
  var rep2 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
  var rsc0 = captureTable1.get(rep2);
  if (!rsc0) {
    rsc0 = Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
  }
  curResourceBorrows.push(rsc0);
  var ptr3 = arg1;
  var len3 = arg2;
  var result3 = new Uint8Array(memory1.buffer.slice(ptr3, ptr3 + len3 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: rsc0.blockingWriteAndFlush(result3)};
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  for (const rsc of curResourceBorrows) {
    rsc[symbolRscHandle] = null;
  }
  curResourceBorrows = [];
  var variant6 = ret;
  switch (variant6.tag) {
    case 'ok': {
      const e = variant6.val;
      dataView(memory1).setInt8(arg3 + 0, 0, true);
      break;
    }
    case 'err': {
      const e = variant6.val;
      dataView(memory1).setInt8(arg3 + 0, 1, true);
      var variant5 = e;
      switch (variant5.tag) {
        case 'last-operation-failed': {
          const e = variant5.val;
          dataView(memory1).setInt8(arg3 + 4, 0, true);
          if (!(e instanceof Error$2)) {
            throw new TypeError('Resource error: Not a valid "Error" resource.');
          }
          var handle4 = e[symbolRscHandle];
          if (!handle4) {
            const rep = e[symbolRscRep] || ++captureCnt0;
            captureTable0.set(rep, e);
            handle4 = rscTableCreateOwn(handleTable11, rep);
          }
          dataView(memory1).setInt32(arg3 + 8, handle4, true);
          break;
        }
        case 'closed': {
          dataView(memory1).setInt8(arg3 + 4, 1, true);
          break;
        }
        default: {
          throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
        }
      }
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}

function trampoline22(arg0) {
  const ret = getDirectories();
  var vec3 = ret;
  var len3 = vec3.length;
  var result3 = realloc0(0, 0, 4, len3 * 12);
  for (let i = 0; i < vec3.length; i++) {
    const e = vec3[i];
    const base = result3 + i * 12;var [tuple0_0, tuple0_1] = e;
    if (!(tuple0_0 instanceof Descriptor)) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle1 = tuple0_0[symbolRscHandle];
    if (!handle1) {
      const rep = tuple0_0[symbolRscRep] || ++captureCnt3;
      captureTable3.set(rep, tuple0_0);
      handle1 = rscTableCreateOwn(handleTable8, rep);
    }
    dataView(memory1).setInt32(base + 0, handle1, true);
    var ptr2 = utf8Encode(tuple0_1, realloc0, memory1);
    var len2 = utf8EncodedLen;
    dataView(memory1).setInt32(base + 8, len2, true);
    dataView(memory1).setInt32(base + 4, ptr2, true);
  }
  dataView(memory1).setInt32(arg0 + 4, len3, true);
  dataView(memory1).setInt32(arg0 + 0, result3, true);
}
let exports8;
let realloc1;
let postReturn0;
function trampoline3(handle) {
  const handleEntry = rscTableRemove(handleTable8, handle);
  if (handleEntry.own) {
    
    const rsc = captureTable3.get(handleEntry.rep);
    if (rsc) {
      if (rsc[symbolDispose]) rsc[symbolDispose]();
      captureTable3.delete(handleEntry.rep);
    } else if (Descriptor[symbolCabiDispose]) {
      Descriptor[symbolCabiDispose](handleEntry.rep);
    }
  }
}
function trampoline4(handle) {
  const handleEntry = rscTableRemove(handleTable9, handle);
  if (handleEntry.own) {
    
    const rsc = captureTable1.get(handleEntry.rep);
    if (rsc) {
      if (rsc[symbolDispose]) rsc[symbolDispose]();
      captureTable1.delete(handleEntry.rep);
    } else if (OutputStream$1[symbolCabiDispose]) {
      OutputStream$1[symbolCabiDispose](handleEntry.rep);
    }
  }
}
function trampoline5(handle) {
  const handleEntry = rscTableRemove(handleTable11, handle);
  if (handleEntry.own) {
    
    const rsc = captureTable0.get(handleEntry.rep);
    if (rsc) {
      if (rsc[symbolDispose]) rsc[symbolDispose]();
      captureTable0.delete(handleEntry.rep);
    } else if (Error$2[symbolCabiDispose]) {
      Error$2[symbolCabiDispose](handleEntry.rep);
    }
  }
}
function trampoline6(handle) {
  const handleEntry = rscTableRemove(handleTable10, handle);
  if (handleEntry.own) {
    
    const rsc = captureTable2.get(handleEntry.rep);
    if (rsc) {
      if (rsc[symbolDispose]) rsc[symbolDispose]();
      captureTable2.delete(handleEntry.rep);
    } else if (InputStream[symbolCabiDispose]) {
      InputStream[symbolCabiDispose](handleEntry.rep);
    }
  }
}
function trampoline11(from_ptr, len, to_ptr) {
  new Uint8Array(memory1.buffer, to_ptr, len).set(new Uint8Array(memory0.buffer, from_ptr, len));
}


function greet(arg0) {
  var ptr0 = utf8Encode(arg0, realloc1, memory1);
  var len0 = utf8EncodedLen;
  const ret = exports5.greet(ptr0, len0);
  var ptr1 = dataView(memory1).getInt32(ret + 0, true);
  var len1 = dataView(memory1).getInt32(ret + 4, true);
  var result1 = utf8Decoder.decode(new Uint8Array(memory1.buffer, ptr1, len1));
  const retVal = result1;
  postReturn0(ret);
  return retVal;
}

const $init = (() => {
  let gen = (function* init () {
    const module0 = fetchCompile(new URL('./composed-hello-world.core.wasm', import.meta.url));
    const module1 = base64Compile('AGFzbQEAAAABCAFgBH9/f38AAwIBAAQFAXABAQEHEAIBMAAACCRpbXBvcnRzAQAKEQEPACAAIAEgAiADQQARAAALAC8JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQHMC4yMjguMABsBG5hbWUAExJ3aXQtY29tcG9uZW50OnNoaW0BUAEATWluZGlyZWN0LXdhc2k6aW8vc3RyZWFtc0AwLjIuMC1bbWV0aG9kXW91dHB1dC1zdHJlYW0uYmxvY2tpbmctd3JpdGUtYW5kLWZsdXNo');
    const module2 = base64Compile('AGFzbQEAAAABCAFgBH9/f38AAhUCAAEwAAAACCRpbXBvcnRzAXABAQEJBwEAQQALAQAALwlwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQENd2l0LWNvbXBvbmVudAcwLjIyOC4wABwEbmFtZQAVFHdpdC1jb21wb25lbnQ6Zml4dXBz');
    const module3 = base64Compile('AGFzbQEAAAABBAFgAAACBQEAAAAACAEA');
    const module4 = fetchCompile(new URL('./composed-hello-world.core2.wasm', import.meta.url));
    const module5 = fetchCompile(new URL('./composed-hello-world.core3.wasm', import.meta.url));
    const module6 = base64Compile('AGFzbQEAAAABKQdgAX8AYAR/f39/AX9gAn9/AX9gAX8AYAJ/fwBgA39+fwBgBH9/f38AAxEQAAECAgMABAUEBAQEBgQGAAQFAXABEBAHUhEBMAAAATEAAQEyAAIBMwADATQABAE1AAUBNgAGATcABwE4AAgBOQAJAjEwAAoCMTEACwIxMgAMAjEzAA0CMTQADgIxNQAPCCRpbXBvcnRzAQAKxwEQCQAgAEEAEQAACw8AIAAgASACIANBAREBAAsLACAAIAFBAhECAAsLACAAIAFBAxECAAsJACAAQQQRAwALCQAgAEEFEQAACwsAIAAgAUEGEQQACw0AIAAgASACQQcRBQALCwAgACABQQgRBAALCwAgACABQQkRBAALCwAgACABQQoRBAALCwAgACABQQsRBAALDwAgACABIAIgA0EMEQYACwsAIAAgAUENEQQACw8AIAAgASACIANBDhEGAAsJACAAQQ8RAAALAC8JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQHMC4yMjcuMQC8BwRuYW1lABMSd2l0LWNvbXBvbmVudDpzaGltAZ8HEAAiaW5kaXJlY3QtJHJvb3QtYWRkaXRpb25hbC1ncmVldGluZwElYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1mZF93cml0ZQIoYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1lbnZpcm9uX2dldAMuYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1lbnZpcm9uX3NpemVzX2dldAQmYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1wcm9jX2V4aXQFM2luZGlyZWN0LXdhc2k6Y2xpL2Vudmlyb25tZW50QDAuMi4zLWdldC1lbnZpcm9ubWVudAY6aW5kaXJlY3Qtd2FzaTpmaWxlc3lzdGVtL3R5cGVzQDAuMi4zLWZpbGVzeXN0ZW0tZXJyb3ItY29kZQdIaW5kaXJlY3Qtd2FzaTpmaWxlc3lzdGVtL3R5cGVzQDAuMi4zLVttZXRob2RdZGVzY3JpcHRvci53cml0ZS12aWEtc3RyZWFtCElpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vdHlwZXNAMC4yLjMtW21ldGhvZF1kZXNjcmlwdG9yLmFwcGVuZC12aWEtc3RyZWFtCUBpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vdHlwZXNAMC4yLjMtW21ldGhvZF1kZXNjcmlwdG9yLmdldC10eXBlCjxpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vdHlwZXNAMC4yLjMtW21ldGhvZF1kZXNjcmlwdG9yLnN0YXQLQGluZGlyZWN0LXdhc2k6aW8vc3RyZWFtc0AwLjIuMy1bbWV0aG9kXW91dHB1dC1zdHJlYW0uY2hlY2std3JpdGUMOmluZGlyZWN0LXdhc2k6aW8vc3RyZWFtc0AwLjIuMy1bbWV0aG9kXW91dHB1dC1zdHJlYW0ud3JpdGUNQ2luZGlyZWN0LXdhc2k6aW8vc3RyZWFtc0AwLjIuMy1bbWV0aG9kXW91dHB1dC1zdHJlYW0uYmxvY2tpbmctZmx1c2gOTWluZGlyZWN0LXdhc2k6aW8vc3RyZWFtc0AwLjIuMy1bbWV0aG9kXW91dHB1dC1zdHJlYW0uYmxvY2tpbmctd3JpdGUtYW5kLWZsdXNoDzdpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vcHJlb3BlbnNAMC4yLjItZ2V0LWRpcmVjdG9yaWVz');
    const module7 = base64Compile('AGFzbQEAAAABKQdgAX8AYAR/f39/AX9gAn9/AX9gAX8AYAJ/fwBgA39+fwBgBH9/f38AAmYRAAEwAAAAATEAAQABMgACAAEzAAIAATQAAwABNQAAAAE2AAQAATcABQABOAAEAAE5AAQAAjEwAAQAAjExAAQAAjEyAAYAAjEzAAQAAjE0AAYAAjE1AAAACCRpbXBvcnRzAXABEBAJFgEAQQALEAABAgMEBQYHCAkKCwwNDg8ALwlwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQENd2l0LWNvbXBvbmVudAcwLjIyNy4xABwEbmFtZQAVFHdpdC1jb21wb25lbnQ6Zml4dXBz');
    const module8 = base64Compile('AGFzbQEAAAABIQZgBH9/f38Bf2AAAX9gAX8AYAN/f38AYAABf2ADf39/AAKvAQgFZmxhZ3MJaW5zdGFuY2UxA38BBm1lbW9yeQJtMAIAAAVmbGFncwlpbnN0YW5jZTIDfwEHcmVhbGxvYwJmMAAABmNhbGxlZQhhZGFwdGVyMAABCXRyYW5zY29kZRt1dGY4LXRvLXV0ZjggKG1lbTAgPT4gbWVtMSkAAwhhdWdtZW50cw9tZW0xIE1lbW9yeVNpemUABAhhdWdtZW50cw1tZW0xIEkzMlN0b3JlAAUDAgECBwwBCGFkYXB0ZXIwAAUKzgEBywEBBn8jAUEBcUUEQAALIwBBAnFFBEAACyMAQX1xJAAjAEF+cSQAIwBBAXIkABABIQEjAUF+cSQBIAFBA3EEQAALIABBA3EEQAALIAEoAgAgASgCBCECIQMgAkGAgICAeE8EQAALIAIiBCEFQQBBAEEBIAUQACEGAkACQD8ArUIQhiADrSACrXxaDQELAAsCQAJAEAOtQhCGIAatIAWtfFoNAQsACyADIAIgBhACIAAgBkEAEAQgACAEQQQQBCMBQQFyJAEjAEECciQACw');
    const instanceFlags1 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
    const instanceFlags2 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
    ({ exports: exports0 } = yield instantiateCore(yield module1));
    ({ exports: exports1 } = yield instantiateCore(yield module0, {
      'wasi:cli/stdout@0.2.0': {
        'get-stdout': trampoline0,
      },
      'wasi:io/streams@0.2.0': {
        '[method]output-stream.blocking-write-and-flush': exports0['0'],
      },
      'wasi:random/random@0.2.0': {
        'get-random-u64': trampoline1,
      },
    }));
    memory0 = exports1.memory;
    ({ exports: exports2 } = yield instantiateCore(yield module2, {
      '': {
        $imports: exports0.$imports,
        '0': trampoline2,
      },
    }));
    ({ exports: exports3 } = yield instantiateCore(yield module3, {
      '': {
        '': exports1._initialize,
      },
    }));
    ({ exports: exports4 } = yield instantiateCore(yield module6));
    ({ exports: exports5 } = yield instantiateCore(yield module4, {
      $root: {
        'additional-greeting': exports4['0'],
      },
      wasi_snapshot_preview1: {
        environ_get: exports4['2'],
        environ_sizes_get: exports4['3'],
        fd_write: exports4['1'],
        proc_exit: exports4['4'],
      },
    }));
    ({ exports: exports6 } = yield instantiateCore(yield module5, {
      __main_module__: {
        cabi_realloc: exports5.cabi_realloc,
      },
      env: {
        memory: exports5.memory,
      },
      'wasi:cli/environment@0.2.3': {
        'get-environment': exports4['5'],
      },
      'wasi:cli/exit@0.2.3': {
        exit: trampoline10,
      },
      'wasi:cli/stderr@0.2.3': {
        'get-stderr': trampoline7,
      },
      'wasi:cli/stdin@0.2.3': {
        'get-stdin': trampoline8,
      },
      'wasi:cli/stdout@0.2.3': {
        'get-stdout': trampoline9,
      },
      'wasi:filesystem/preopens@0.2.2': {
        'get-directories': exports4['15'],
      },
      'wasi:filesystem/types@0.2.3': {
        '[method]descriptor.append-via-stream': exports4['8'],
        '[method]descriptor.get-type': exports4['9'],
        '[method]descriptor.stat': exports4['10'],
        '[method]descriptor.write-via-stream': exports4['7'],
        '[resource-drop]descriptor': trampoline3,
        'filesystem-error-code': exports4['6'],
      },
      'wasi:io/error@0.2.3': {
        '[resource-drop]error': trampoline5,
      },
      'wasi:io/streams@0.2.3': {
        '[method]output-stream.blocking-flush': exports4['13'],
        '[method]output-stream.blocking-write-and-flush': exports4['14'],
        '[method]output-stream.check-write': exports4['11'],
        '[method]output-stream.write': exports4['12'],
        '[resource-drop]input-stream': trampoline6,
        '[resource-drop]output-stream': trampoline4,
      },
    }));
    memory1 = exports5.memory;
    ({ exports: exports7 } = yield instantiateCore(yield module8, {
      augments: {
        'mem1 I32Store': (ptr, val, offset) => {
          new DataView(exports5.memory.buffer).setInt32(ptr + offset, val, true);
        },
        'mem1 MemorySize': ptr => exports5.memory.buffer.byteLength / 65536,
      },
      callee: {
        adapter0: exports1['additional-greeting'],
      },
      flags: {
        instance1: instanceFlags1,
        instance2: instanceFlags2,
      },
      memory: {
        m0: exports1.memory,
      },
      realloc: {
        f0: exports5.cabi_realloc,
      },
      transcode: {
        'utf8-to-utf8 (mem0 => mem1)': trampoline11,
      },
    }));
    realloc0 = exports6.cabi_import_realloc;
    ({ exports: exports8 } = yield instantiateCore(yield module7, {
      '': {
        $imports: exports4.$imports,
        '0': exports7.adapter0,
        '1': exports6.fd_write,
        '10': trampoline17,
        '11': trampoline18,
        '12': trampoline19,
        '13': trampoline20,
        '14': trampoline21,
        '15': trampoline22,
        '2': exports6.environ_get,
        '3': exports6.environ_sizes_get,
        '4': exports6.proc_exit,
        '5': trampoline12,
        '6': trampoline13,
        '7': trampoline14,
        '8': trampoline15,
        '9': trampoline16,
      },
    }));
    realloc1 = exports5.cabi_realloc;
    postReturn0 = exports5.cabi_post_greet;
  })();
  let promise, resolve, reject;
  function runNext (value) {
    try {
      let done;
      do {
        ({ value, done } = gen.next(value));
      } while (!(value instanceof Promise) && !done);
      if (done) {
        if (resolve) resolve(value);
        else return value;
      }
      if (!promise) promise = new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
      value.then(runNext, reject);
    }
    catch (e) {
      if (reject) reject(e);
      else throw e;
    }
  }
  const maybeSyncReturn = runNext(null);
  return promise || maybeSyncReturn;
})();

await $init;

export { greet,  }