import { ENVS } from '../util/constant';
import { ConfigEnv } from '../config/config-env';
import { capitalizeFirstLetter } from './capitalize';

const env = new ConfigEnv().config;
export const ENV_NAME = capitalizeFirstLetter(env.environment);
export const IS_PROD = env.environment.toLowerCase() === ENVS.prod.toLowerCase();