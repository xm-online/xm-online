const glob = require('glob');
const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const packageImporter = require('node-sass-package-importer');

const THEMES_PATH = 'src/styles/prebuild-themes/*.scss';
const DEST_PATH = 'src/assets/themes';

(() => {
    console.log('Building custom theme scss files.');

    const files = glob(THEMES_PATH, {sync: true});
    for (const file of files) {
        const name = path.basename(file).match(/^_?([a-zA-Z-]+).scss$/)[1];
        const outFile = `${DEST_PATH}/${name}.css`;

        const res = sass.renderSync({
            file,
            includePaths: ['src/styles', 'src/app/ext'],
            importer: packageImporter(),
            sourceMap: false,
            outFile: outFile,
            outputStyle: 'compressed',
        });

        fs.writeFileSync(outFile, res.css);

        console.log(`Building: ${outFile}`);
    }

    console.log('Finished building CSS.');
})();
