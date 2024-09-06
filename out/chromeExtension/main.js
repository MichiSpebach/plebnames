(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../Library/Caches/deno/deno_esbuild/bech32@2.0.0/node_modules/bech32/dist/index.js
  var require_dist = __commonJS({
    "../../Library/Caches/deno/deno_esbuild/bech32@2.0.0/node_modules/bech32/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bech32m = exports.bech32 = void 0;
      var ALPHABET2 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
      var ALPHABET_MAP = {};
      for (let z = 0; z < ALPHABET2.length; z++) {
        const x = ALPHABET2.charAt(z);
        ALPHABET_MAP[x] = z;
      }
      function polymodStep(pre) {
        const b = pre >> 25;
        return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
      }
      function prefixChk(prefix) {
        let chk = 1;
        for (let i = 0; i < prefix.length; ++i) {
          const c = prefix.charCodeAt(i);
          if (c < 33 || c > 126)
            return "Invalid prefix (" + prefix + ")";
          chk = polymodStep(chk) ^ c >> 5;
        }
        chk = polymodStep(chk);
        for (let i = 0; i < prefix.length; ++i) {
          const v = prefix.charCodeAt(i);
          chk = polymodStep(chk) ^ v & 31;
        }
        return chk;
      }
      function convert(data, inBits, outBits, pad) {
        let value = 0;
        let bits = 0;
        const maxV = (1 << outBits) - 1;
        const result = [];
        for (let i = 0; i < data.length; ++i) {
          value = value << inBits | data[i];
          bits += inBits;
          while (bits >= outBits) {
            bits -= outBits;
            result.push(value >> bits & maxV);
          }
        }
        if (pad) {
          if (bits > 0) {
            result.push(value << outBits - bits & maxV);
          }
        } else {
          if (bits >= inBits)
            return "Excess padding";
          if (value << outBits - bits & maxV)
            return "Non-zero padding";
        }
        return result;
      }
      function toWords(bytes2) {
        return convert(bytes2, 8, 5, true);
      }
      function fromWordsUnsafe(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
      }
      function fromWords(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
        throw new Error(res);
      }
      function getLibraryFromEncoding(encoding) {
        let ENCODING_CONST;
        if (encoding === "bech32") {
          ENCODING_CONST = 1;
        } else {
          ENCODING_CONST = 734539939;
        }
        function encode(prefix, words, LIMIT) {
          LIMIT = LIMIT || 90;
          if (prefix.length + 7 + words.length > LIMIT)
            throw new TypeError("Exceeds length limit");
          prefix = prefix.toLowerCase();
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            throw new Error(chk);
          let result = prefix + "1";
          for (let i = 0; i < words.length; ++i) {
            const x = words[i];
            if (x >> 5 !== 0)
              throw new Error("Non 5-bit word");
            chk = polymodStep(chk) ^ x;
            result += ALPHABET2.charAt(x);
          }
          for (let i = 0; i < 6; ++i) {
            chk = polymodStep(chk);
          }
          chk ^= ENCODING_CONST;
          for (let i = 0; i < 6; ++i) {
            const v = chk >> (5 - i) * 5 & 31;
            result += ALPHABET2.charAt(v);
          }
          return result;
        }
        function __decode(str, LIMIT) {
          LIMIT = LIMIT || 90;
          if (str.length < 8)
            return str + " too short";
          if (str.length > LIMIT)
            return "Exceeds length limit";
          const lowered = str.toLowerCase();
          const uppered = str.toUpperCase();
          if (str !== lowered && str !== uppered)
            return "Mixed-case string " + str;
          str = lowered;
          const split = str.lastIndexOf("1");
          if (split === -1)
            return "No separator character for " + str;
          if (split === 0)
            return "Missing prefix for " + str;
          const prefix = str.slice(0, split);
          const wordChars = str.slice(split + 1);
          if (wordChars.length < 6)
            return "Data too short";
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            return chk;
          const words = [];
          for (let i = 0; i < wordChars.length; ++i) {
            const c = wordChars.charAt(i);
            const v = ALPHABET_MAP[c];
            if (v === void 0)
              return "Unknown character " + c;
            chk = polymodStep(chk) ^ v;
            if (i + 6 >= wordChars.length)
              continue;
            words.push(v);
          }
          if (chk !== ENCODING_CONST)
            return "Invalid checksum for " + str;
          return { prefix, words };
        }
        function decodeUnsafe(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
        }
        function decode(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
          throw new Error(res);
        }
        return {
          decodeUnsafe,
          decode,
          encode,
          toWords,
          fromWordsUnsafe,
          fromWords
        };
      }
      exports.bech32 = getLibraryFromEncoding("bech32");
      exports.bech32m = getLibraryFromEncoding("bech32m");
    }
  });

  // ../../Library/Caches/deno/deno_esbuild/base-x@5.0.0/node_modules/base-x/src/esm/index.js
  function base(ALPHABET2) {
    if (ALPHABET2.length >= 255) {
      throw new TypeError("Alphabet too long");
    }
    const BASE_MAP = new Uint8Array(256);
    for (let j = 0; j < BASE_MAP.length; j++) {
      BASE_MAP[j] = 255;
    }
    for (let i = 0; i < ALPHABET2.length; i++) {
      const x = ALPHABET2.charAt(i);
      const xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) {
        throw new TypeError(x + " is ambiguous");
      }
      BASE_MAP[xc] = i;
    }
    const BASE = ALPHABET2.length;
    const LEADER = ALPHABET2.charAt(0);
    const FACTOR = Math.log(BASE) / Math.log(256);
    const iFACTOR = Math.log(256) / Math.log(BASE);
    function encode(source) {
      if (source instanceof Uint8Array) {
      } else if (ArrayBuffer.isView(source)) {
        source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
      } else if (Array.isArray(source)) {
        source = Uint8Array.from(source);
      }
      if (!(source instanceof Uint8Array)) {
        throw new TypeError("Expected Uint8Array");
      }
      if (source.length === 0) {
        return "";
      }
      let zeroes = 0;
      let length = 0;
      let pbegin = 0;
      const pend = source.length;
      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
      }
      const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
      const b58 = new Uint8Array(size);
      while (pbegin !== pend) {
        let carry = source[pbegin];
        let i = 0;
        for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
          carry += 256 * b58[it1] >>> 0;
          b58[it1] = carry % BASE >>> 0;
          carry = carry / BASE >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        pbegin++;
      }
      let it2 = size - length;
      while (it2 !== size && b58[it2] === 0) {
        it2++;
      }
      let str = LEADER.repeat(zeroes);
      for (; it2 < size; ++it2) {
        str += ALPHABET2.charAt(b58[it2]);
      }
      return str;
    }
    function decodeUnsafe(source) {
      if (typeof source !== "string") {
        throw new TypeError("Expected String");
      }
      if (source.length === 0) {
        return new Uint8Array();
      }
      let psz = 0;
      let zeroes = 0;
      let length = 0;
      while (source[psz] === LEADER) {
        zeroes++;
        psz++;
      }
      const size = (source.length - psz) * FACTOR + 1 >>> 0;
      const b256 = new Uint8Array(size);
      while (source[psz]) {
        let carry = BASE_MAP[source.charCodeAt(psz)];
        if (carry === 255) {
          return;
        }
        let i = 0;
        for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
          carry += BASE * b256[it3] >>> 0;
          b256[it3] = carry % 256 >>> 0;
          carry = carry / 256 >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        psz++;
      }
      let it4 = size - length;
      while (it4 !== size && b256[it4] === 0) {
        it4++;
      }
      const vch = new Uint8Array(zeroes + (size - it4));
      let j = zeroes;
      while (it4 !== size) {
        vch[j++] = b256[it4++];
      }
      return vch;
    }
    function decode(string) {
      const buffer = decodeUnsafe(string);
      if (buffer) {
        return buffer;
      }
      throw new Error("Non-base" + BASE + " character");
    }
    return {
      encode,
      decodeUnsafe,
      decode
    };
  }
  var esm_default = base;

  // ../../Library/Caches/deno/deno_esbuild/bs58@6.0.0/node_modules/bs58/src/esm/index.js
  var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var esm_default2 = esm_default(ALPHABET);

  // ../../Library/Caches/deno/deno_esbuild/@noble/hashes@1.5.0/node_modules/@noble/hashes/esm/_assert.js
  function isBytes(a) {
    return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
  }
  function bytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
  }
  function exists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  }

  // ../../Library/Caches/deno/deno_esbuild/@noble/hashes@1.5.0/node_modules/@noble/hashes/esm/utils.js
  var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  var rotr = (word, shift) => word << 32 - shift | word >>> shift;
  var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    bytes(data);
    return data;
  }
  var Hash = class {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  var toStr = {}.toString;
  function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }

  // ../../Library/Caches/deno/deno_esbuild/@noble/hashes@1.5.0/node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  var Chi = (a, b, c) => a & b ^ ~a & c;
  var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
  var HashMD = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      exists(this);
      const { view, buffer, blockLen } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      exists(this);
      output(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // ../../Library/Caches/deno/deno_esbuild/@noble/hashes@1.5.0/node_modules/@noble/hashes/esm/sha256.js
  var SHA256_K = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_IV = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends HashMD {
    constructor() {
      super(64, 32, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

  // ../../Library/Caches/deno/deno_esbuild/bs58check@4.0.0/node_modules/bs58check/src/esm/base.js
  function base_default(checksumFn) {
    function encode(payload) {
      var payloadU8 = Uint8Array.from(payload);
      var checksum = checksumFn(payloadU8);
      var length = payloadU8.length + 4;
      var both = new Uint8Array(length);
      both.set(payloadU8, 0);
      both.set(checksum.subarray(0, 4), payloadU8.length);
      return esm_default2.encode(both);
    }
    function decodeRaw(buffer) {
      var payload = buffer.slice(0, -4);
      var checksum = buffer.slice(-4);
      var newChecksum = checksumFn(payload);
      if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3])
        return;
      return payload;
    }
    function decodeUnsafe(str) {
      var buffer = esm_default2.decodeUnsafe(str);
      if (buffer == null)
        return;
      return decodeRaw(buffer);
    }
    function decode(str) {
      var buffer = esm_default2.decode(str);
      var payload = decodeRaw(buffer);
      if (payload == null)
        throw new Error("Invalid checksum");
      return payload;
    }
    return {
      encode,
      decode,
      decodeUnsafe
    };
  }

  // ../../Library/Caches/deno/deno_esbuild/bs58check@4.0.0/node_modules/bs58check/src/esm/index.js
  function sha256x2(buffer) {
    return sha256(sha256(buffer));
  }
  var esm_default3 = base_default(sha256x2);

  // src/util.ts
  var import_npm_bech32_2_0 = __toESM(require_dist());
  var bech32Chars = [
    "q",
    "p",
    "z",
    "r",
    "y",
    "9",
    "x",
    "8",
    "g",
    "f",
    "2",
    "t",
    "v",
    "d",
    "w",
    "0",
    "s",
    "3",
    "j",
    "n",
    "5",
    "4",
    "k",
    "h",
    "c",
    "e",
    "6",
    "m",
    "u",
    "a",
    "7",
    "l"
  ];
  function hexToAscii(hex) {
    let ascii = "";
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = Number("0x" + hex.substring(i, i + 2));
      ascii += String.fromCharCode(charCode);
    }
    return ascii;
  }
  function asciiToHex(ascii) {
    let hex = "";
    for (let i = 0; i < ascii.length; i++) {
      hex += ascii.charCodeAt(i).toString(16);
    }
    return hex;
  }
  function normalizeAsciiToBech32(ascii) {
    let bech322 = "";
    for (const char of ascii.toLowerCase().replaceAll("b", "8").replaceAll("i", "7").replaceAll("o", "0")) {
      if (bech32Chars.includes(char)) {
        bech322 += char;
      }
    }
    return bech322;
  }
  function generateBech32AddressWithPad(pad) {
    return addPrefixAndChecksumToBech32Ascii("".padEnd(32, pad));
  }
  function addPrefixAndChecksumToBech32Ascii(bech32InAscii) {
    const bytes2 = [];
    for (let i = 0; i < bech32InAscii.length; i++) {
      bytes2.push(bech32Chars.indexOf(bech32InAscii[i]));
    }
    return import_npm_bech32_2_0.bech32.encode("bc", [0, ...bytes2]);
  }

  // src/PlebNameHistory.ts
  var PlebNameHistory = class {
    name;
    claim;
    changes = [];
    data;
    constructor(name, claimerAddress) {
      this.name = name;
      this.claim = { data: { owner: claimerAddress } };
      this.data = this.claim.data;
    }
    addChangeFromOpReturnScript(opReturnScript) {
      const change = { data: {} };
      for (const instruction of opReturnScript.split(";")) {
        const [name, keyAndValue] = this.splitStringIntoTwoParts(instruction, ".");
        if (normalizeAsciiToBech32(name) !== normalizeAsciiToBech32(this.name)) {
          continue;
        }
        const [key, value] = this.splitStringIntoTwoParts(keyAndValue, "=");
        change.data[key] = value.replaceAll("'", "");
      }
      if (Object.entries(change.data).length > 0) {
        this.addChange(change);
      }
    }
    /** 'test.website=bitcoin.org'.split('.', 2) would result in ['test', 'website=bitcoin'] ('.org' would be missing) */
    splitStringIntoTwoParts(text, separator) {
      const index = text.indexOf(separator);
      return [text.substring(0, index), text.substring(index + 1)];
    }
    addChange(change) {
      this.changes.push(change);
      this.data = { ...this.data, ...change.data };
    }
    getChanges() {
      return this.changes;
    }
    getData() {
      return this.data;
    }
  };

  // src/bitcoinExplorer/GeneralExplorerAdapter.ts
  var GeneralExplorerAdapter = class {
    async getFirstInputOfAddress(address) {
      const transactions = await this.getTransactionsOfAddress(address);
      if (transactions.txs.length < 1) {
        return void 0;
      }
      if (transactions.n_tx > transactions.txs.length) {
        throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: case for transactions.n_tx > transactions.txs.length not implemented yet.`);
      }
      const firstTransaction = transactions.txs[transactions.txs.length - 1];
      if (firstTransaction.vin.length < 1) {
        throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: firstTransaction.inputs is empty.`);
      }
      return firstTransaction.vin[firstTransaction.vin.length - 1].prevout;
    }
    async getInputsOfAddress(address) {
      const transactions = await this.getTransactionsOfAddress(address);
      const transactionsInputs = transactions.txs.flatMap((transaction) => transaction.vin);
      return transactionsInputs.map((input) => input.prevout);
    }
    async getOpReturnOutScriptsOfAddress(address) {
      const transactions = await this.getTransactionsOfAddress(address);
      const authoredTransactions = transactions.txs.filter((transaction) => transaction.vin.find((input) => input.prevout.scriptpubkey_address === address));
      const outputs = authoredTransactions.flatMap((transaction) => transaction.vout);
      return outputs.map((output2) => output2.scriptpubkey).filter((script) => script.startsWith("6a" /* OP_RETURN */)).map((script) => hexToAscii(script.substring(4)));
    }
  };

  // src/bitcoinExplorer/Transaction.ts
  var Transaction = class _Transaction {
    vin;
    vout;
    constructor(inputs, outputs) {
      this.vin = inputs;
      this.vout = outputs;
    }
    static fromBlockstreamOrMempoolTransaction(blockstreamTransaction) {
      const transaction = Object.setPrototypeOf(blockstreamTransaction, _Transaction.prototype);
      transaction.validate();
      return transaction;
    }
    static fromBlockchainTransaction(blockchainTransaction) {
      const transaction = new _Transaction(
        blockchainTransaction.inputs.map((input) => {
          return {
            prevout: {
              scriptpubkey_address: input.prev_out.addr,
              scriptpubkey: input.prev_out.script
            }
          };
        }),
        blockchainTransaction.out.map((output2) => {
          return { scriptpubkey: output2.script };
        })
      );
      transaction.validate();
      return transaction;
    }
    /**
     * TODO use e.g. Zod
     */
    validate() {
      for (const input of this.vin) {
        const prevout = input.prevout;
        if (!prevout) {
          console.warn(`!input.prevout, input is: ${JSON.stringify(input)}`);
        }
        if (prevout.scriptpubkey_address && typeof prevout.scriptpubkey_address !== "string") {
          console.warn(`prevout.scriptpubkey_address && typeof prevout.scriptpubkey_address !== 'string', input is: ${JSON.stringify(input)}`);
        }
        if (typeof prevout.scriptpubkey !== "string") {
          console.warn(`typeof input.prevout.scriptpubkey !== 'string', input is: ${JSON.stringify(input)}`);
        }
      }
      for (const output2 of this.vout) {
        if (typeof output2.scriptpubkey !== "string") {
          console.warn(`typeof output.scriptpubkey !== 'string', output is: ${JSON.stringify(output2)}`);
        }
      }
    }
  };

  // src/bitcoinExplorer/BlockchainExplorerAdapter.ts
  var BlockchainExplorerAdapter = class extends GeneralExplorerAdapter {
    baseUrl = "https://blockchain.info";
    async getTransactionsOfAddress(address) {
      const query = `${this.baseUrl}/rawaddr/${address}`;
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`BlockchainExplorerAdapter::getInputsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`);
      }
      const json = await response.json();
      return {
        n_tx: json.n_tx,
        txs: json.txs.map(Transaction.fromBlockchainTransaction)
      };
    }
  };

  // src/bitcoinExplorer/BlockstreamExplorerAdapter.ts
  var BlockstreamExplorerAdapter = class extends GeneralExplorerAdapter {
    baseUrl = "https://blockstream.info/api";
    async getTransactionsOfAddress(address) {
      const query = `${this.baseUrl}/address/${address}/txs`;
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`BlockstreamExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`);
      }
      const json = await response.json();
      return {
        n_tx: json.length,
        txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction)
      };
    }
  };

  // src/bitcoinExplorer/BtcscanExplorerAdapter.ts
  var BtcscanExplorerAdapter = class extends GeneralExplorerAdapter {
    baseUrl = "https://btcscan.org/api";
    async getTransactionsOfAddress(address) {
      const query = `${this.baseUrl}/address/${address}/txs`;
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`BtcscanExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`);
      }
      const json = await response.json();
      return {
        n_tx: json.length,
        txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction)
      };
    }
  };

  // src/bitcoinExplorer/MempoolExplorerAdapter.ts
  var MempoolExplorerAdapter = class extends GeneralExplorerAdapter {
    baseUrl = "https://mempool.space/api";
    async getTransactionsOfAddress(address) {
      const query = `${this.baseUrl}/address/${address}/txs`;
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`MempoolExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`);
      }
      const json = await response.json();
      return {
        n_tx: json.length,
        txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction)
      };
    }
  };

  // src/bitcoinExplorer/CombinedExplorerAdapter.ts
  var CombinedExplorerAdapter = class {
    explorers = [
      new MempoolExplorerAdapter(),
      new BlockchainExplorerAdapter(),
      new BtcscanExplorerAdapter(),
      new BlockstreamExplorerAdapter()
    ];
    index = -1;
    getFirstInputOfAddress(address) {
      return this.selectExplorer().getFirstInputOfAddress(address);
    }
    getInputsOfAddress(address) {
      return this.selectExplorer().getInputsOfAddress(address);
    }
    getOpReturnOutScriptsOfAddress(address) {
      return this.selectExplorer().getOpReturnOutScriptsOfAddress(address);
    }
    selectExplorer() {
      this.index = (this.index + 1) % this.explorers.length;
      return this.explorers[this.index];
    }
  };

  // src/bitcoinExplorer/explorerAdapter.ts
  var explorerAdapter = new CombinedExplorerAdapter();

  // src/main.ts
  main();
  async function main() {
    const showUrl = Boolean(document.currentScript?.getAttribute("showUrl"));
    const url = new URLSearchParams(window.location.search).get("url");
    const urlRedirect = Boolean(document.currentScript?.getAttribute("urlRedirect"));
    const urlStyle = showUrl ? void 0 : "display:none";
    document.body.innerHTML = `
		<div style="font-size:200%;text-align:center">PlebNames</div>
		PlebNames are piggybacked names on Bitcoin, just Bitcoin.<br>
		Only normal Bitcoin explorers are required, no other server infrastructure or sidechain.<br>
		Also see: <a target="blank" href="https://github.com/MichiSpebach/plebnames">https://github.com/MichiSpebach/plebnames</a>.<br><br>
		<div style="cursor:pointer;font-size:150%">Look-up names or claim yours:</div>
		<table style="margin:auto">
			${buildRowHtml({ html: "coming from: " }, { html: url ?? void 0 }, urlStyle)}
			${buildRowHtml({ html: '<label for="url">url: </label>' }, { html: `<input id="url" value="${url}"></input>` }, urlStyle)}
			${buildRowHtml({ html: '<label for="name">name: </label>' }, { html: `<input id="name" placeholder="input name of choice" value=""></input>` })}
			${buildRowHtml({ html: "normalizedName: " }, { id: "normalizedName" })}
			${buildRowHtml({ html: "plebAddress: " }, { id: "plebAddress" })}
			${buildRowHtml({ html: "broadestAddress: " }, { html: generateBech32AddressWithPad("m") }, "visibility:hidden;line-height:0")}
			${buildRowHtml({ html: "" }, { html: '<button id="lookup" style="cursor:pointer;font-size:121%">lookup</button>' })}
		</table>
		<div id="lookupResult"></div>
	`;
    updateNamesAndPlebAddress();
    if (url) {
      lookupPlebAddress({ redirectToWebsiteOrUrl: urlRedirect });
    }
    getInputElement("url").oninput = () => updateNamesAndPlebAddress();
    getInputElement("name").oninput = () => updateNormalizedNameAndPlebAddress();
    setOnKeydownEnterToElement("url", () => lookupPlebAddress());
    setOnKeydownEnterToElement("name", () => lookupPlebAddress());
    getElement("lookup").onclick = () => lookupPlebAddress();
    function setOnKeydownEnterToElement(elementId, onEnter) {
      getInputElement(elementId).onkeydown = (event) => {
        if (event.key === "Enter") {
          onEnter();
        }
      };
    }
  }
  function buildRowHtml(left, right, style) {
    const styleHtml = style ? `style="${style}"` : "";
    const rightId = right.id ? `id="${right.id}"` : "";
    const rightStyle = right.style ? `style="${right.style}"` : "";
    return `<tr ${styleHtml}>
		<td style="text-align:right">${left.html}</td>
		<td ${rightId} ${rightStyle}>${right.html}</td>
	</tr>`;
  }
  function updateNamesAndPlebAddress() {
    const url = getInputElement("url").value;
    const name = url === "null" ? "" : getNameFromUrl(url);
    getInputElement("name").value = name;
    updateNormalizedNameAndPlebAddress();
  }
  function updateNormalizedNameAndPlebAddress() {
    const name = getInputElement("name").value;
    const normalizedName = normalizeAsciiToBech32(name);
    document.getElementById("normalizedName").textContent = normalizedName;
    const plebAddress = generateBech32AddressWithPad(normalizedName);
    document.getElementById("plebAddress").textContent = plebAddress;
  }
  function getNameFromUrl(url) {
    const tld = ".btc";
    if (url.endsWith(tld)) {
      url = url.slice(0, -tld.length);
    } else {
      const endIndex = url.indexOf(tld + "/");
      if (endIndex > 0) {
        url = url.slice(0, endIndex);
      }
    }
    const schemeIndex = url.indexOf("//");
    if (schemeIndex > -1) {
      url = url.slice(schemeIndex + 2);
    }
    const startIndex = url.lastIndexOf(".");
    if (startIndex > -1) {
      url = url.slice(startIndex + 1);
    }
    return url;
  }
  async function lookupPlebAddress(options) {
    const name = getInputElement("name").value;
    const plebAddress = getElement("plebAddress").textContent;
    const lookupResultElement = getElement("lookupResult");
    if (plebAddress.length < 15) {
      lookupResultElement.innerHTML = '<pre style="color:red">Input a name, then click lookup.</pre>';
      return;
    }
    lookupResultElement.innerHTML = "looking up...";
    const claimerInput = await explorerAdapter.getFirstInputOfAddress(plebAddress);
    lookupResultElement.innerHTML = `<div style="font-size:150%">Information about ${name}</div>`;
    if (!claimerInput) {
      lookupResultElement.innerHTML += `The name '${name}' is not claimed yet.<br>`;
      lookupResultElement.innerHTML += `You can claim it by sending a minimum amount of satoshis (atm 546) to '${plebAddress}'.`;
      showScriptOptions(name, "${addressUsedToSentToPlebAddress}");
      return;
    }
    const claimer = claimerInput.scriptpubkey_address ?? claimerInput.scriptpubkey;
    lookupResultElement.innerHTML += `The name '${name}' was first claimed by '${claimer}'.<br>`;
    const history = new PlebNameHistory(name, claimer);
    await followChanges(history);
    const websiteOrUrl = history.getData().website;
    if (options?.redirectToWebsiteOrUrl && websiteOrUrl) {
      window.location.replace(websiteOrUrl);
    } else {
      showScriptOptions(history.name, history.getData().owner);
    }
  }
  async function followChanges(history) {
    getElement("lookupResult").innerHTML += `
		<div id="lookupResultData">
			looking up...
		</div>
		<details>
			<summary style="cursor:pointer">History</summary>
			<pre id="lookupResultHistory"></pre>
		</details>
		<details>
			<summary style="cursor:pointer">All related OP_RETURN scripts</summary>
			<pre id="lookupResultRelatedScripts"></pre>
		</details>
	`;
    let owner = void 0;
    while (owner !== history.getData().owner) {
      owner = history.getData().owner;
      const scripts = await explorerAdapter.getOpReturnOutScriptsOfAddress(owner);
      document.getElementById("lookupResultRelatedScripts").innerHTML += JSON.stringify({ issuer: owner, scripts }, null, 4) + "\n";
      for (const script of scripts) {
        history.addChangeFromOpReturnScript(script);
        document.getElementById("lookupResultHistory").innerHTML = JSON.stringify(history.getChanges(), null, 4);
        if (owner !== history.getData().owner) {
          break;
        }
      }
    }
    document.getElementById("lookupResultData").innerHTML = `
		The current owner is '${history.getData().owner}'<br>
		The current Nostr npub is <a href="https://primal.net/p/${history.getData().nostr}" target="_blank">${history.getData().nostr}</a><br>
		The current website is <a href="${history.getData().website}">${history.getData().website}</a><br>
		The current lightningAddress is ${history.getData().lightningAddress}<br>
		All current data:
		<pre>${JSON.stringify(history.getData(), null, 4)}</pre>
	`;
  }
  function showScriptOptions(name, owner) {
    getElement("lookupResult").innerHTML += `
		<div style="margin-top:8px; font-size:150%">Alter ${name}</div>
		<div style="display:flex">
			<select id="lookupResultSelect">
				<option value="nostr">Nostr</option>
				<option value="website">website</option>
				<option value="owner">owner</option>
				<option value="lightningAddress">lightningAddress</option>
				<option value="any">any</option>
			</select>
			<input id="lookupResultSelectInput" style="margin-left:4px"></input>
			=
			<input id="lookupResultSelectValue" style="flex-grow:1"><br>
		</div>
		<div id="lookupResultSelectWarning" style="color:red">
			When changing owner you transfer '${name}' to another address, be sure to type in the address correctly because<br>
			you cannot change anything regarding '${name}' afterwards (there are no checksums put in yet TODO)<br>
		</div>
		To add or change data of '${name}' send following OP_RETURN script from '${owner}'<br>
		e.g. with Electrum with amount 0:<br>
		<div style="display:flex">
			<pre id="lookupResultSelectProposedScript" style="margin:0 4px 0 0;border:1px solid; padding:4px 8px;"></pre>
			<button id="lookupResultSelectProposedScriptCopy" style="cursor:pointer" title="copy">&#x1f4cb;</button>
			<span id="lookupResultSelectProposedScriptCopyMessage"></span>
		</div>
		<div id="lookupResultSelectProposedScriptValueAscii"></div>
	`;
    getElement("lookupResultSelect").oninput = () => {
      updateScriptOptions(name);
      getElement("lookupResultSelectValue").value = "";
    };
    getElement("lookupResultSelectInput").oninput = () => updateScriptOptions(name);
    getElement("lookupResultSelectValue").oninput = () => updateScriptOptions(name);
    getElement("lookupResultSelectProposedScriptCopy").onclick = async () => {
      try {
        await navigator.clipboard.writeText(getElement("lookupResultSelectProposedScript").innerHTML);
        getElement("lookupResultSelectProposedScriptCopyMessage").innerHTML = "copied!";
        setTimeout(() => getElement("lookupResultSelectProposedScriptCopyMessage").innerHTML = "", 500);
      } catch (error) {
        getElement("lookupResultSelectProposedScriptCopyMessage").innerHTML = String(error) + "<br>Just select and copy the content manually.";
        setTimeout(() => getElement("lookupResultSelectProposedScriptCopyMessage").innerHTML = "", 5e3);
      }
    };
    updateScriptOptions(name);
  }
  function updateScriptOptions(name) {
    let key = getElement("lookupResultSelect").value;
    if (key === "any") {
      key = getElement("lookupResultSelectInput").value;
      getElement("lookupResultSelectInput").style.display = "";
    } else {
      getElement("lookupResultSelectInput").style.display = "none";
    }
    if (key === "owner") {
      getElement("lookupResultSelectWarning").style.display = "";
    } else {
      getElement("lookupResultSelectWarning").style.display = "none";
    }
    const valueElement = getElement("lookupResultSelectValue");
    switch (key) {
      case "owner":
        valueElement.placeholder = "bc1qtp8nlplz7myycp5vtyy7zd7a7c2xgkwx7hsssr";
        break;
      case "nostr":
        valueElement.placeholder = "npub023456789acdefghjklmnpqrstuvwxyz023456789acdefghjklmnpqrstu";
        break;
      case "website":
        valueElement.placeholder = "https://bitcoin.org";
        break;
      default:
        valueElement.placeholder = "";
    }
    const scriptValue = `${name}.${key}=${valueElement.value}`;
    getElement("lookupResultSelectProposedScript").textContent = `script(OP_RETURN ${asciiToHex(scriptValue)})`;
    getElement("lookupResultSelectProposedScriptValueAscii").textContent = `The scriptValue is encoded in hex, in ascii it is "${scriptValue}".`;
  }
  function getInputElement(id) {
    return getElement(id);
  }
  function getElement(id) {
    return document.getElementById(id);
  }
})();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
