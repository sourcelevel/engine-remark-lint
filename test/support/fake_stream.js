module.exports = class FakeStream {
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
