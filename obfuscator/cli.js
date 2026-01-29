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

encodeStrings(ast);

const decoderAst = parse(
  'function _decode(str){return Buffer.from(str,"base64").toString("utf8");}'
);
ast.program.body.unshift(decoderAst.program.body[0]);

renameIdentifiers(ast);//transform the AST

const outputCode = generate(ast); //generate code from AST

fs.writeFileSync(outputPath, outputCode);//write the output code to file

console.log("Roundtrip.js is generated");