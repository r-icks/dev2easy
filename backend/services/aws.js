import AWS from "aws-sdk";
const s3 = new AWS.S3();

import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const textractAnalyse = async ({ file }) => {
  const textract = new AWS.Textract();

  const params = {
    Document: {
      Bytes: file,
    },
  };

  const response = await textract.detectDocumentText(params).promise();
  return response.Blocks.map((block) => block.Text).join("\n");
};
