const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const { execSync } = require("child_process");

class S3UploadStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create S3 bucket (triggered by CI/CD pipeline)
    const bucket = new s3.Bucket(this, "UploadBucket", {
      bucketName: process.env.S3_BUCKET_NAME,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Generate file content on the fly and upload to S3
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${timestamp}.txt`;

    let poem;
    try {
      const response = execSync("curl -s https://poetrydb.org/random/1", { timeout: 10000 });
      const data = JSON.parse(response.toString());
      const p = data[0];
      poem = `${p.title}\nby ${p.author}\n\n${p.lines.join("\n")}`;
    } catch (e) {
      poem = "Roses are red,\nViolets are blue,\nThe poem API failed,\nSo this will do.";
    }

    new s3deploy.BucketDeployment(this, "UploadFiles", {
      sources: [
        s3deploy.Source.data(fileName, poem),
      ],
      destinationBucket: bucket,
    });

    // Output bucket name
    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "S3 Bucket Name",
    });
  }
}

module.exports = { S3UploadStack };
