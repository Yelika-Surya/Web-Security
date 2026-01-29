const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

module.exports = function encodeStrings(ast) {
  traverse(ast, {
    StringLiteral(path) {
      const value = path.node.value;

      // Skip empty strings
      if (!value) return;

      // Encode using Base64
      const encoded = Buffer.from(value).toString("base64");

      // Replace "text" with decode("encoded")
      path.replaceWith(
        t.callExpression(t.identifier("_decode"), [
          t.stringLiteral(encoded)
        ])
      );
      path.skip();
    }
  });
};
