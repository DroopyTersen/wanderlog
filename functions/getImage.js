const { BlobServiceClient } = require("@azure/storage-blob");
const AZURE_STORAGE_CONNECTION =
  "DefaultEndpointsProtocol=https;AccountName=wanderlogstorage;AccountKey=MCf1TVZGfEf8kemyjcBDqUJSeyMcNtwTeEXBn+FGeHJK913di9BXHa28Rpk0vxMcPkefJpRbEGK0ffm832jdYQ==;EndpointSuffix=core.windows.net";
const AZURE_STORAGE_CONTAINER = "photos";
exports.handler = async function (event) {
  let filename = event.queryStringParameters.path;

  return {
    statusCode: 200,
    body: JSON.stringify({
      filename,
    }),
  };
  let blobClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION)
    .getContainerClient(AZURE_STORAGE_CONTAINER)
    .getBlobClient(filename);

  const downloadBlockBlobResponse = await blobClient.download();
  const base64Image = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString(
    "base64"
  );

  return {
    statusCode: 200,
    headers: {
      "Content-type": "image/jpeg",
    },
    body: base64Image,
    isBase64Encoded: true,
  };
};

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}
