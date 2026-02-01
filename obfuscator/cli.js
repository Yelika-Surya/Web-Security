console.log("Obfuscator module loaded.......\n");
const fs = require("fs"); //file system
const path = require("path");
const parse = require("./parser");
const generate = require("./generator");
const renameIdentifiers = require("./transforms/renameIdentifiers");
const encodeStrings = require("./transforms/encodeStrings");
const t = require("@babel/types");


//Add the file path 
const inputPath = path.join(__dirname, "../demo/original.js");
const outputPath = path.join(__dirname, "../demo/roundtrip.js");

const code = fs.readFileSync(inputPath, "utf8");//read the file content

console.log("Input code loaded:\n");//print the code

const ast = parse(code);//parse the code to AST


//inject integrity check functions
const integrityAst = parse(`
function _hash(str){
  let h=0;
  for(let i=0;i<str.length;i++){
    h=(h<<5)-h+str.charCodeAt(i);
    h|=0;
  }
  return h;
}

function __integritySnapshot(){
  const snapshot = {};
  try{
    snapshot.main = _hash(_main.toString());
  }catch(e){
    snapshot.main = null;
  }
  return snapshot;
}
`);

ast.program.body.unshift(...integrityAst.program.body);

encodeStrings(ast);

const decoderAst = parse(
  'function _decode(str){return Buffer.from(str,"base64").toString("utf8");}'
);
ast.program.body.unshift(decoderAst.program.body[0]);

renameIdentifiers(ast);//transform the AST

//inject integrity snapshot
const snapshotAst = parse(`
const __INTEGRITY__ = __integritySnapshot();
`);
ast.program.body.push(snapshotAst.program.body[0]);

//inject expected integrity
const expectedAst = parse(`
const __EXPECTED_INTEGRITY__ = __INTEGRITY__.main;
`);
ast.program.body.push(expectedAst.program.body[0]);

//inject tamper check
const compareAst = parse(`
const __TAMPERED__ =
  !__INTEGRITY__ ||
  __INTEGRITY__.main !== __EXPECTED_INTEGRITY__;
`);
ast.program.body.push(compareAst.program.body[0]);

//inject response to tampering
const responseAst = parse(`
if (typeof __TAMPERED__ !== "undefined" && __TAMPERED__) {
  console.warn("⚠️ Integrity check failed. Limited functionality enabled.");
}
`);
ast.program.body.push(responseAst.program.body[0]);

const outputCode = generate(ast); //generate code from AST

fs.writeFileSync(outputPath, outputCode);//write the output code to file

console.log("Roundtrip.js is generated");