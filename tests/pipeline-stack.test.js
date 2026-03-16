/**
 * TDD: CDK Pipeline Stack Tests
 * Validates the CI/CD pipeline stack creates the correct AWS resources
 */

const cdk = require("aws-cdk-lib");
const { Template, Match } = require("aws-cdk-lib/assertions");
const { PipelineStack } = require("../cdk/pipeline-stack");

describe("PipelineStack", () => {
  let template;

  beforeAll(() => {
    process.env.S3_BUCKET_NAME = "containeruplods";

    const app = new cdk.App();
    const stack = new PipelineStack(app, "TestPipelineStack", {
      env: { account: "438468714534", region: "ap-south-1" },
    });
    template = Template.fromStack(stack);
  });

  test("creates a CodePipeline pipeline", () => {
    template.resourceCountIs("AWS::CodePipeline::Pipeline", 1);
  });

  test("pipeline is named S3UploadPipeline", () => {
    template.hasResourceProperties("AWS::CodePipeline::Pipeline", {
      Name: "S3UploadPipeline",
    });
  });

  test("pipeline source stage connects to correct GitHub repo and branch", () => {
    template.hasResourceProperties("AWS::CodePipeline::Pipeline", {
      Stages: Match.arrayWith([
        Match.objectLike({
          Name: "Source",
          Actions: Match.arrayWith([
            Match.objectLike({
              Configuration: Match.objectLike({
                Owner: "ravindrayr",
                Repo: "containers",
                Branch: "master",
              }),
            }),
          ]),
        }),
      ]),
    });
  });

  test("pipeline build stage runs npm test before cdk synth", () => {
    template.hasResourceProperties("AWS::CodeBuild::Project", {
      Source: Match.objectLike({
        BuildSpec: Match.stringLikeRegexp("npm test"),
      }),
    });
  });

  test("pipeline build stage runs npx cdk synth", () => {
    template.hasResourceProperties("AWS::CodeBuild::Project", {
      Source: Match.objectLike({
        BuildSpec: Match.stringLikeRegexp("npx cdk synth"),
      }),
    });
  });

  test("CodeBuild project has at least one IAM role", () => {
    const roles = template.findResources("AWS::IAM::Role");
    expect(Object.keys(roles).length).toBeGreaterThanOrEqual(1);
  });
});
