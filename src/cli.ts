import { run as init } from './init';
import { Input } from './shared';
import { run as update } from './update';

const command: string = process.argv[process.argv.length - 1];

const input: Input = new Input(process.stdin);

if (command === 'init') {
    init(input).then(() => {
        process.exit();
    });
} else if (command === 'update') {
    update().then(() => {
        process.exit();
    });
} else {
    console.log(`No such command ${command}`);
    process.exit(1);
}
