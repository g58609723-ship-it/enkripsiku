import * as acorn from "acorn";
import * as escodegen from "escodegen";

// ============================================
// IDENTIFIER SOURCE
// ============================================
export const IDENTIFIER_SOURCE: Record<string, string> = {
  obf: "/*Encrypted^~^/*^/*($break)*/" + "/*Encrypted^~^/*^/*($break)*/",
  enchard: "/*Pprimrosereyy:D/*^/*($break)*/" + "/*Pprimrosereyy:D/*^/*($break)*/",
  encbreak: "/*($break)/*^/*($break)*/" + "/*($break)/*^/*($break)*/",
  invisibleenc: "/*\u2000*/\u2000",
  encnull: "/*null/*^/*null*/" + "/*null*/",
  encvar: "/*var = [ undefinded ]/*^/*($break)*/" + "/*var = [ undefinded ]/*^/*($break)*/",
  encundf: "/*undefined_at_line_9999/*^/*($break)*/" + "/*undefined_at_line_9999/*^/*($break)*/",
  encnan: "/*NaN/*^/*($break)*/" + "/*NaN/*^/*($break)*/",
  enctostring: "/*tosring/*^/*($break)*/" + "/*tosring/*^/*($break)*/",
  encquery: "/*q/*^/*($break)*/" + "/*q/*^/*($break)*/",
  customname: "/*CUSTOM/*^/*($break)*/",
};

function b64(s: string): string {
  return Buffer.from(s).toString("base64");
}

export function identifierGeneratorFactory(mode: string, customName?: string) {
  const originalString = customName || IDENTIFIER_SOURCE[mode] || "encrypted";
  function clean(str: string) {
    return str.replace(/[^a-zA-Z0-9_$]/g, "").slice(0, 20) || "encrypted";
  }
  function rand(len: number) {
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let r = "";
    for (let i = 0; i < len; i++) r += c[Math.floor(Math.random() * c.length)];
    return r;
  }
  return () => clean(originalString) + rand(3);
}

const RUNTIME_BASE64 = `function _rx(b){return Buffer.from(b,"base64").toString()}
const _rr=(m)=>require(m);`;

// ============================================
// TRANSFORM STRINGS & REGEX
// ============================================
export function transformAllStringsAndRegex(code: string): string {
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "script",
    allowReturnOutsideFunction: true,
  });

  const skipNodes = new Set<any>();
  const first = ast.body[0] as any;
  if (first?.expression?.value === "use strict") {
    skipNodes.add(first.expression);
  }

  function markSkips(node: any) {
    if (!node || typeof node !== "object") return;
    if (node.type === "ImportDeclaration" && node.source) {
      skipNodes.add(node.source);
    }
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (Array.isArray(child)) child.forEach(markSkips);
      else if (child && typeof child === "object") markSkips(child);
    }
  }
  markSkips(ast);

  function walkNode(node: any) {
    if (!node || typeof node !== "object") return;

    if (node.type === "TemplateLiteral") {
      if (node.expressions.length === 0) {
        const cooked = node.quasis[0].value.cooked;
        node.type = "CallExpression";
        node.callee = { type: "Identifier", name: "_rx" };
        node.arguments = [{
          type: "Literal",
          value: b64(cooked),
          raw: `"${b64(cooked)}"`,
        }];
        delete node.quasis;
        delete node.expressions;
      } else {
        let expr: any = null;
        node.quasis.forEach((q: any, i: number) => {
          const text = q.value.cooked;
          if (text) {
            const call = {
              type: "CallExpression",
              callee: { type: "Identifier", name: "_rx" },
              arguments: [{
                type: "Literal",
                value: b64(text),
                raw: `"${b64(text)}"`,
              }],
            };
            expr = expr
              ? { type: "BinaryExpression", operator: "+", left: expr, right: call }
              : call;
          }
          if (node.expressions[i]) {
            expr = expr
              ? { type: "BinaryExpression", operator: "+", left: expr, right: node.expressions[i] }
              : node.expressions[i];
          }
        });
        Object.assign(node, expr);
      }
      return;
    }

    if (node.type === "Literal" && !skipNodes.has(node)) {
      if (node.regex) {
        node.type = "NewExpression";
        node.callee = { type: "Identifier", name: "RegExp" };
        node.arguments = [
          {
            type: "CallExpression",
            callee: { type: "Identifier", name: "_rx" },
            arguments: [{
              type: "Literal",
              value: b64(node.regex.pattern),
              raw: `"${b64(node.regex.pattern)}"`,
            }],
          },
          node.regex.flags ? { type: "Literal", value: node.regex.flags } : null,
        ].filter(Boolean);
        delete node.regex;
        delete node.value;
        delete node.raw;
        return;
      }

      if (typeof node.value === "string") {
        node.type = "CallExpression";
        node.callee = { type: "Identifier", name: "_rx" };
        node.arguments = [{
          type: "Literal",
          value: b64(node.value),
          raw: `"${b64(node.value)}"`,
        }];
        delete node.value;
        delete node.raw;
      }
    }

    if (
      node.type === "CallExpression" &&
      node.callee?.name === "require" &&
      node.arguments[0]?.type === "Literal"
    ) {
      node.callee.name = "_rr";
    }

    for (const key of Object.keys(node)) {
      if (key === "type") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(walkNode);
      else if (child && typeof child === "object") walkNode(child);
    }
  }

  walkNode(ast);
  return RUNTIME_BASE64 + "\n" + escodegen.generate(ast, { format: { compact: true } });
}

