const cdk = require("aws-cdk-lib");
const { S3UploadStack } = require("./s3-stack");

const app = new cdk.App();

new S3UploadStack(app, "S3UploadStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || "us-east-1",
  },
});

app.synth();
