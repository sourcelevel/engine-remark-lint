const assert = require('chai').assert,
    FileCollector = require('../lib/file_collector'),
    root = `${__dirname}/fixtures`;

suite('FileCollector', () => {
  test('collects all markdown files of a directory', () => {
    const collector = new FileCollector(root);
    const files = collector.collect([], []);

    assert.equal(159, files.length);
  });

  test('collects only the given files', () => {
    const collector = new FileCollector(root);
    const files = collector.collect(['foo.md'], []);

    assert.deepEqual(files, [`${root}/foo.md`]);
  });

  test('excludes specific files', () => {
    const collector = new FileCollector(root);
    const files = collector.collect([], ['foo.md']);

    assert.notOk(files.includes(`${root}/foo.md`));
  });
});
