const traverse = require("@babel/traverse").default;
const randomName = require("../random");

module.exports = function renameIdentifiers(ast) {
  const nameMap = {};

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;

      // protect special runtime helpers
      if (name === "_decode") return;
      if (name === "__integritySnapshot") return;
      if (name === "_hash") return;
      if (name === "__INTEGRITY__") return;
      if (name === "_main") return;
        // only rename if it's a binding in the current scope
      if (!path.scope.hasBinding(name)) return;

      if (!nameMap[name]) {
        nameMap[name] = randomName();
      }

      path.node.name = nameMap[name];
    }
  });
};
