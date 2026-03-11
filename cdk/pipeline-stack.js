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

    pipeline.addStage(new DeployStage(this, "Deploy", {
      env: props.env,
    }));
  }
}

module.exports = { PipelineStack };
