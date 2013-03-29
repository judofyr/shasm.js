(function() {
  "use strict";
  // Adapted from https://github.com/progranism/Bitcoin-JavaScript-Miner/blob/master/sha256.js
  // Heap structure (in 32-bit numbers)
  //    0 -  63: K array
  //   64 - 127: W array
  //  128 - 135: H array
  //  136      : Number of blocks
  //  137 - ...: blocks
  function module(stdlib, foreign, heap) {
    "use asm";

    var H = new stdlib.Int32Array(heap);
    var B = new stdlib.Uint8Array(heap);

    var iW = 256;
    var iH = 512;
    var iN = 544;
    var iB = 548;

    function endian_swap(x) {
      x = x|0;
      return (
        (x>>>24) | 
        ((x<<8) & 0x00FF0000) |
        ((x>>>8) & 0x0000FF00) |
        (x<<24)
      )|0;
    }

    // Binary Right Rotate
    function S(X, n) {
      X = X|0; n = n|0;
      return ( X >>> n ) | (X << (32 - n))|0;
    }

    // Binary Right Shift
    function R(X, n) {
      X = X|0; n = n|0;
      return ( X >>> n )|0;
    }

    //// Binary functions unique to SHA-256
    // These are used in the calculation of T1
    function Ch(x, y, z) {
      x = x|0; y = y|0; z = z|0;
      return ((x & y) ^ ((~x) & z))|0;
    }

    function Sigma1(x) {
      x = x|0;
      return (S(x, 6) ^ S(x, 11) ^ S(x, 25))|0;
    }

    // These are used in the calculation of T2
    function Maj(x, y, z) {
      x = x|0; y = y|0; z = z|0;
      return ((x & y) ^ (x & z) ^ (y & z))|0;
    }

    function Sigma0(x) {
      x = x|0;
      return (S(x, 2) ^ S(x, 13) ^ S(x, 22))|0;
    }

    // These are used in the calculation of W
    function Gamma0(x) {
      x = x|0;
      return (S(x, 7) ^ S(x, 18) ^ R(x, 3))|0;
    }

    function Gamma1(x) {
      x = x|0;
      return (S(x, 17) ^ S(x, 19) ^ R(x, 10))|0;
    }

    function init() {
      H[128] = 0x6A09E667;
      H[129] = 0xBB67AE85;
      H[130] = 0x3C6EF372;
      H[131] = 0xA54FF53A;
      H[132] = 0x510E527F;
      H[133] = 0x9B05688C;
      H[134] = 0x1F83D9AB;
      H[135] = 0x5BE0CD19;
    }

    function run() {
      var h0 = 0, h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0, h7 = 0;
      var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0;

      var W = 256;
      var start = 548; // where the blocks start

      var i = 0;
      var s0 = 0, s1 = 0, maj = 0, t2 = 0, ch = 0, t1 = 0;
      var blocks = 0;

      h0 = H[128]|0;
      h1 = H[129]|0;
      h2 = H[130]|0;
      h3 = H[131]|0;
      h4 = H[132]|0;
      h5 = H[133]|0;
      h6 = H[134]|0;
      h7 = H[135]|0;

      // Loop over the blocks
      for (blocks = H[136]|0; blocks; blocks = (blocks - 1)|0) {
        a = h0;
        b = h1;
        c = h2;
        d = h3;
        e = h4;
        f = h5;
        g = h6;
        h = h7;

        for (i = 0; (i|0) < 256; i = (i + 4)|0) {
          if ((i|0) < 64) {
            H[(W+i)>>2] = endian_swap(H[(start+i)>>2]|0);
          } else {
            s0 = Gamma0(H[(W+i-60)>>2]|0);
            s1 = Gamma1(H[(W+i-8)>>2]|0);
            H[(W+i)>>2] = (H[(W+i-64)>>2]|0) + s0 + (H[(W+i-28)>>2]|0) + s1;
          }

          s0 = Sigma0(a);
          maj = Maj(a, b, c);
          t2 = (s0 + maj)|0;
          s1 = Sigma1(e);
          ch = Ch(e, f, g);
          t1 = (h + s1 + ch + (H[i>>2]|0) + (H[(W+i)>>2]|0))|0;

          h = g;
          g = f;
          f = e;
          e = (d + t1)|0;
          d = c;
          c = b;
          b = a;
          a = (t1 + t2)|0;
        }

        h0 = (h0 + a)|0;
        h1 = (h1 + b)|0;
        h2 = (h2 + c)|0;
        h3 = (h3 + d)|0;
        h4 = (h4 + e)|0;
        h5 = (h5 + f)|0;
        h6 = (h6 + g)|0;
        h7 = (h7 + h)|0;
        start = (start + 64)|0;
      }

      H[128] = h0;
      H[129] = h1;
      H[130] = h2;
      H[131] = h3;
      H[132] = h4;
      H[133] = h5;
      H[134] = h6;
      H[135] = h7;
    }

    return {
      init: init,
      run: run
    };
  }

  var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

  var nums = "01234567890abcdef";

  function writeBuffer(target, buffer, from, to, offset) {
    if (typeof buffer == 'string') {
      for (var i = from; i < to; i++) {
        target[548 + offset + i] = buffer.charCodeAt(i);
      }
    } else {
      // Writes an Int8Array
      target.set(buffer.subarray(from, to), 548 + offset);
    }
  }

  function sha256(heapSize) {
    var heap = new ArrayBuffer(heapSize || 4096);
    this.mod = module(window, {}, heap);
    this.int8 = new Int8Array(heap);
    this.int32 = new Uint32Array(heap);
    this.int32.set(K);
    this.chunkLimit = this.int8.length - 548;
  }

  sha256.prototype.init = function() {
    this.totalSize = 0;
    this.offset = 0;
    this.mod.init();
  };

  sha256.prototype.update = function(buffer) {
    var length, view, blocks, extra, boundary;

    length = buffer.length;
    if (length > this.chunkLimit) throw "too big chunk";
    this.totalSize += length;
    blocks = (length + this.offset) >> 6;
    extra = (length + this.offset) & 63;
    boundary = length - extra;

    writeBuffer(this.int8, buffer, 0, boundary, this.offset);

    if (blocks) {
      this.int32[136] = blocks;
      this.mod.run();
    }

    // Write the extra bytes
    writeBuffer(this.int8, buffer, boundary, length, 0);
    this.offset = extra;
  };

  sha256.prototype.finalUpdate = function() {
    // write 1 bit
    this.int8[548 + this.offset] = 128;
    // write 0 bits
    for (var i = this.offset+1; i < 64; i++) {
      this.int8[548 + i] = 0;
    }
    // write size
    var bitsize = this.totalSize * 8;
    this.int8[548 + i - 1] = bitsize & 255;
    this.int8[548 + i - 2] = bitsize >> 8;

    // run the last blocks
    this.int32[136] = 1;
    this.mod.run();
  },

  sha256.prototype.finish = function() {
    this.finalUpdate();
    // create hex
    var str = "";
    for (var i = 0; i < 8; i++) {
      var h = this.int32[128+i].toString(16);
      var leading = (8 - h.length);
      while (leading--) str += "0";
      str += h;
    }
    return str;
  }

  window.sha256 = sha256;
})();

