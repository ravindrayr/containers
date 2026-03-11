/**
 * TDD: CDK S3 Stack Tests
 * Validates the CDK stack creates the correct AWS resources
 */

const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { S3UploadStack } = require("../cdk/s3-stack");

describe("S3UploadStack", () => {
  let template;

  beforeAll(() => {
    process.env.S3_BUCKET_NAME = "containeruplods";
    process.env.S3_UPLOAD_PATH = "";

    const app = new cdk.App();
    const stack = new S3UploadStack(app, "TestStack", {
      env: { account: "438468714534", region: "ap-south-1" },
    });
    template = Template.fromStack(stack);
  });

  test("creates exactly one S3 bucket", () => {
    template.resourceCountIs("AWS::S3::Bucket", 1);
  });

  test("S3 bucket has versioning enabled", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      VersioningConfiguration: { Status: "Enabled" },
    });
  });

  test("S3 bucket blocks all public access", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  });

  test("stack outputs bucket name", () => {
    template.hasOutput("BucketName", {});
  });

  test("bucket deployment resource exists", () => {
    template.resourceCountIs("Custom::CDKBucketDeployment", 1);
  });
});
