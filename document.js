import {exec} from 'child_process';

const output = process.argv[2];
if (!output) { throw new Error("Output path not specified"); }
const command = `./node_modules/.bin/jsdoc ./src/* -d ${output} -R ./README.md -c ./document.json`;
exec(command);