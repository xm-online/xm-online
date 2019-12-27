const fs = require('fs');
const fse = require('fs-extra');
const {join} = require('path');
const LOCAL_EXT_PATH = 'src/app/ext';
const LOCAL_ASSETS_PATH = 'src/assets/css/ext/';
const LOCAL_ASSETS_IMG_PATH = 'src/assets/img/ext/';
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(join(p, f)).isDirectory());
fs.readFile('config.angular.json', function (err, data) {
    let json = JSON.parse(data);
    const KEY_LAZY = 'lazyModules';
    const LAZY_ARRAY = dirs(LOCAL_EXT_PATH).map(p => {
        const CSS_ASSET = `${LOCAL_EXT_PATH}/${p}/assets/css/`;
        const IMG_ASSET = `${LOCAL_EXT_PATH}/${p}/assets/img/`;
        if (fs.existsSync(CSS_ASSET)) {
            fse.copy(CSS_ASSET, LOCAL_ASSETS_PATH, function (err) {
                if (err) {
                    return console.error(err)
                }
            });
        }
        if (fs.existsSync(IMG_ASSET)) {
            fse.copy(IMG_ASSET, LOCAL_ASSETS_IMG_PATH, function (err) {
                if (err) {
                    return console.error(err)
                }
            });
        }
        return LOCAL_EXT_PATH + '/' + p + '/module/' + p + '.module';
    });
    const CURRENT_LAZY_ARRAY = json['projects']['xm-webapp']['architect']['build']['options'][KEY_LAZY];
    LAZY_ARRAY.map(l => CURRENT_LAZY_ARRAY.push(l));
    json['projects']['xm-webapp']['architect']['build']['options'][KEY_LAZY] = CURRENT_LAZY_ARRAY;
    fs.writeFile('angular.json', JSON.stringify(json, null, 4), () => {
        console.log('Extensions processed!')
    });
});
