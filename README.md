# Shasm.js: SHA256 meets asm.js

SHA256 implementation in asm.js.

```
var s = new sha256;

s.init();
s.update("string or Int8Array");
var hex = s.finish();
```

(Note: due to a limitation in asm.js it's currently not possible to create
multiple instances of `sha256`).

