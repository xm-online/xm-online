const fs = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');
const os = require('os');
const lib = resolve(__dirname, '../src/app/ext');
fs.readdirSync(lib).forEach(function (mod) {
    const modPath = join(lib, mod);
    if (fs.existsSync(join(modPath, 'package.json'))) {
        const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
        cp.spawn(npmCmd, ['i'], {env: process.env, cwd: modPath, stdio: 'inherit'});
    }
});
