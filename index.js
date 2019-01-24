

const SOADecLocation = './bin/SOADec.exe';
const SOAImgExLocation = './bin/SOAImgEx.exe';
const PVRTexToolLocation = './bin/PVRTexToolCLI.exe';

const INPUT_DIRECTORY = '../base_textures';
const OUTPUT_DIRECTORY = './output';

const fs = require('fs-extra');
const rimraf = require('rimraf');
const glob = require('glob');
const path = require('path');
const exec = require('child_process').execSync;

// Clean previous SOADec output
rimraf.sync(path.join(__dirname, INPUT_DIRECTORY, '*_unpack*'));

// SOADec - unpack the files
exec(`"${path.join(__dirname, SOADecLocation)}" "${path.join(__dirname, INPUT_DIRECTORY)}"`);

// get the unpacked files
const files = glob.sync(path.join(__dirname, INPUT_DIRECTORY, '*_unpack*'));

fs.mkdirpSync(path.join(__dirname, OUTPUT_DIRECTORY));

let curFile = 0;

// go through the unpacked files and unpack them more
for(file of files) {
  exec(`"${path.join(__dirname, SOAImgExLocation)}" "${file}"`);

  const texturePath = path.join(process.cwd(), 'Textures', '*');

  const generatedFiles = glob.sync(texturePath);
  
  // decompress each file
  for(genFile of generatedFiles) {
    console.log('genfile', genFile);
    exec(`"${path.join(__dirname, PVRTexToolLocation)}" -i "${genFile}" -f r8g8b8a8 -d "${path.join(__dirname, OUTPUT_DIRECTORY, `${curFile++}.png`)}"`);
  }

  rimraf.sync(texturePath);
}

// PVRTexToolCLI.exe -i tex1.ktx -d tex.png -f r8g8b8a8