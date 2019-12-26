let fs = require('fs');
let glob = require('glob');

const I_18_N = 'src/i18n/';

/** Adds all the elements in the
 * specified arrays to this array. */
Array.prototype.addAll = function () {
    for (let a = 0; a < arguments.length; a++) {
        let arr = arguments[a];
        if (!arr) {
            continue;
        }
        for (let i = 0; i < arr.length; i++) {
            this.push(arr[i]);
        }
    }
};

function getTrKeys(htmlFile) {
    let trKeys = [];

    function processRegexp(regexp) {
        let trKeys = [];
        let trKeysResults;
        while ((trKeysResults = regexp.exec(htmlFile))) {
            let trKey = trKeysResults[1];

            let defValue = trKeysResults.input.substring(trKeysResults.index);
            defValue = defValue.substring(defValue.indexOf('>') + 1, defValue.indexOf('<')).trim();

            trKeys.push({
                key: trKey,
                defaultValue: defValue
            });
            if (!/^[\.\w\{\}ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+$/.test(trKeysResults[1])) {
                let error = `Can not parse translation key: ${trKeysResults[1]}`;
                console.error(error);
                throw new Error(error);
            }
        }
        return trKeys;
    }

    trKeys.addAll(processRegexp(/\sjhiTranslate="((?:\\.|[^"\\])*)"/gm));
    trKeys.addAll(processRegexp(/\sjhiTranslate='((?:\\.|[^'\\])*)'/gm));

    return trKeys;
}

