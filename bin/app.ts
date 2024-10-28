#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MainStack } from '../lib/stack/main-stack';  
import { ConfigEnv } from '../config/config-env';
import { capitalizeFirstLetter } from '../util/capitalize';

const app = new cdk.App();
const env = new ConfigEnv().config;
const envName = capitalizeFirstLetter(env.environment);
new MainStack(app, `${envName}BackendStack`, {
  env: { account: env.account, region: env.region },
});