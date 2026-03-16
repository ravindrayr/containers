const cdk = require("aws-cdk-lib");
const { CodePipeline, CodePipelineSource, ShellStep } = require("aws-cdk-lib/pipelines");
const { S3UploadStack } = require("./s3-stack");

class DeployStage extends cdk.Stage {
  constructor(scope, id, props) {
    super(scope, id, props);
    new S3UploadStack(this, "S3UploadStack", { env: props.env });
  }
}

class PipelineStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // This is the modern way to connect GitHub to AWS.
    // Replace with your Connection ARN from AWS Console or use .env
    const githubConnectionArn = process.env.GITHUB_CONNECTION_ARN || "PASTE_YOUR_CONNECTION_ARN_HERE";

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "S3UploadPipeline",
      synth: new ShellStep("Synth", {
        // CodeStar Connection instead of OAuth
        input: CodePipelineSource.connection("ravindrayr/containers", "master", {
          connectionArn: githubConnectionArn
        }),
        env: {
          S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "",
          AWS_REGION: process.env.AWS_REGION || "us-east-1",
          CDK_DEFAULT_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT || "",
        },
        commands: [
          "npm ci",
          "npm test",
          "npx cdk synth"
        ],
      }),
    });

    pipeline.addStage(new DeployStage(this, "Deploy", {
      env: props.env,
    }));
  }
}

module.exports = { PipelineStack };
