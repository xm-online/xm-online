var sass = require('node-sass');
var fs = require('fs');

if (!process.argv[2]) {
    throw 'Color not found. Example: npm run generate-theme <color>';
}
var color = process.argv[2];
var colors = [color];
if (color == 'all') {
    colors = [];

    var colorsFile = 'src/assets/sass/material-dashboard/_colors.scss';
    var materialColors = fs.readFileSync(colorsFile, 'utf8');

    console.log(materialColors);

    var regex = /\$([\w-]*)-100:/gm, result;
    while ( (result = regex.exec(materialColors)) ) {
        colors.push(result[1]);
    }
}

console.log(colors);

for (var i = 0; i < colors.length; i++) {

    var generatorContent = fs.readFileSync('src/assets/sass/theme-generator/theme-generator.scss', 'utf8');

    var variablesFile = 'src/assets/sass/theme-generator/parts/_variables.scss';
    var variables = fs.readFileSync(variablesFile, 'utf8');
    variables = variables.replace(new RegExp("(\\$brand-primary)(-*\\d*)(:\\s)(\\$[\\w-]*\\s*)(;*)", "gm"), "$1$2$3$" + colors[i] + "$2$5");
    fs.writeFileSync(variablesFile, variables);

    var result = sass.renderSync({
        file: 'src/assets/sass/theme-generator/theme-generator.scss'
    });

    fs.writeFileSync('src/assets/css/theme/material-' + colors[i] + '.css', result.css.toString());

    console.log(colors[i] + ' generated');

}

console.log('OK');

