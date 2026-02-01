function _decode(_0x72e292c7) {
  return Buffer.from(_0x72e292c7, "base64").toString("utf8");
}
function _hash(_0x72e292c7) {
  let _0x45727319 = 0;
  for (let _0x6bb73e90 = 0; _0x6bb73e90 < _0x72e292c7.length; _0x6bb73e90++) {
    _0x45727319 = (_0x45727319 << 5) - _0x45727319 + _0x72e292c7.charCodeAt(_0x6bb73e90);
    _0x45727319 |= 0;
  }
  return _0x45727319;
}
function __integritySnapshot() {
  const _0x898f625a = {};
  try {
    _0x898f625a.main = _hash(_main.toString());
  } catch (_0x8ce5ed83) {
    _0x898f625a.main = null;
  }
  return _0x898f625a;
}
function _main() {
  function _0xfdd81e07(_0x109a0a42) {
    const _0x53bc8441 = _decode("SGVsbG8g") + _0x109a0a42;
    return _0x53bc8441;
  }
  console.log(_0xfdd81e07(_decode("V29ybGQ1223")));
}
_main();
const __INTEGRITY__ = __integritySnapshot();
const __EXPECTED_INTEGRITY__ = __INTEGRITY__.main;
const __TAMPERED__ = !__INTEGRITY__ || __INTEGRITY__.main !== __EXPECTED_INTEGRITY__;
if (typeof __TAMPERED__ !== "undefined" && __TAMPERED__) {
  console.warn("⚠️ Integrity check failed. Limited functionality enabled.");
}