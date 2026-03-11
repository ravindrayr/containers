const cdk = require("aws-cdk-lib");
const { S3UploadStack } = require("./s3-stack");
const { PipelineStack } = require("./pipeline-stack");

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.AWS_REGION || "us-east-1",
};

// Original stack for manual deployment
new S3UploadStack(app, "S3UploadStack", {
  env: env,
});

// CI/CD Pipeline stack
new PipelineStack(app, "PipelineStack", {
  env: env,
});

app.synth();
