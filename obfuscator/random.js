const crypto = require("crypto");

module.exports = function randomName() {
  return "_0x" + crypto.randomBytes(4).toString("hex");
};
