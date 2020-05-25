export async function uploadToCloudinary(
  { account, preset },
  file: File
): Promise<CloudinaryResult> {
  const endpoint = `https://api.cloudinary.com/v1_1/${account}/image/upload`;
  let formData = new FormData();
  formData.append("upload_preset", preset);
  formData.append("file", file);
  let resp = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    let error = await resp.text();
    throw new Error(error);
  }
  return resp.json();
}

export const getImageUrl = (
  publicId: string,
  transform: ImageTransform = { mode: "thumb", width: 400, height: 400 }
) => {
  //https://res.cloudinary.com/droopytersen/image/upload/c_fill,g_faces,q_auto,w_400,h_200/v1590417723/wanderlog/20190422_163610_txdh9l.jpg
  let transformString = "";
  if (transform.mode === "thumb") {
    transformString += "c_fill,g_faces,q_auto";
    if (transform.width) {
      transformString += ",w_" + transform.width;
    }
    if (transform.height) {
      transformString += ",h_" + transform.height;
    }
  }

  return ["https://res.cloudinary.com/droopytersen/image/upload", transformString, publicId].join(
    "/"
  );
};

export interface ImageTransform {
  mode?: "original" | "thumb";
  width?: number;
  height?: number;
}

export interface CloudinaryResult {
  asset_id: string;
  bytes: number;
  created_at: string;
  format: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  height: number;
  width: number;
}
