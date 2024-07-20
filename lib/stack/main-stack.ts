import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as agw from "aws-cdk-lib/aws-apigatewayv2";
import * as agwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as nodejsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from '../construct/bucket';
import { IS_PROD, ENV_NAME } from '../../util/environment';
import { NODEJS_RUNTIME } from '../../util/runtime';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucketUserPhotos = new Bucket(this, `UserPhotos`, {
      enforceSSL: IS_PROD,
      versioned: IS_PROD,
      removalPolicy: IS_PROD ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });
    const bucketMedicaments = new Bucket(this, `MedicamentPhotos`, {
      key: new kms.Key(this, `MedicamentKey`),
      enforceSSL: IS_PROD,
      versioned: IS_PROD,
      removalPolicy: IS_PROD ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const lambdaLogin = new nodejsLambda.NodejsFunction(this, 'Login', {
      entry: 'src/lambda/login/index.ts',
      bundling: {
        externalModules: ['@aws-sdk/*'],
        nodeModules: ['dayjs'],
        environment: {
          NODE_ENV: IS_PROD ? 'production' : 'development',
        },
        minify: IS_PROD,
        sourceMap: IS_PROD,
      },
      runtime: NODEJS_RUNTIME,
    });

    const httpApi = new agw.HttpApi(this, "MyApiGW");
    httpApi.addRoutes({
      path: `/${ENV_NAME}/login`,
      methods: [agw.HttpMethod.POST],
      integration: new agwIntegrations.HttpLambdaIntegration("PostMyLambda", lambdaLogin),
    });
  }
}
