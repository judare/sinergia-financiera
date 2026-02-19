import AWS from "aws-sdk";

const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
});

export const getFile = function (name: string) {
  return new Promise((resolve, reject) => {
    s3bucket.getObject(
      {
        Bucket: process.env.AWS_BUCKET || "",
        Key: "blokay/" + name,
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
};

export const uploadFile = function (
  name: string,
  buffer: Buffer | Uint8Array | Blob | string,
  ContentType?: string | undefined
) {
  return new Promise((resolve, reject) => {
    s3bucket.upload(
      {
        Bucket: process.env.AWS_BUCKET || "",
        Key: "bl/" + name,
        Body: buffer,
        ACL: "public-read",
        ContentType,
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data.Key);
      }
    );
  });
};

export const createBucket = function (name: string) {
  AWS.config.update({ region: "REGION" });

  let bucketParams = {
    Bucket: name,
  };
  s3bucket.createBucket(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Location);
    }
  });
};

export const invokeLambda = async function (body: any, url: string = "") {
  const contextCall = await fetch(
    url || process.env.AWS_LAMBDA_EXECUTION || "",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  let responseRaw = await contextCall.json();

  return responseRaw;
};
