import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent } from 'aws-lambda';
import dayjs from 'dayjs';

const s3Client = new S3Client();
export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    const body = JSON.parse(event.body || '{}');
    const command = new HeadObjectCommand({
        Bucket: event.bucket,
        Key: event.key,
    });
    const objectInfo = await s3Client.send(command);
    const lastDate = dayjs(objectInfo.LastModified).format('DD/MM/YYYY');
    console.log(lastDate);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go CDK! Your function executed successfully!',
            objectInfo
        }),
    };
}