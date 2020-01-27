const fs = require('fs');

const TRAGET_THEME = 'src/styles/_theme.scss';
const TRAGET_STYLES = 'src/styles.scss';

const terminalArgs = process.argv.slice(2);

function replaceFile(sourcePath, targetPath) {
    const source = fs.readFileSync(sourcePath);
    fs.writeFileSync(targetPath, source);
    console.info(`Finished, ${targetPath} was successfully updated.`);
}

function replace(command, value) {
    switch (command) {
        case 'theme':
            replaceFile(value, TRAGET_THEME);
            break;
        case 'styles':
            replaceFile(value, TRAGET_STYLES);
            break;
        default:
            console.warn(`Sorry, the argument ${command} is unknown command.`);
    }
}

for (let i = 0; i < terminalArgs.length; i += 2) {
    const command = terminalArgs[i];
    const value = terminalArgs[i + 1];
    replace(command, value);
}
