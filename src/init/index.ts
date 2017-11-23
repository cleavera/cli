import { Input, output } from '../shared';
import * as template from './resources';

export async function run(input: Input): Promise<void> {
    const hasTemplate: boolean = await input.bool('Does this project have a template?');
    let isAngular: boolean = false;

    if (hasTemplate) {
        isAngular = await input.bool('Is this project an angular project?');
    }

    output(template.tsconfig);
    output(template.tslint);

    if (hasTemplate) {
        if (isAngular) {
            output(template.webpackAngular);
        } else {
            output(template.webpackTemplate);
        }
    } else {
        output(template.webpack);
    }
}
