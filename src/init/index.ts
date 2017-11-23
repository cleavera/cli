import { Input, output } from '../shared';

export async function run(input: Input): Promise<void> {
    const hasTemplate: string = await input.ask('Does this project have a template? (y/n)');
    const isAngular: string = await input.ask('Is this project an angular project? (y/n)');

    output(hasTemplate, isAngular);
}
