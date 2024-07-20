import * as fs from 'fs';
import * as path from 'path';

export type AwsRegion = 
    | 'us-east-1'
    | 'us-east-2';

export interface IConfigEnv {
    account: string;
    region: AwsRegion;
    environment: string;
};

export class ConfigEnv {
    readonly config: IConfigEnv;

    constructor() {
        const environment = process.env.STACK_ENVIRONMENT || undefined;
        if(!environment) {
            throw new Error('Missing STACK_ENVIRONMENT environment variable');
        }

        const configFile = fs.readFileSync(path.join('config', `${environment}.json`), {
            encoding: 'utf-8'
        });
        this.config = JSON.parse(configFile);
    }
}