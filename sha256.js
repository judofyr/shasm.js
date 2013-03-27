(function() {
  // Adapted from https://github.com/progranism/Bitcoin-JavaScript-Miner/blob/master/sha256.js
  // TODO: Handle more than one block
  // TODO: Change API to support updates
  function module(stdlib, foreign, heap) {
    "use asm";

    var H = new stdlib.Int32Array(heap);
    var H8 = new stdlib.Uint8Array(heap);

    function endian_swap(x){
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

    function run() {
      var h0 = 0x6A09E667
        , h1 = 0xBB67AE85
        , h2 = 0x3C6EF372
        , h3 = 0xA54FF53A
        , h4 = 0x510E527F
        , h5 = 0x9B05688C
        , h6 = 0x1F83D9AB
        , h7 = 0x5BE0CD19;

      var a = 0x6A09E667
        , b = 0xBB67AE85
        , c = 0x3C6EF372
        , d = 0xA54FF53A
        , e = 0x510E527F
        , f = 0x9B05688C
        , g = 0x1F83D9AB
        , h = 0x5BE0CD19;

      var W = 256;
      var start = 516;
      var i = 0;
      var s0 = 0, s1 = 0, maj = 0, t2 = 0, ch = 0, t1 = 0;

      i = 0;
      while ((i|0) < 256) {
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

        i = (i + 4)|0;
      }

      H[(W+ 0)>>2] = (h0 + a)|0;
      H[(W+ 4)>>2] = (h1 + b)|0;
      H[(W+ 8)>>2] = (h2 + c)|0;
      H[(W+12)>>2] = (h3 + d)|0;
      H[(W+16)>>2] = (h4 + e)|0;
      H[(W+20)>>2] = (h5 + f)|0;
      H[(W+24)>>2] = (h6 + g)|0;
      H[(W+28)>>2] = (h7 + h)|0;
      return h0|0;
    }

    return {
      run: run
    };
  }

  var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

  var heap = new ArrayBuffer(4096);
  var int32 = new Uint32Array(heap);
  var int8 = new Int8Array(heap);
  int32.set(K);

  var offset = K.length + 64;

  var mod = module(window, {}, heap);

  window.sha256 = function(buffer, time) {
    var view = new Uint8Array(buffer);
    int32[offset] = view.length;

    var start = offset+1;
    int8.set(view, start*4);
    // Append 1 bit
    int8[(start*4) + view.length] = 128;
    // Append the length
    int8[(start+16)*4-1] = view.length * 8;
    mod.run();

    // Don't generate final hexdigest
    if (time) return;

    var str = "";
    var nums = "01234567890abcdef";
    for (var i = 0; i < 8; i++) {
      var h = int32[K.length+i].toString(16);
      var leading = (8 - h.length);
      while (leading--) str += "0";
      str += h;
    }
    return str;
  }
})();

