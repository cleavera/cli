import { output } from '../output/output';

export class Input {
    private _stdin: NodeJS.ReadStream;

    constructor(stdin: NodeJS.ReadStream) {
        stdin.setEncoding('utf8');
        this._stdin = stdin;
    }

    public ask(question: string): Promise<string> {
        output(question);
        this._stdin.resume();

        return new Promise((resolve: (value: string) => void) => {
            process.stdin.on('data', (text) => {
                resolve(text);
                this._stdin.pause();
            });
        });
    }
}
