import { ChildProcess, spawn } from 'child_process';

export function child(command: string): Promise<void> {
    const [cmd, ...args]: Array<string> = command.split(' ');

    return new Promise((resolve: () => void, reject: (code: number) => void): void => {
        const cp: ChildProcess = spawn(cmd, args, { stdio: 'inherit' });

        cp.on('close', (code: number): void => {
            process.stdin.pause();

            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
    });
}
