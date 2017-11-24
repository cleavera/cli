export function output(...args: Array<any>): void { //tslint:disable-line no-any
    args.forEach((msg: any) => {//tslint:disable-line no-any
        process.stdout.write(msg.toString());
    });
}
