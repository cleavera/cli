export interface IPackage {
    name: string;
    version: string;
    dependencies: { [pkg: string]: string };
    devDependencies: { [pkg: string]: string };
    peerDependencies: { [pkg: string]: string };
}
