import * as fs from 'fs';
import { child, Input } from '../shared';
import * as template from './resources';

export async function run(input: Input): Promise<void> {
    const isNode: boolean = await input.bool('Is this a node only project?');
    const devDep: Array<string> = [
        'typescript',
        'tslint'
    ];

    const scripts: { [index: string]: string } = {};

    let hasTemplate: boolean = false;

    if (!isNode) {
        devDep.push('webpack');
        devDep.push('ts-loader');
        scripts.build = 'webpack';

        hasTemplate = await input.bool('Does this project have a template?');
    } else {
        devDep.push('@types/node');
        scripts.build = `tsc`;
    }

    let isAngular: boolean = false;

    const dep: Array<string> = [];
    let webpack: string | null = null;

    if (hasTemplate) {
        devDep.push('raw-loader');
        devDep.push('sass-loader');
        devDep.push('node-sass');
        devDep.push('html-webpack-plugin');

        webpack = template.webpack;

        isAngular = await input.bool('Is this project an angular project?');

        if (isAngular) {
            devDep.push('angular2-template-loader');
            dep.push('@angular/common');
            dep.push('@angular/compiler');
            dep.push('@angular/core');
            dep.push('@angular/platform-browser');
            dep.push('@angular/platform-browser-dynamic');
            dep.push('core-js');
            dep.push('reflect-metadata');
            dep.push('rxjs');
            dep.push('zone.js');

            webpack = template.webpackAngular;
        } else {
            webpack = template.webpackTemplate;
        }
    }

    const isUnitTested: boolean = await input.bool('Is this project unit tested?');

    if (isUnitTested) {
        devDep.push('alsatian');
        scripts.test = 'alsatian ./src/**/*.spec.ts';
    }

    await child('git init');
    await child(`npm.cmd init`);

    fs.writeFileSync('./tslint.json', template.tslint);
    fs.writeFileSync('./tsconfig.json', template.tsconfig);
    fs.writeFileSync('./.gitignore', template.gitIgnore);

    if (webpack) {
        fs.writeFileSync('./webpack.config.js', webpack);
    }

    await child(`npm.cmd i ${devDep.join(' ')} --save-dev`);
    if (dep.length) {
        await child(`npm.cmd i ${dep.join(' ')} --save`);
    }

    const packageJson: any = JSON.parse(fs.readFileSync('./package.json', 'utf-8')); // tslint:disable-line no-any
    packageJson.scripts = scripts;

    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

    await child(`git add -A`);
}
