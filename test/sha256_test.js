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
