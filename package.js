import FS from 'fs';
import PATH from 'path';
import UGLIFY from 'uglify-js';
import { execSync } from 'child_process';
import { rollup } from 'rollup';

const importPath = 'packages'; // Where to find the binders
const exportPath = 'docs'; // Where to put the packed files
const packages = FS.readdirSync(importPath).map(f => PATH.join(importPath, f)); // Files to pack

var complete = false;
(async () => {
  for (var pkg of packages.map(p => PATH.resolve(p))) {
    var bundle = await rollup({ input: pkg });

    // Convert cammelcase to dash-case for the file name
    const name = PATH.basename(pkg, '.js');
    const file = name.replace(/(?<!^)([A-Z])/g, '-$1').toLowerCase();

    // Generate module bundle
    var module = clean((await bundle.generate({})).output[0].code);
    var moduleName = PATH.resolve(exportPath, `${file}-module.js`);
    if (FS.existsSync(moduleName)) { FS.rm(moduleName); }
    FS.writeFileSync(moduleName, module);

    // Generate UMD bundle
    var pack = clean((await bundle.generate({format: 'umd', name})).output[0].code);
    var packName = PATH.resolve(exportPath, `${file}-package.js`);
    if (FS.existsSync(packName)) { FS.rm(packName); }
    FS.writeFileSync(packName, pack);

    // Minify the UMD bundle
    var minified = UGLIFY.minify(pack, { keep_fnames: true });
    var minifiedName = PATH.resolve(exportPath, `${file}-package.min.js`);
    if (FS.existsSync(minifiedName)) { FS.rm(minifiedName); }
    FS.writeFileSync(minifiedName, minified.code);

    // Zip for download
    execSync(`
      cd ${PATH.resolve(exportPath)}
      zip ${file}.zip ${file}-package.min.js
    `);
  }
  complete = true;
})();

function clean(code) {
  return code
    .replace(/\/\/.*?$/gm, '') // Remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/[\r\n\s]*[\r\n]+/g, '\n'); // Replace empty lines
}

const interval = setInterval(() => {
  if (complete) {
    clearInterval(interval);
    return;
  }
}, 100);