function detectLangFiles(jsFile) {
    let langFiles = /\.setLocations\(\[(.*)\]\)/gm.exec(jsFile);
    let files = [];

    if (langFiles) {
        langFiles[1].split('\'').join('').split('"').join('').split(',').forEach(file => files.push(file.trim()));
    }

    let addLocationRegexp = /\.addLocation\(['"](.*)['"]\)/gm;
    let additionalLangFiles;
    while (additionalLangFiles = addLocationRegexp.exec(jsFile)) {
        files.push(additionalLangFiles[1].trim());
    }

    if (/@UseGlobalTranslations/gm.exec(jsFile)) {
        files.push('global');
    }

    return files;
}

function scanTsFilesToLangFiles() {
    let templateLangFiles = {};
    for (let file of glob('**/*.ts', {sync: true})) {
        if (!file.startsWith('src/')) {
            continue;
        }

        // parse templateUrl
        let jsFile = fs.readFileSync(file, 'utf8');
        let templateUrl = /templateUrl:\s*['|"][\/\.\w-]*\/([\.\w-]*)['|"]/gm.exec(jsFile);
        templateUrl = templateUrl ? templateUrl[1] : file;
        templateLangFiles[templateUrl] = templateLangFiles[templateUrl] ? templateLangFiles[templateUrl] : [];
        templateLangFiles[templateUrl].addAll(detectLangFiles(jsFile));

        if (/\w*\.instant\s*\(/g.exec(jsFile) || /translateService\.get\s*\(/g.exec(jsFile)) {
            templateLangFiles[file] = templateLangFiles[file] ? templateLangFiles[file] : [];
            templateLangFiles[file].addAll(detectLangFiles(jsFile));
        }
    }
    return templateLangFiles;
}

function scanInlineComponentHtmlToTranslations() {
    let translationKeys = {};
    for (let file of glob('**/*.ts', {sync: true})) {
        if (!file.startsWith('src/')) {
            continue;
        }

        let jsFile = fs.readFileSync(file, 'utf8');
        //read inline html im components
        let inlineTemplateRegexp = /(?:@View|@Component)\s*\(\s*\{[.\s\W\w]*template:\s`([.\n\r\w\W]*)`[.\s\W\w]*\}\s*\)[.\s\W\w]*\sclass\s/gm;
        let inlineTemplate = inlineTemplateRegexp.exec(jsFile);
        if (inlineTemplate) {
            translationKeys[file] = getTrKeys(inlineTemplate[1]);
        }
    }
    return translationKeys;
}

function scanTypeScriptToTranslations() {
    let translationKeys = {};

    let processRegexp = function (inlineTranslateRegexp, jsFile) {
        let trKeys = [];
        let trKeysResults;
        while ((trKeysResults = inlineTranslateRegexp.exec(jsFile))) {
            let trKey = trKeysResults[1];

            trKeys.push({
                key: trKey,
                defaultValue: ''
            });
        }
        return trKeys;
    };

    for (let file of glob('**/*.ts', {sync: true})) {
        if (!file.startsWith('src/')) {
            continue;
        }

        let jsFile = fs.readFileSync(file, 'utf8');
        //read inline html im components
        let trKeys = processRegexp(/\w*\.instant\s*\(\s*['"]([\.\w]+)['"]\s*\)/gm, jsFile);
        let trKeys2 = processRegexp(/translateService\.get\s*\(\s*['"]([\.\w]+)['"]\s*\)/gm, jsFile);
        if (trKeys2.length > 0) {
            trKeys.addAll(trKeys2);
        }

        if (trKeys.length > 0) {
            translationKeys[file] = trKeys;
        }
    }
    return translationKeys;
}

function scanTypeScriptToUsedTranslation() {
    let trKeys = [];
    for (let file of glob('**/*.ts', {sync: true})) {
        if (!file.startsWith('src/')) {
            continue;
        }

        let jsFile = fs.readFileSync(file, 'utf8');
        //read inline html im components
        let inlineTranslateRegexp = /\w*\.instant\s*\(\s*['"]([\w]+\.[\.\w]+)['"]/gm;
        let trKeysResults;
        while ((trKeysResults = inlineTranslateRegexp.exec(jsFile))) {
            let trKey = trKeysResults[1];
            //console.log(trKey);

            trKeys.push(trKey);
        }
    }
    return trKeys;
}


function scanComponentHtmlFileToTranslations() {
    let translationKeys = {};
    for (let file of glob('**/*.html', {sync: true})) {
        if (!file.startsWith('src/')) {
            continue;
        }

        //parse html files
        let htmlFile = fs.readFileSync(file, 'utf8');
        let trKeys = getTrKeys(htmlFile);

        let fileName = file;
        if (file.lastIndexOf('/') >= 0) {
            fileName = file.substring(file.lastIndexOf('/') + 1);
        }

        translationKeys[fileName] = trKeys;
    }
    return translationKeys;
}

function hasOwnProperty(currentTranslationSubTree, trKey, passedPath) {
    let propertyKey = '';
    for (let trPath of trKey.substring(passedPath.length).split('.')) {
        propertyKey += trPath;
        if (currentTranslationSubTree.hasOwnProperty(propertyKey)) {
            return propertyKey;
        }
        propertyKey += '.';
    }
}

function toPropertyList(translations, path) {
    let properties = [];
    for (let trKey in translations) {
        if (typeof translations[trKey] === 'object') {
            toPropertyList(translations[trKey], path + '.' + trKey).forEach(i => properties.push(i));
        }
        else {
            properties.push(path.substring(1) + '.' + trKey);
        }
    }
    return properties;
}

function checkProperty(trKey, translations, usedTranslations) {
    // match dynamic property
    if (trKey.match(/[.\w]*{{[.\w\[\]]*}}/g)) {
        let props = toPropertyList(translations, '');
        let trKeyRegexp = trKey;
        trKeyRegexp = trKeyRegexp.replace(/([.\w]*)({{[.\w\[\]]*}})/g, '$1\\w*');
        trKeyRegexp = trKeyRegexp.replace(/\./g, '\\.');
        let match = false;
        for (let prop of props) {
            if (prop.match(new RegExp(trKeyRegexp, 'g'))) {
                match = true;
                markAsUsed(prop, translations, usedTranslations);
            }
        }
        return match;
    }

    // check static translation key
    let currentTranslationSubTree = translations;
    let passedPath = '';
    while (passedPath.length < trKey.length) {
        let property;
        if (property = hasOwnProperty(currentTranslationSubTree, trKey, passedPath)) {
            currentTranslationSubTree = currentTranslationSubTree[property];
        }
        else {
            return false;
        }
        passedPath = passedPath + property + '.';
    }
    markAsUsed(trKey, translations, usedTranslations);
    return true;
}

function markAsUsed(trKey, translations, usedTranslations) {
    let currentTranslationSubTree = translations;
    let currectUserTranslations = usedTranslations;
    let lastField = '';
    let lastSubTree = '';
    let passedPath = '';
    while (passedPath.length < trKey.length) {
        let property = hasOwnProperty(currentTranslationSubTree, trKey, passedPath);
        lastField = property;
        currentTranslationSubTree = currentTranslationSubTree[property];

        currectUserTranslations[property] = currectUserTranslations[property] ? currectUserTranslations[property] : {};
        lastSubTree = currectUserTranslations;
        currectUserTranslations = currectUserTranslations[property];

        passedPath = passedPath + property + '.';
    }
    lastSubTree[lastField] = currentTranslationSubTree;
}

function usedTranslation(usedTranlsation, key) {
    if (!usedTranlsation[key]) {
        usedTranlsation[key] = {};
    }
    return usedTranlsation[key];
}

function localTranslationsFile(lang) {
    let translations = {};
    for (let file of glob(I_18_N + lang + '/**/*.json', {sync: true})) {
        let fileName = file;
        if (file.lastIndexOf('/') >= 0) {
            fileName = file.substring(file.lastIndexOf('/') + 1, file.length - '.json'.length);
        }
        translations[fileName] = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return translations;
}

function isTranslationExists(trKey, usedTranslations, langFiles, translations, lang) {
    for (let langFile of langFiles) {
        if (!translations[langFile]) {
            console.log(`Translation file ${langFile} not found for ${lang}`);
        }
        else if (checkProperty(trKey, translations[langFile], usedTranslation(usedTranslations, langFile))) {
            return true;
        }
    }
    return checkProperty(trKey, translations['global'], usedTranslation(usedTranslations, 'global'));
}

function merge(objects) {
    let result = {};
    for (let object of objects)
        for (let field in object) {
            if (result[field]) {
                let v = object[field] ? object[field] : [];
                result[field].addAll();
            }
            else {
                result[field] = object[field];
            }
        }
    return result;
}

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

let templateLangFiles = scanTsFilesToLangFiles();

let translationKeys = {};
translationKeys = merge([
    scanInlineComponentHtmlToTranslations(),
    scanComponentHtmlFileToTranslations(),
    scanTypeScriptToTranslations()
]);

let langs = [];
let translationFiles = [];
let missedTranslations = [];

let filesWithoutLangFile = [];
for (let file in translationKeys) {
    if (translationKeys[file].length > 0 && (!templateLangFiles[file] || templateLangFiles[file].length == 0)) {
        filesWithoutLangFile.push(file);
    }
}

for (let langFolder of glob(I_18_N + '*', {sync: true})) {
    let lang = langFolder.substring(I_18_N.length);
    if (lang.length > 2) {
        continue;
    }
    langs.push(lang);
    let translations = localTranslationsFile(lang);
    let usedTranslations = {};

    for (let file in translationKeys) {
        for (let trObject of translationKeys[file]) {
            let trKey = trObject.key;
            if (!isTranslationExists(trKey, usedTranslations, templateLangFiles[file] || [], translations, file)) {
                missedTranslations.push({
                    key: trKey,
                    langFiles: templateLangFiles[file],
                    defaultValue: trObject.defaultValue
                });
                console.log(`${trKey} from ${file} for ${lang} translation not found in ${templateLangFiles[file]} and global`);
                for (let translationFile in translations) {
                    if (checkProperty(trKey, translations[translationFile], usedTranslation(usedTranslations, translationFile))) {
                        console.log(`but found in ${translationFile}`);
                    }
                }
            }

        }
    }

    let usedStartWith = scanTypeScriptToUsedTranslation();
    for (let translationFile in translations) {
        let props = toPropertyList(translations[translationFile], '');
        for (let key of props) {
            if (key.startsWith('error.') || key.startsWith('health.')) {
                //console.log(key);
                markAsUsed(key, translations[translationFile], usedTranslation(usedTranslations, translationFile));
                continue;
            }

            for (let usedPrefix of usedStartWith) {
                if (key.startsWith(usedPrefix)) {
                    //console.log(key);
                    markAsUsed(key, translations[translationFile], usedTranslation(usedTranslations, translationFile));
                    break;
                }
            }
        }
        translationFiles.push(translationFile);
    }

    for (let file in usedTranslations) {
        //fs.writeFileSync(I_18_N + `${lang}/${file}.json`, JSON.stringify(usedTranslations[file], null, 4), {encoding: 'utf8'});
    }

}

fs.writeFileSync(I_18_N + 'missedTranslations.json', JSON.stringify(missedTranslations, null, 4), {encoding: 'utf8'});

fs.writeFileSync(I_18_N + 'settings.json', JSON.stringify({
    langs: langs,
    locations: translationFiles.filter((v, i, a) => a.indexOf(v) === i)
}, null, 4), {encoding: 'utf8'});


if (filesWithoutLangFile.length > 0) {
    console.log('============================!!!WARNING!!! !!!WARNING!!! !!!WARNING!!!=============================');
    console.log('===== IN NEXT FILES NOT SPECIFIED TRANSLATIONs FILE!!! It\'s meant this files using global.json! ==');
    console.log('====== Please use JhiLanguageService like: this.jhiLanguageService.addLocation(\'<FILENAME>\'); ====');
    console.log('If component use only global translations please add @UseGlobalTranslations() for avoid this warning.');
    console.log(filesWithoutLangFile);
    console.log('==================================================================================================\n\n');
}
else {
    console.log('Clear translation locations: OK.');
}
