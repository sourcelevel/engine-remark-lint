var QUnit = require('qunitjs'),
    FileCollector = require('../lib/file_collector');

var root = `${__dirname}/fixtures`;

QUnit.module('FileCollector');

QUnit.test('collects all markdown files of a directory', function(assert) {
  var collector = new FileCollector(root);
  var files = collector.collect([], []);

  assert.deepEqual(files, [`${root}/foo.md`, `${root}/README.md`]);
});

QUnit.test('collects only the given files', function(assert) {
  var collector = new FileCollector(root);
  var files = collector.collect(['foo.md'], []);

  assert.deepEqual(files, [`${root}/foo.md`]);
});

QUnit.test('excludes specific files', function(assert) {
  var collector = new FileCollector(root);
  var files = collector.collect([], ['foo.md']);

  assert.deepEqual(files, [`${root}/README.md`]);
});
