var QUnit = require('qunitjs'),
    tap = require('qunit-tap');

tap(QUnit, console.log);
QUnit.config.autorun = false;

require('./engine_test');
require('./file_collector_test');

QUnit.load();
