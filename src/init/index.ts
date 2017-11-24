import * as fs from 'fs';
import { child, Input } from '../shared';
import * as template from './resources';

export async function run(input: Input): Promise<void> {
    const hasTemplate: boolean = await input.bool('Does this project have a template?');
    let isAngular: boolean = false;

    if (hasTemplate) {
        isAngular = await input.bool('Is this project an angular project?');
    }

    let webpack: string;

    if (hasTemplate) {
        if (isAngular) {
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
}
