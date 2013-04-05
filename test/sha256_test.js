var s = new sha256;

QUnit.testStart(function() {
  s.init();
});

test("empty string", function() {
  equal(s.final(), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("less than one block", function() {
  s.update("Hello world!");
  equal(s.final(), "c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a");
});

test("exactly one block", function() {
  s.update("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  equal(s.final(), "ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb");
});

test("multiple updates", function() {
  s.update("Hello ");
  s.update("world!");
  equal(s.final(), "c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a");
});

test("multiple blocks", function() {
  s.update("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  equal(s.final(), "635361c48bb9eab14198e76ea8ab7f1a41685d6ad62aa9146d301d4f17eb0ae0");
});

test("multiple blocks across several updates", function() {
  s.update("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  s.update("aaaaa");
  equal(s.final(), "635361c48bb9eab14198e76ea8ab7f1a41685d6ad62aa9146d301d4f17eb0ae0");
});

test("bigger than heap", function() {
  throws(function() {
    s.update(Array(10000).join('a'));
  });
});

