import * as fs from 'fs';
import { child, Input } from '../shared';
import * as template from './resources';

export async function run(input: Input): Promise<void> {
    const isLibrary: boolean = await input.bool('Is this a library?');
    const devDep: Array<string> = [];
    const dep: Array<string> = [];
    const scripts: { [index: string]: string } = {};
    let webpack: string | null = null;
    let isModule: boolean = false;

    if (!isLibrary) {
        isModule = await input.bool('Is this a module?');

        const isNode: boolean = await input.bool('Is this a node only project?');
        devDep.push('typescript');
        devDep.push('tslint');

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
            if (isAngular) {
                devDep.push('karma');
                devDep.push('karma-cli');
                devDep.push('karma-webpack');
                devDep.push('karma-jasmine');
                devDep.push('karma-chrome-launcher');
                devDep.push('puppeteer');
                devDep.push('jasmine-core');
                devDep.push('@types/jasmine-core');

                scripts.test = 'karma';
            } else {
                devDep.push('alsatian');
                scripts.test = 'alsatian ./src/**/*.spec.ts';
            }
        }
    }

    await child(`npm.cmd init`);

    if (!isModule) {
        await child('git init');
        fs.writeFileSync('./tslint.json', template.tslint);
        fs.writeFileSync('./tsconfig.json', template.tsconfig);
        fs.writeFileSync('./.gitignore', template.gitIgnore);
    } else {
        fs.writeFileSync('./tslint.json', template.tslintModule);
        fs.writeFileSync('./tsconfig.json', template.tsconfigModule);
    }

    if (isLibrary) {
        fs.writeFileSync('./root.js', template.root);
    }

    if (webpack) {
        fs.writeFileSync('./webpack.config.js', webpack);
    }

    if (devDep.length) {
        await child(`npm.cmd i ${devDep.join(' ')} --save-dev`);
    }

    if (dep.length) {
        await child(`npm.cmd i ${dep.join(' ')} --save`);
    }

    if (Object.keys(scripts).length) {
        const packageJson: any = JSON.parse(fs.readFileSync('./package.json', 'utf-8')); // tslint:disable-line no-any
        packageJson.scripts = scripts;

        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    }

    await child(`git add -A`);
}
