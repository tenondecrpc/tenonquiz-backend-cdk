import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';

interface IBucket {
    readonly key?: kms.Key;
    readonly enforceSSL?: boolean;
    readonly versioned?: boolean;
    readonly removalPolicy?: cdk.RemovalPolicy;
}

export class Bucket extends Construct {
    constructor(scope: Construct, id: string, props?: IBucket) {
        super(scope, id);

        const bucket = new s3.Bucket(this, 'MyBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: props?.key ? s3.BucketEncryption.KMS : s3.BucketEncryption.S3_MANAGED,
            encryptionKey: props?.key,
            enforceSSL: props?.enforceSSL,
            versioned: props?.versioned,
            removalPolicy: props?.removalPolicy,
        });
    }
}