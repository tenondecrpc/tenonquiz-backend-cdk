import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Main from '../lib/stack/main-stack';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Bucket } from '../lib/construct/bucket';

describe('MainStack', () => {
  test('Buckets created with count', () => {
    const app = new cdk.App();
    const stack = new Main.MainStack(app, 'MainStack');
    const template = Template.fromStack(stack);
  
    template.resourceCountIs('AWS::S3::Bucket', 2);
  });

  test('Buckets created with block public access', () => {
    const app = new cdk.App();
    const stack = new Main.MainStack(app, 'MainStack');
    const template = Template.fromStack(stack);
  
    template.allResourcesProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    });
  });

  test('Buckets created with KMS encryption', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey');
    new Bucket(stack, 'MyBucket', { key });
    const template = Template.fromStack(stack);
  
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              KMSMasterKeyID: {
                "Fn::GetAtt": [stack.getLogicalId(key.node.defaultChild as kms.CfnKey), "Arn"]
              },
              SSEAlgorithm: "aws:kms"
            }
          }
        ]
      }
    });
  });
})
