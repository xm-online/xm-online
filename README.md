# XM^online 2 - General Single Page Application (xm-webapp)

## Prerequisites:
* Git - [https://git-scm.com/downloads](https://git-scm.com/downloads)
* NPM - [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)
* Idea (optional)
  * please check Settings | Editor | Code Style | TypeScript | Spaces | Within | ES6 import/export braces

## How to start
* Checkout code from the repository:
```
git clone https://github.com/xm-online/xm-webapp
cd xm-webapp/
```
* Add extensions (optional):
```
cd src/app/ext/
git clone <repo with extension>
```
* Change API endpoint in the file `proxy.conf.js` (optional):
value for the parameter `target`
* Install all dependencies:
```
npm install
```
* Build i18n resources and register extensions (optional):
```
npm run prebuild
```
* Start web application:
```
npm start
```

## Contribution
* [Playbook for Front end developers](https://github.com/xm-online/xm-online/wiki/Playbook-for-Front-end-developers)
