let fs = require('fs');
let glob = require('glob');

const I_18_N = 'src/i18n/';
const I_18_N_EXT = 'src/app/ext/**/i18n/';


function mergeDeep(target, source) {
    if (typeof target == 'object' && typeof source == 'object') {
        for (const key in source) {
            if (source[key] === null && (target[key] === undefined || target[key] === null)) {
                target[key] = null;
            }
            else if (source[key] instanceof Array) {
                if (!target[key])
                    target[key] = [];
                target[key] = target[key].concat(source[key]);
            }
            else if (typeof source[key] == 'object') {
                if (!target[key])
                    target[key] = {};
                mergeDeep(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

for (let langFolder of glob(I_18_N + '*', {sync: true})) {
    let lang = langFolder.substring(I_18_N.length);
    if (lang.length > 2) {
        continue;
    }

    let translations = {};
    for (let file of glob(I_18_N + lang + '/**/*.json', {sync: true})) {
        try {
            let fileContent = JSON.parse(fs.readFileSync(file, 'utf8'));
            translations = mergeDeep(translations, fileContent)
        } catch (e) {
            console.log('Problem with %o %o', file, e);
            throw e;
        }
    }

    for (let file of glob(I_18_N_EXT + lang + '/**/*.json', {sync: true})) {
        try {
            let fileContent = JSON.parse(fs.readFileSync(file, 'utf8'));
            translations = mergeDeep(translations, fileContent)
        } catch (e) {
            console.log('Problem with %o %o', file, e);
            throw e;
        }
    }

    fs.writeFileSync(I_18_N + lang + '.json', JSON.stringify(translations, null, 4), {encoding: 'utf8'});
}