// ============================================
// BANNER
// ============================================
export function getBanner(): string {
  return `/*
    Encrypt By: Primrosereyy ^~^
        My Support:
        Than XS #BestFriend
        Daffa #BestFriend
        Rapli #BestFriend
        Rapipp #BestFriend
        Drayy #BestFriend

    Contact:
     @xberlianmine
     bot enc:
      @reyyobfuscation_bot
*/
//===== [ X ] — Primrosereyy =====//\n`;
}

// ============================================
// CUSTOM OBFUSCATOR
// ============================================
const GLOBALS = new Set([
  "console", "require", "Buffer", "process", "module", "exports", "eval",
  "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURI", "decodeURI",
  "encodeURIComponent", "decodeURIComponent", "escape", "unescape",
  "Object", "Array", "String", "Number", "Boolean", "Date", "RegExp", "Error",
  "Math", "JSON", "Promise", "Set", "Map", "WeakSet", "WeakMap", "Symbol",
  "ArrayBuffer", "Uint8Array", "Int8Array", "Uint16Array", "Int16Array",
  "Uint32Array", "Int32Array", "Float32Array", "Float64Array", "DataView",
  "Function", "Infinity", "NaN", "undefined", "_rx", "_rr",
  "document", "window", "global", "globalThis",
]);

function collectDeclarations(node: any, mapping: Map<string, string>, idGen: () => string) {
  if (!node || typeof node !== "object") return;
  if (node.type === "VariableDeclarator" && node.id?.type === "Identifier" && !GLOBALS.has(node.id.name)) {
    if (!mapping.has(node.id.name)) mapping.set(node.id.name, idGen());
  }
  if ((node.type === "FunctionDeclaration" || node.type === "FunctionExpression") && node.id?.type === "Identifier" && !GLOBALS.has(node.id.name)) {
    if (!mapping.has(node.id.name)) mapping.set(node.id.name, idGen());
  }
  if (node.type === "ClassDeclaration" && node.id?.type === "Identifier" && !GLOBALS.has(node.id.name)) {
    if (!mapping.has(node.id.name)) mapping.set(node.id.name, idGen());
  }
  for (const key of Object.keys(node)) {
    if (key === "type") continue;
    const child = node[key];
    if (Array.isArray(child)) child.forEach((c) => collectDeclarations(c, mapping, idGen));
    else if (child && typeof child === "object") collectDeclarations(child, mapping, idGen);
  }
}

function renameAll(node: any, mapping: Map<string, string>, parent?: any) {
  if (!node || typeof node !== "object") return;
  if (node.type === "Identifier" && mapping.has(node.name)) {
    if (parent?.type === "MemberExpression" && parent.property === node && !parent.computed) {
      // keep original
    } else {
      node.name = mapping.get(node.name)!;
    }
  }
  for (const key of Object.keys(node)) {
    if (key === "type") continue;
    const child = node[key];
    if (Array.isArray(child)) child.forEach((c) => renameAll(c, mapping, node));
    else if (child && typeof child === "object") renameAll(child, mapping, node);
  }
}

