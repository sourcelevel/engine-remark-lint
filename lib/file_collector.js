'use strict';
var glob = require('glob'),
    path = require('path');

var MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mkd', '.mkdn', '.mkdown', '.ron'];

// Shim for `Array.prototype.includes`.
function includes(array, member) {
  return array.indexOf(member) > -1;
}

class FileCollector {
  constructor(root) {
    this.root = root;
    this.rootPrefix = new RegExp(`^${this.root}/`);
  }

  collect(includePaths, excludePaths) {
    var files = glob.sync(`${this.root}/**/*`).filter(this.filterNonMarkdownFiles);

    if (excludePaths.length) {
      files = files.filter(this.filterExcludedFiles(excludePaths));
    }

    if (includePaths.length) {
      files = files.filter(this.filterNonIncludedFiles(includePaths));
    }

    return files;
  }

  filterExcludedFiles(excludePaths) {
    return (file) => !includes(excludePaths, this.relativePathOf(file));
  }

  filterNonIncludedFiles(includePaths) {
    return (file) => includes(includePaths, this.relativePathOf(file));
  }

  filterNonMarkdownFiles(file) {
    var extname = path.extname(file);
    return includes(MARKDOWN_EXTENSIONS, extname);
  }

  relativePathOf(file) {
    return file.replace(this.rootPrefix, '');
  }
}

module.exports = FileCollector;
