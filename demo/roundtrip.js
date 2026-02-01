function _decode(_0x77e2c65e) {
  return Buffer.from(_0x77e2c65e, "base64").toString("utf8");
}
function _main() {
  function _0xb41434ad(_0xfb1726d3) {
    const _0x259eec04 = _decode("SGVsbG8g") + _0xfb1726d3;
    return _0x259eec04;
  }
  console.log(_0xb41434ad(_decode("V29ybGQ=")));
}
_main();
const fs = require("fs");

const __EXPECTED_FILE_HASH__ = "e8b39fb1879544477092a15aa61274a6e22f32c97c272f0cff55582edcb91e2a";

const __TAMPERED__ = __verifyFileIntegrity();

if (__TAMPERED__) {
  console.warn("⚠️ Integrity check failed. File has been modified.");
}