function injectDeadCode(node: any) {
  if (!node || typeof node !== "object") return;
  if (node.type === "BlockStatement" && Array.isArray(node.body)) {
    const templates = [
      "if(+[]===0){var _0xdead=+[];}",
      "while(false){break;}",
      "for(var _0xdead=0;_0xdead<0;_0xdead++){continue;}",
      "try{throw 0;}catch(_0xdead){}",
    ];
    const newBody: any[] = [];
    for (const stmt of node.body) {
      if (Math.random() > 0.82) {
        const junk = acorn.parse(templates[Math.floor(Math.random() * templates.length)], {
          ecmaVersion: "latest",
          sourceType: "script",
        });
        newBody.push(junk.body[0]);
      }
      newBody.push(stmt);
      injectDeadCode(stmt);
    }
    node.body = newBody;
  } else {
    for (const key of Object.keys(node)) {
      if (key === "type") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(injectDeadCode);
      else if (child && typeof child === "object") injectDeadCode(child);
    }
  }
}

export async function customObfuscate(code: string, mode: string): Promise<string> {
  let source = transformAllStringsAndRegex(code);
  const ast = acorn.parse(source, {
    ecmaVersion: "latest",
    sourceType: "script",
    allowReturnOutsideFunction: true,
  });
  const idGen = identifierGeneratorFactory(mode);
  const mapping = new Map<string, string>();
  collectDeclarations(ast, mapping, idGen);
  renameAll(ast, mapping);
  injectDeadCode(ast);
  const obfuscated = escodegen.generate(ast, { format: { compact: true } });
  return getBanner() + obfuscated;
}

// ============================================
// CUSTOM NAME OBFUSCATION (FIXED)
// ============================================
export function generateCustomNameObfuscation(code: string, customName: string): string {
  const b64Code = Buffer.from(code).toString("base64");
  const chunks: string[] = [];
  let idx = 0;
  while (idx < b64Code.length) {
    const size = Math.floor(Math.random() * 4) + 2;
    chunks.push(b64Code.slice(idx, idx + size));
    idx += size;
  }

  const START_MARKER = `/*${customName}`;
  const END_MARKER = "/*^/*($break)*/";

  // Build decoder (NO undefined variables, NO broken regex)
  const decoder = `
(function(){
  var _0rx=function(b){return Buffer.from(b,"base64").toString()};
  var _0req=function(m){return require(m)};
  var _0src=function(){
    if(typeof document!=="undefined"&&document.currentScript){
      return document.currentScript.text;
    }
    try{
      var e=new Error();
      var s=e.stack;
      var m=s.match(/at [^\\(]*\\(([^:]+):\\d+:\\d+\\)/);
      if(m)return _0req("fs").readFileSync(m[1],"utf8");
      m=s.match(/at ([^:]+):\\d+:\\d+/);
      if(m)return _0req("fs").readFileSync(m[1],"utf8");
    }catch(x){}
    return "";
  };
  var txt=_0src();
  var re=/\\*\\/${customName}([a-zA-Z0-9+/=]{2,5})\\*\\^\\/\\*\\(\\$break\\)\\*\\//g;
  var out="";
  var ma;
  while((ma=re.exec(txt))!==null){
    out+=ma[1];
  }
  var decoded=Buffer.from(out,"base64").toString();
  eval(decoded);
})();
  `.trim();

  const transformedFull = transformAllStringsAndRegex(decoder);

  const runtimePrefix = RUNTIME_BASE64 + "\n";
  let runtime = "";
  let decoderCode = transformedFull;
  if (transformedFull.startsWith(runtimePrefix)) {
    runtime = RUNTIME_BASE64;
    decoderCode = transformedFull.slice(runtimePrefix.length);
  }

  const half = Math.floor(chunks.length / 2);
  const beforeChunks = chunks
    .slice(0, half)
    .map((c) => `${START_MARKER}${c}${END_MARKER}`)
    .join("\n");
  const afterChunks = chunks
    .slice(half)
    .map((c) => `${START_MARKER}${c}${END_MARKER}`)
    .join("\n");

  return getBanner() + runtime + beforeChunks + "\n\n" + decoderCode + "\n\n" + afterChunks;
}
