import { readFile } from 'fs';
import { join } from 'path';

import { IPackage } from './interfaces/package.interface';

export async function getPackage(): Promise<IPackage> {
    return new Promise<IPackage>((resolve: (pkg: IPackage) => void, reject: (e: Error) => void): void => {
        readFile(join(process.cwd(), 'package.json'), { encoding: 'utf-8' }, (error: NodeJS.ErrnoException, value: string): void => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(value));
            }
        });
    });
}
