let fs = require('fs');
let glob = require('glob');
let htmlparser = require('htmlparser');

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


let isTransletableText = function (text) {
    return !isBlank(text)
        && !/^\s*{{.*}}\s*$/g.test(text)
        && !/^\s*\d+\s*$/g.test(text)
        && !/^\s*\W+\s*$/g.test(text)
        ;
};

function findNoTranslationsElement(dom, parentTag, file) {
    if (dom.type == 'text') {
        let text = dom.data;
        text = text.replace('&nbsp;', '')
            .replace('&times;', '')
            .replace('&nbsp', '')
            .replace(/\s*{{.*}}\s*/g, '').trim();

        if (isTransletableText(text)) {

            if (/\d+"/g.test(text)) {
           }
            else {
                console.log(`${file} -->> ${text}`);
            }
        }
        return;
    }

    if (!dom.children) {
        return;
    }

    for (let child of dom.children) {
        if (child.hasOwnProperty('attribs') && child.attribs.hasOwnProperty('jhiTranslate')) {
            continue;
        }
        if (ignoreTags(child)) {
            continue;
        }
        findNoTranslationsElement(child, dom, file);
    }
}

let ignoreTags = function (child) {
    return child.type == 'script' || child.type == 'comment' || child.name == 'i';
};
for (let file of glob('**/*.html', {sync: true})) {
    if (!file.startsWith('src/') || file.indexOf('/health/') >= 0 || file.indexOf('/logs/') >= 0 || file.indexOf('/metrics/') >= 0 || file.indexOf('/swagger-ui/') >= 0) {
        continue;
    }

    //parse html files
    let htmlFile = fs.readFileSync(file, 'utf8');

    let handler = new htmlparser.DefaultHandler();
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(htmlFile);
    let dom = handler.dom;

    findNoTranslationsElement({children: dom}, null, file);


    // console.log("=");
    // console.log("=");
    // console.log("=");
    // console.log("=");
    // console.log("=");
    //console.log(JSON.stringify(dom, null, 4));

}



