/**
 * TDD: Environment Configuration Tests
 * Validates all required AWS env vars are present and correctly formatted
 */

describe("Environment Configuration", () => {
  const requiredVars = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "S3_BUCKET_NAME",
  ];

  beforeAll(() => {
    if (process.env.CI !== "true") {
      require("dotenv").config({ path: ".env" });
    }
  });

  test.each(requiredVars)("%s is set", (varName) => {
    expect(process.env[varName]).toBeDefined();
    expect(process.env[varName].trim()).not.toBe("");
  });

  test("AWS_ACCESS_KEY_ID starts with AKIA or ASIA", () => {
    expect(process.env.AWS_ACCESS_KEY_ID).toMatch(/^(AKIA|ASIA)/);
  });

  test("AWS_REGION is a valid AWS region format", () => {
    expect(process.env.AWS_REGION).toMatch(/^[a-z]{2}-[a-z]+-\d$/);
  });

  test("S3_BUCKET_NAME is lowercase with no spaces", () => {
    const bucket = process.env.S3_BUCKET_NAME;
    expect(bucket).toBe(bucket.toLowerCase());
    expect(bucket).not.toContain(" ");
  });

  test("CDK_DEFAULT_ACCOUNT is a 12-digit number", () => {
    expect(process.env.CDK_DEFAULT_ACCOUNT).toMatch(/^\d{12}$/);
  });
});
