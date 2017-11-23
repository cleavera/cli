import { run as init } from './init';
import { Input } from './shared';

const command: string = process.argv[process.argv.length - 1];

const input: Input = new Input(process.stdin);

if (command === 'init') {
    init(input).then(() => {
        process.exit();
    });
}
