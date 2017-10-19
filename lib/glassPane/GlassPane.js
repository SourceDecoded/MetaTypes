"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Edm = require("../edm/Edm");

var _Edm2 = _interopRequireDefault(_Edm);

var _Migrator = require("../edm/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // GlassPane
// Represent an EDM, manage its corresponding DB and Migrator


var _class = function _class(options) {
    _classCallCheck(this, _class);

    this.edm = options.edm;
    this.metaDatabase = options.metaDatabase;
    this.migrator = options.migrator;
}
// I can't quite remember what the GlassPane is supposed to do, but it is currently very good at holding
// on to an EDM and its related things.
;

exports.default = _class;
//# sourceMappingURL=GlassPane.js.map