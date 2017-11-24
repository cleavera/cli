import * as fs from 'fs';
import { child, Input } from '../shared';
import * as template from './resources';

export async function run(input: Input): Promise<void> {
    const hasTemplate: boolean = await input.bool('Does this project have a template?');
    let isAngular: boolean = false;
    const devDep: Array<string> = [
        'typescript',
        'tslint',
        'webpack',
        'ts-loader',
        'raw-loader',
        'sass-loader',
        'node-sass'
    ];
    const dep: Array<string> = [];

    if (hasTemplate) {
        isAngular = await input.bool('Is this project an angular project?');
    }

    let webpack: string;

    if (hasTemplate) {
        devDep.push('html-webpack-plugin');

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
    } else {
        webpack = template.webpack;
    }

    await child('git init');
    await child(`npm.cmd init`);

    fs.writeFileSync('./tslint.json', template.tslint);
    fs.writeFileSync('./tsconfig.json', template.tsconfig);
    fs.writeFileSync('./webpack.config.js', webpack);

    await child(`npm.cmd i ${devDep.join(' ')} --save-dev`);
    if (dep.length) {
        await child(`npm.cmd i ${dep.join(' ')} --save`);
    }
}
