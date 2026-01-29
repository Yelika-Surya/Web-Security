const traverse = require("@babel/traverse").default;
const randomName = require("../random");

module.exports = function renameIdentifiers(ast) {
  const nameMap = {};

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;

      // Rename only variables/functions that belong to local scope
      if (!path.scope.hasBinding(name)) return;

      if (!nameMap[name]) {
        nameMap[name] = randomName();
      }

      path.node.name = nameMap[name];
    }
  });
};
