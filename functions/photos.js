const { BlobServiceClient } = require("@azure/storage-blob");
const AZURE_STORAGE_CONTAINER = "photos";

exports.handler = async function (event) {
  let filepath = event.path.replace("/api/photos/", "");
  // console.log(event);
  if (filepath) {
    if (event.httpMethod === "GET") {
      return getPhoto(filepath);
    } else if (event.httpMethod === "POST" && event.body) {
      return uploadPhoto({ filepath, body: event.body });
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid Request" }),
  };
};

async function uploadPhoto({ filepath, body }) {
  var matches = body.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var type = matches[1];
  var buffer = Buffer.from(matches[2], "base64");

  let blobClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION)
    .getContainerClient(AZURE_STORAGE_CONTAINER)
    .getBlockBlobClient(filepath);

  await blobClient.uploadData(buffer, buffer.length);

  return {
    statusCode: "204",
  };
}

async function getPhoto(filepath) {
  let blobClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION)
    .getContainerClient(AZURE_STORAGE_CONTAINER)
    .getBlobClient(filepath);

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
}

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
