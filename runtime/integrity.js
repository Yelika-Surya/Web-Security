function _hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  return h;
}

function __integritySnapshot() {
  const snapshot = {};

  try {
    snapshot.main = _hash(_main.toString());
  } catch (e) {
    snapshot.main = null;
  }

  return snapshot;
}
