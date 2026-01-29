const generator = require("@babel/generator").default;

module.exports = function generate(ast) {
  return generator(ast, {
    minified: false
  }).code;
};
