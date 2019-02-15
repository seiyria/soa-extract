
const argv = require('minimist')(process.argv.slice(2));

const basepath = process.pkg ? process.cwd() : __dirname;

const SOADecLocation = argv['soa-dec-location'] || basepath + '/bin/SOADec.exe';
const SOAImgExLocation = argv['soa-imgex-location'] || basepath + '/bin/SOAImgEx.exe';
const PVRTexToolLocation = argv['pvr-textool-location'] || basepath + '/bin/PVRTexToolCLI.exe';

const INPUT_DIRECTORY = argv['input-folder'] || './input';
const OUTPUT_DIRECTORY = argv['output-folder'] || './output';
const ERROR_LOG_FILE = argv['error-log'] || './error.log';

const FILE_FILTER = argv['filter'] || '';
const COMPRESS = argv['compress'] || false;
const TRIM = argv['trim'] || false;
const RESIZE = argv['resize'] || '';

const DIFF = argv['diff'] || '';
const DIFF_LOG_FILE = argv['diff-log'] || './diff.log';
const DIFF_ONLY = argv['diff-only'] || false;

const difference = require('lodash.difference');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const glob = require('glob');
const path = require('path');
const exec = require('child_process').execSync;
const execFile = require('child_process').execFileSync;
const pngquant = require('pngquant-bin');

const doDiff = () => {
  if(!DIFF) return;

  const folder1Files = glob.sync(path.join(OUTPUT_DIRECTORY, '*')).map(x => path.basename(x));
  const folder2Files = glob.sync(path.join(DIFF, '*')).map(x => path.basename(x));

  const folder1Diff = difference(folder1Files, folder2Files);
  const folder2Diff = difference(folder2Files, folder1Files);

  let diffLog = ``;
  diffLog += `Unique files found in ${path.resolve(OUTPUT_DIRECTORY)}:\r\n\r\n`;
  diffLog += folder1Diff.length === 0 ? 'None' : folder1Diff.join('\r\n');

  diffLog += '\r\n\r\n';

  diffLog += `Unique files found in ${path.resolve(DIFF)}:\r\n\r\n`;
  diffLog += folder2Diff.length === 0 ? 'None' : folder2Diff.join('\r\n');

  fs.outputFileSync(DIFF_LOG_FILE, diffLog);

  console.log(`Diff complete. Log can be found at ${DIFF_LOG_FILE}`);
};

if(DIFF_ONLY) {
  doDiff();
  return;
}

const cwd = process.cwd();

const realPath = (str) => path.isAbsolute(str) ? str : path.join(cwd, str);

// Clean previous SOADec output
rimraf.sync(path.join(realPath(INPUT_DIRECTORY), '*_unpack*'));

// SOADec - unpack the files
exec(`"${realPath(SOADecLocation)}" "${realPath(INPUT_DIRECTORY)}"`);

// get the unpacked files
const files = glob.sync(path.join(realPath(INPUT_DIRECTORY), '*_unpack*'));

// make a directory for files to go into
fs.mkdirpSync(realPath(OUTPUT_DIRECTORY));

const errorFiles = [];

// go through the unpacked files and unpack them more
for(file of files) {

  // filter files by FILE_FILTER
  if(FILE_FILTER && file.indexOf(FILE_FILTER) === -1) continue;

  exec(`"${realPath(SOAImgExLocation)}" "${file}"`);

  const texturePath = path.join(process.cwd(), 'Textures', '*');
  const generatedFiles = glob.sync(texturePath);
  const fileNameBase = path.basename(file).split('_unpack')[0];
  
  // decompress each file
  let curGenFile = 0;
  for(genFile of generatedFiles) {
    try {
      exec(`"${realPath(PVRTexToolLocation)}" -i "${genFile}" -f r8g8b8a8 -d "${path.join(realPath(OUTPUT_DIRECTORY), `${fileNameBase}-${curGenFile++}.png`)}"`);
    } catch(e) {
      const error = `Skipping ${file} -> ${genFile}: ${e.message}`;
      errorFiles.push(error);
      console.error(new Error(error));
    }
  }
  // remove all of the old textures so we dont double-process
  rimraf.sync(texturePath);
}

// Clean SOADec output because we dont want to leave the input folder in a different state than it came
rimraf.sync(path.join(realPath(INPUT_DIRECTORY), '*_unpack*'));

if(errorFiles.length > 0) {
  fs.outputFileSync(ERROR_LOG_FILE, errorFiles.join('\r\n'));
  console.log(`${errorFiles.length} error files. Log can be found at ${ERROR_LOG_FILE}`);
}

const outputFiles = glob.sync(path.join(realPath(OUTPUT_DIRECTORY), '*'));

if(TRIM) {
  console.log('Trimming all files...');

  outputFiles.forEach(file => {
    exec(`gm convert "${file}" -trim "${file}"`);
  });

  console.log('Trimming all files... done!');
}

if(RESIZE) {
  console.log('Resizing all files...');

  outputFiles.forEach(file => {
    exec(`gm convert "${file}" -resize ${RESIZE} "${file}"`);
  });

  console.log('Resizing all files... done!');
}

if(COMPRESS) {
  console.log('Compressing all files...');

  const passArgs = typeof COMPRESS === 'string';

  outputFiles.forEach(file => {
    const args = ['-f', '-o', file, file];
    if(passArgs) args.unshift(COMPRESS);

    execFile(pngquant, args);
  });

  console.log('Compressing all files... done!');
}

doDiff();