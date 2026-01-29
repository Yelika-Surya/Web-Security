const parser = require("@babel/parser");

module.exports = function parse(code) {
  return parser.parse(code, {
    sourceType: "module"
  });
};
