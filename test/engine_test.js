const assert = require('chai').assert,
    Engine = require('../lib/engine'),
    FakeStream = require('./support/fake_stream'),
    root = `${__dirname}/fixtures`;

suite('Engine', () => {
  test('analyzes the markdown files of a directory', () => {
    const stream = new FakeStream();
    const engine = new Engine(root, { include_paths: ['README.md'], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
    engine.run();

    let issue = stream.read();

    assert.equal(issue.type, 'issue');
    assert.deepEqual(issue.categories, ['Style']);
    assert.equal(issue.check_name, 'heading-increment');
    assert.equal(issue.description, 'Heading levels should increment by one level at a time');
    assert.equal(issue.remediation_points, 50000);
    assert.equal(issue.location.path, 'README.md');
    assert.equal(issue.location.lines.begin, 3);
    assert.equal(issue.location.lines.end, 3);

    issue = stream.read();

    assert.equal(issue.type, 'issue');
    assert.deepEqual(issue.categories, ['Style']);
    assert.equal(issue.check_name, 'maximum-line-length');
    assert.equal(issue.description, 'Line must be at most 80 characters');
    assert.equal(issue.remediation_points, 50000);
    assert.equal(issue.location.path, 'README.md');
    assert.equal(issue.location.lines.begin, 5);
    assert.equal(issue.location.lines.end, 5);
  });


  test('loads remark-lint configurations from presets defined on `.remarkrc`', () => {
    const stream = new FakeStream();
    const engine = new Engine(`${root}/preset`, { include_paths: ['duplicated-definition.md'], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
    engine.run();

    const issue = stream.read();

    assert.equal(issue.type, 'issue');
    assert.deepEqual(issue.categories, ['Style']);
    assert.equal(issue.check_name, 'no-duplicate-definitions');
    assert.equal(issue.description, 'Do not use definitions with the same identifier (1:1)');
    assert.equal(issue.remediation_points, 50000);
    assert.equal(issue.location.path, 'duplicated-definition.md');
    assert.equal(issue.location.lines.begin, 2);
    assert.equal(issue.location.lines.end, 2);
  });

  test('generates valid issues', () => {
    const stream = new FakeStream();
    const engine = new Engine(root, { include_paths: [], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
    engine.run();

    let issue = stream.read();

    while(issue) {
      assert.ok(issue.location.lines.begin);
      assert.ok(issue.location.lines.end);
      issue = stream.read()
    }
  });
});
