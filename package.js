import FS from 'fs';
import PATH from 'path';
import UGLIFY from 'uglify-js';
import { execSync } from 'child_process';
import { rollup } from 'rollup';

const namespace = 'webtini';
const importPath = 'packages'; // Where to find the binders
const exportPath = process.argv[2]; // Where to put the packed files
const packages = FS.readdirSync(importPath).map(f => PATH.join(importPath, f)); // Files to pack

if (!exportPath) { throw new Error("Output path not specified"); }

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

    // Minify the module bundle
    var minModule = UGLIFY.minify(module, { keep_fnames: true });
    var minModuleName = PATH.resolve(exportPath, `${file}-module.min.js`);
    if (FS.existsSync(minModuleName)) { FS.rm(minModuleName); }
    FS.writeFileSync(minModuleName, minModule.code);

    // Generate UMD bundle
    var pack = clean((await bundle.generate({format: 'umd', name: namespace})).output[0].code);
    var packName = PATH.resolve(exportPath, `${file}-package.js`);
    if (FS.existsSync(packName)) { FS.rm(packName); }
    FS.writeFileSync(packName, pack);

    // Minify the UMD bundle
    var minPack = UGLIFY.minify(pack, { keep_fnames: true });
    var minPackName = PATH.resolve(exportPath, `${file}-package.min.js`);
    if (FS.existsSync(minPackName)) { FS.rm(minPackName); }
    FS.writeFileSync(minPackName, minPack.code);

    // Zip for download
    execSync(`
      cd ${PATH.resolve(exportPath)}
      zip ${file}.zip ${file}-package.min.js ${file}-module.min.js
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

