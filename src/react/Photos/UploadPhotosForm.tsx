import React, { useState, useEffect, useMemo, useReducer } from "react";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { FormActions } from "../shared/useForm";
import useImageUploader from "./useImageUploader";
import Grid from "../components/Grid";
import { getFiles, wait } from "../../core/utils";
import { uploadToCloudinary } from "./cloudinary";
import { PhotoModel } from "../../models/PhotoModel";

export default function UploadPhotosForm() {
  let { search } = useLocation();
  let queryStringDate = getDate(search);
  let [date, setDate] = useState(queryStringDate || dayjs().format("YYYY-MM-DD"));
  let { HiddenInput, previews, open, inputRef } = useImageUploader();
  let [status, setStatus] = useState("idle");
  let [uploadStatuses, setUploadStatuses] = useState([]);
  let handleSubmit = async (event) => {
    event.preventDefault();
    if (date && previews.length) {
      setStatus("saving");
      let files = getFiles(inputRef?.current?.files);

      let statuses = files.map((file) => ({ key: file.name, status: "queued" }));
      console.log("handleSubmit -> statuses", statuses);
      setUploadStatuses(statuses);
      for (const file of files) {
        setUploadStatuses((statuses) => updateUploadStatus(statuses, file, "uploading"));
        await wait(3000);
        let result = await uploadToCloudinary(
          { account: "droopytersen", preset: "wanderlog" },
          file
        );
        let photoModel = PhotoModel.create({ date, publicId: result.public_id });
        await photoModel.save();
        setUploadStatuses((statuses) => updateUploadStatus(statuses, file, "success"));
      }
      // Go back once success
      // TODO: redirect to keep history?
      window.history.back();
    }
  };
  console.log("UploadImagesForm -> queryStringDate", queryStringDate, date);
  useEffect(() => {
    if (queryStringDate) {
      setDate(queryStringDate);
    }
  }, [queryStringDate]);

  return (
    <div>
      <h1>Upload Photos</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button type="button" className="btn-secondary" onClick={open}>
          Choose Photos
        </button>
        {HiddenInput}
        <Grid className="photo-previews">
          {previews.map((imgUrl, index) => (
            <ImagePreview
              key={imgUrl}
              src={imgUrl}
              status={
                uploadStatuses?.find((s) => s.key === inputRef?.current?.files?.[index]?.name)
                  ?.status ?? "Not Started"
              }
            />
          ))}
        </Grid>
        <FormActions isValid={date && previews.length > 0} />
      </form>
    </div>
  );
}

function ImagePreview({ src, status }) {
  return (
    <div className="">
      <img key={src} src={src} />
      <h4>{status}</h4>
    </div>
  );
}
const getDate = function (queryString: string) {
  var searchParams = new URLSearchParams(queryString);
  let date = searchParams.get("date");
  if (date) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return "";
};

function updateUploadStatus(statuses = [], file, status) {
  console.log("updateUploadStatus -> statuses", statuses, file.name, status);
  return [...statuses.filter((s) => s.key !== file.name), { key: file.name, status }];
}
