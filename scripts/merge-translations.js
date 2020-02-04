let fs = require('fs');
const { join } = require('path');
let _ = require('lodash');
let glob = require('glob');

const core = 'src/i18n/';
const custom = 'src/app/ext/**/i18n/';

const corePathMask = (lang) => core + lang + '/**/*.json';
const customPathMask = (lang) => custom + lang + '/**/*.json';
const distPathMask = (lang) => core + lang + '.json';

function saveJson(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 4), {encoding: 'utf8'});
}

function readJson(file) {
    let json = {};
    try {
        json = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.log('Problem with: %o; \n %o', file, e);
    }
    return json;
}

function getTranslations(pathMask) {
    let translations = {};

    glob.sync(pathMask).forEach(file => {
        translations = _.merge(translations, readJson(file));
    });

    return translations;
}

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory);

(function loadTranslates() {

    getDirectories(core).forEach(langFolder => {
        const lang = langFolder.substring(core.length);

        const coreTranslations = getTranslations(corePathMask(lang));
        const customTranslations = getTranslations(customPathMask(lang));

        const savePath = distPathMask(lang);
        saveJson(savePath, _.merge(coreTranslations, customTranslations));
        console.info('Updated: ', savePath);
    });

})();
