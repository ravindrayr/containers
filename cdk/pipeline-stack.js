const cdk = require("aws-cdk-lib");
const { CodePipeline, CodePipelineSource, ShellStep } = require("aws-cdk-lib/pipelines");
const { S3UploadStack } = require("./s3-stack");

class PipelineStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "S3UploadPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("ravindrayr/containers", "master"),
        commands: [
          "npm ci",
          "npm test",
          "npx cdk synth"
        ],
      }),
    });

    // Define the deployment stage
    const deployStage = pipeline.addStage(new cdk.Stage(this, "Deploy", {
      env: props.env,
    }));

    // Add the S3 Upload Stack to the deployment stage
    // Note: In a real scenario, you might want to pass specific props here
    new S3UploadStack(deployStage, "S3UploadStack", {
      env: props.env,
    });
  }
}

module.exports = { PipelineStack };
