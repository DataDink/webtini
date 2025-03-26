import FS from 'fs';
import PATH from 'path';
import UGLIFY from 'uglify-js';
import { execSync } from 'child_process';

/* HACK: At the time of this, the usual suspects (browserify, etc) were not getting the job done in a reasonable manner. */
/* NOTE: This script expects code files to have a certain formatting. */
/* TODO: Re-evaluate a better packing solution later. */

const importPath = 'packages'; // Where to find the binders
const exportPath = 'docs'; // Where to put the packed files
const packages = FS.readdirSync(importPath).map(f => PATH.join(importPath, f)); // Files to pack

for (var pkg of packages.map(p => PATH.resolve(p))) {
  var files = [{path: pkg}]; // until all dependencies are loaded
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    file.text = FS.readFileSync(file.path, 'utf-8');
    file.deps = [...file.text.matchAll(/^\s*import\s*.+?from\s*['"](.+?)['"]\s*;?$/gm)]
      .map(m => m[1])
      .map(d => PATH.resolve(PATH.dirname(file.path), d));
    for (var dep of file.deps.filter(d => !files.some(f => f.path === d))) { files.push({path: dep}); }
    // HACK: Regexing files from modules to closures. Expects files to export a default class & use simple imports.
    // NOTE: Exported classes will be public/global and must be unique.
    file.text = '\n(function() {\n'
      + file.text
        .replace(/\/\/.*$/gm, '') // line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
        .replace(/(\n\s+$)+/gm, '\n') // blank lines
        .replace(/[\r\n]+/g, '\n') // empty lines
        .replace(/^\s*import\s.+?$/gm, '') // imports
        .replace(/^\s*export\s+default\b[\s\S]+?\bclass\s+(\w+)/m, 'this.$1 = class $1') // `export default class ClassName` to `this.ClassName = class ClassName`
      + '\n})();\n';
  }
  var pack = '';
  while (files.length) { // pack in order of dependencies
    var next = files.findIndex(f => f.deps.every(d => !files.some(f => f.path === d)));
    if (next < 0) { throw new Error(`Circular dependency somewhere: ${files.map(f => f.path).join(', ')}`); }
    var resolved = files.splice(next, 1)[0];
    pack += resolved.text;
  }
  var name = PATH.basename(pkg, '.js').replace(/(?<!^)([A-Z])/g, '-$1').toLowerCase() + '-package';
  FS.writeFileSync(PATH.resolve(exportPath, name + '.js'), pack);
  var minified = UGLIFY.minify(pack, { keep_fnames: true }).code;
  FS.writeFileSync(PATH.resolve(exportPath, name + '.min.js'), minified);
  execSync(`zip ${PATH.resolve(exportPath, name + '.min.js.zip')} ${PATH.join(exportPath, name + '.min.js')}`);
}
