var s = new sha256;

QUnit.testStart(function() {
  s.init();
});

test("empty string", function() {
  equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", s.final());
});

test("less than one block", function() {
  s.update("Hello world!");
  equal("c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a", s.final());
});

test("exactly one block", function() {
  s.update("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  equal("ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb", s.final());
});

test("multiple updates", function() {
  s.update("Hello ");
  s.update("world!");
  equal("c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a", s.final());
});
