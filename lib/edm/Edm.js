"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edm = function Edm(name, label, version) {
    _classCallCheck(this, Edm);

    this.name = null;
    this.label = null;
    this.version = null;
    this.tables = [];
    this.relationships = {
        oneToOne: [],
        oneToMany: []
    };
};

exports.default = Edm;
//# sourceMappingURL=Edm.js.map