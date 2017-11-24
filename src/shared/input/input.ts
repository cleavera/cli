import { output } from '../output/output';

export class Input {
    private _stdin: NodeJS.ReadStream;

    constructor(stdin: NodeJS.ReadStream) {
        stdin.setEncoding('utf8');
        this._stdin = stdin;
    }

    public ask(question: string): Promise<string> {
        output(`${question} `);
        this._stdin.resume();

        return new Promise((resolve: (value: string) => void): void => {
            process.stdin.on('data', (text: string): void => {
                resolve(text.trim());
                this._stdin.pause();
            });
        });
    }

    public async bool(question: string): Promise<boolean> {
        const resp: string = await this.ask(`${question} (y/n)`);

        return resp === 'y' || resp === 'yes';
    }
}
