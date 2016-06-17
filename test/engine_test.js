'use strict';
var QUnit = require('qunitjs'),
    Engine = require('../lib/engine');

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
  var engine = new Engine(root, { include_paths: [], exclude_paths: [] }, stream);  // eslint-disable-line camelcase
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
