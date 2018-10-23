import { child, getPackage, IPackage } from '../shared';

export async function run(): Promise<void> {
    const pkg: IPackage = await getPackage();

    await child('npm.cmd install -D ' + Object.keys(pkg.devDependencies).map((dep: string) => {
        return dep + '@latest';
    }).join(' '));

    await child('npm.cmd install ' + Object.keys(pkg.dependencies).map((dep: string) => {
        return dep + '@latest';
    }).join(' '));
}
