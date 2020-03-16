import * as npmPackage from '.././../package.json';
import { IEnvironment } from './models';

export const environment: IEnvironment = {
    environment: 'local',
    version: npmPackage.version,
    release: npmPackage.release,
    production: false,
};
