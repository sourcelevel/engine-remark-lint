'use strict';
var remark = require('remark'),
    lint = require('remark-lint'),
    jetpack = require('fs-jetpack'),
    FileCollector = require('./file_collector');

class Engine {
  constructor(directory, engineConfig, io) {
    this.directory = directory;
    this.directoryPrefix = new RegExp(`^${this.directory}/`);
    this.engineConfig = engineConfig;
    this.io = io;

    this.collector = new FileCollector(this.directory);
    this.processor = remark().use(lint, this.loadConfiguration(this.directory));
  }

  run() {
    var paths = this.collector.collect(
        this.engineConfig.include_paths, this.engineConfig.exclude_paths);

    paths.forEach(path => {
      var contents = jetpack.read(path);

      this.processor.process(contents, (err, result) => {
        result.messages.forEach(message => {
          var issue = this.convertToIssue(message, path, contents);

          this.io.write(`${JSON.stringify(issue)}\0`);
        });
      });
    });
  }

  convertToIssue(message, path, contents) {
    return {
      type: 'issue',
      categories: ['Style'],
      check_name: message.ruleId, // eslint-disable-line camelcase
      description: message.message,
      location: {
        path: this.sanitizePath(path),
        lines: this.extractLines(message, contents)
      }
    }
  }

  extractLines(message, contents) {
    if (message.ruleId == 'final-newline') { // eslint-disable-line camelcase
      lines = message.split("\n");
      return {
        begin: lines.count,
        end: lines.count
      }
    } else {
      return {
        begin: message.location.start.line,
        end: message.location.end.line || message.location.start.line
      }
    }
  }

  sanitizePath(path) {
    return path.replace(this.directoryPrefix, '');
  }

  loadConfiguration(directory) {
    var local = jetpack.read(`${directory}/.remarkrc`, 'json'),
        pkg = jetpack.read(`${directory}/package.json`, 'json');

    if (local && local['plugins'] && local['plugins']['lint']) {
      return local['plugins']['lint'];
    } else if (pkg && pkg['remarkConfig']) {
      return pkg['remarkConfig'];
    }
  }
}


module.exports = Engine;
