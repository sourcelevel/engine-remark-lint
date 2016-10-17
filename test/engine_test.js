var Engine = require('../lib/engine');

class FakeStream {
  constructor() {
    this.lines = [];
  }

  write(line) {
    this.lines.push(line);
  }

  read() {
    var line = this.lines.shift();
    if (line) {
      return JSON.parse(line.replace('\0', ''));
    }
  }
}

var root = `${__dirname}/fixtures`;

QUnit.module('Engine');

QUnit.test('analyzes the markdown files of a directory', function(assert) {
  var stream = new FakeStream();
  var engine = new Engine(root, { include_paths: ['README.md'], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
  engine.run();

  var issue = stream.read();

  assert.equal(issue.type, 'issue');
  assert.deepEqual(issue.categories, ['Style']);
  assert.equal(issue.check_name, 'heading-increment');
  assert.equal(issue.description, 'Heading levels should increment by one level at a time');
  assert.equal(issue.location.path, 'README.md');
  assert.equal(issue.location.lines.begin, 3);
  assert.equal(issue.location.lines.end, 3);

  issue = stream.read();

  assert.equal(issue.type, 'issue');
  assert.deepEqual(issue.categories, ['Style']);
  assert.equal(issue.check_name, 'maximum-line-length');
  assert.equal(issue.description, 'Line must be at most 80 characters');
  assert.equal(issue.location.path, 'README.md');
  assert.equal(issue.location.lines.begin, 5);
  assert.equal(issue.location.lines.end, 5);
});

QUnit.test('loads remark-lint configurations from presets defined on `.remarkrc`', function(assert) {
  var stream = new FakeStream();
  var engine = new Engine(`${root}/preset`, { include_paths: ['duplicated-definition.md'], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
  engine.run();

  var issue = stream.read();

  assert.equal(issue.type, 'issue');
  assert.deepEqual(issue.categories, ['Style']);
  assert.equal(issue.check_name, 'no-duplicate-definitions');
  assert.equal(issue.description, 'Do not use definitions with the same identifier (1:1)');
  assert.equal(issue.location.path, 'duplicated-definition.md');
  assert.equal(issue.location.lines.begin, 2);
  assert.equal(issue.location.lines.end, 2);
});

QUnit.test('generates valid issues', function(assert) {
  var stream = new FakeStream();
  var engine = new Engine(root, { include_paths: [], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
  engine.run();

  var issue = stream.read();

  while(issue) {
    assert.ok(issue.location.lines.begin);
    assert.ok(issue.location.lines.end);
    issue = stream.read()
  }
});
