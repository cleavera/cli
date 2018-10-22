const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

isAlreadyPublished().then((isPublished) => {
    if (isPublished) {
        process.exit(0);
    }

    publish().then(() => {
        process.exit(0);
    }, (e) => {
        console.log(e);

        process.exit(1);
    });
}, (e) => {
    console.log(e);

    process.exit(1);
});

function publish() {
    return new Promise((resolve, reject) => {
        const cp = childProcess.spawn('npm.cmd', ['publish', '--access=public'], {
            stdio: [process.stdin, process.stdout, process.stderr],
            env: process.env
        });

        cp.on('exit', () => {
            resolve();
        });

        cp.on('error', (e) => {
            reject(e);

            cp.kill('SIGINT');
        });
    });
}

function isAlreadyPublished() {
    return getPublishedVersions().then((data) => {
        return data.indexOf(getCurrentVersion()) !== -1;
    });
}

function getPackageInfo() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
}

function getCurrentVersion() {
    return getPackageInfo().version;
}

function getPackageName() {
    return getPackageInfo().name;
}

function getPublishedVersions() {
    return new Promise((resolve) => {
        const cp = childProcess.spawn('npm.cmd', ['view', getPackageName, 'versions'], {
            stdio: [process.stdin, 'pipe', 'pipe'],
            env: process.env
        });

        cp.stdout.on('data', (chunk) => {
            resolve(JSON.parse(chunk.toString().replace(/'/g, '"').trim()));

            cp.kill('SIGINT');
        });

        cp.stderr.on('data', () => {
            resolve([]);

            cp.kill('SIGINT');
        });
    });
}
