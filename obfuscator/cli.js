console.log("Obfuscator started\n");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const parse = require("./parser");
const generate = require("./generator");
const renameIdentifiers = require("./transforms/renameIdentifiers");
const encodeStrings = require("./transforms/encodeStrings");

/* ---------------------------------------------
   PATHS
--------------------------------------------- */

const inputPath = path.join(__dirname, "../demo/original.js");
const outputPath = path.join(__dirname, "../demo/roundtrip.js");

/* ---------------------------------------------
   READ SOURCE
--------------------------------------------- */

const sourceCode = fs.readFileSync(inputPath, "utf8");
const ast = parse(sourceCode);

/* ---------------------------------------------
   OBFUSCATION
--------------------------------------------- */

// Encode string literals
encodeStrings(ast);

// Decoder function (needed at runtime)
const decoderAst = parse(`
function _decode(str) {
  return Buffer.from(str, "base64").toString("utf8");
}
`);
ast.program.body.unshift(decoderAst.program.body[0]);

// Rename variables and functions
renameIdentifiers(ast);

/* ---------------------------------------------
   RUNTIME INTEGRITY CHECK FUNCTION
   (this runs INSIDE roundtrip.js)
--------------------------------------------- */

const integrityAst = parse(`
const fs = require("fs");
const crypto = require("crypto");

function __verifyFileIntegrity() {
  try {
    const fileBuffer = fs.readFileSync(__filename);
    const runtimeHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    return runtimeHash !== __EXPECTED_FILE_HASH__;
  } catch (e) {
    return true;
  }
}
`);
ast.program.body.push(integrityAst.program.body[0]);

/* ---------------------------------------------
   GENERATE OBFUSCATED CODE
--------------------------------------------- */

let outputCode = generate(ast);

/* ---------------------------------------------
   BUILD-TIME HASH (FULL FILE)
--------------------------------------------- */

const buildHash = crypto
  .createHash("sha256")
  .update(outputCode, "utf8")
  .digest("hex");

/* ---------------------------------------------
   APPEND RUNTIME CHECK (ORDER MATTERS)
--------------------------------------------- */

outputCode += `

const __EXPECTED_FILE_HASH__ = "${buildHash}";

const __TAMPERED__ = __verifyFileIntegrity();

if (__TAMPERED__) {
  console.warn("⚠️ Integrity check failed. File has been modified.");
}
`;

/* ---------------------------------------------
   WRITE OUTPUT
--------------------------------------------- */

fs.writeFileSync(outputPath, outputCode);

console.log("✔ roundtrip.js generated with byte-level integrity");
