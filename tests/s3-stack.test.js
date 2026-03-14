/**
 * TDD: CDK S3 Stack Tests
 * Validates the CDK stack creates the correct AWS resources
 */

const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const childProcess = require("child_process");

jest.mock("child_process");

const mockPoem = JSON.stringify([{
  title: "Mock Poem",
  author: "Test Author",
  lines: ["Line one", "Line two", "Line three"],
}]);

describe("S3UploadStack", () => {
  let template;

  beforeAll(() => {
    process.env.S3_BUCKET_NAME = "containeruplods";
    process.env.S3_UPLOAD_PATH = "";

    childProcess.execSync.mockReturnValue(Buffer.from(mockPoem));

    const { S3UploadStack } = require("../cdk/s3-stack");
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

  test("fetches poem from poetrydb API", () => {
    expect(childProcess.execSync).toHaveBeenCalledWith(
      "curl -s https://poetrydb.org/random/1",
      { timeout: 10000 }
    );
  });
});

describe("S3UploadStack - API fallback", () => {
  let template;

  beforeAll(() => {
    jest.resetModules();
    process.env.S3_BUCKET_NAME = "containeruplods";
    process.env.S3_UPLOAD_PATH = "";

    const childProcessFresh = require("child_process");
    jest.mock("child_process");
    childProcessFresh.execSync.mockImplementation(() => {
      throw new Error("Network error");
    });

    const { S3UploadStack } = require("../cdk/s3-stack");
    const app = new cdk.App();
    const stack = new S3UploadStack(app, "FallbackTestStack", {
      env: { account: "438468714534", region: "ap-south-1" },
    });
    template = Template.fromStack(stack);
  });

  test("still creates bucket deployment when API fails", () => {
    template.resourceCountIs("Custom::CDKBucketDeployment", 1);
  });
});
