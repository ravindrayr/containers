const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const path = require("path");

class S3UploadStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create S3 bucket
    const bucket = new s3.Bucket(this, "UploadBucket", {
      bucketName: process.env.S3_BUCKET_NAME,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Upload files from local uploads/ folder to S3
    new s3deploy.BucketDeployment(this, "UploadFiles", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "../uploads")),
      ],
      destinationBucket: bucket,
      destinationKeyPrefix: process.env.S3_UPLOAD_PATH || "uploads/",
    });

    // Output bucket name
    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "S3 Bucket Name",
    });
  }
}

module.exports = { S3UploadStack };
