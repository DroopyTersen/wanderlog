import React, { useState, useEffect, useMemo, useReducer } from "react";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { FormActions } from "../shared/useForm";
import useImageUploader from "./useImageUploader";
import ImageGrid from "./ImageGrid";

export default function UploadImagesForm() {
  let { search } = useLocation();
  let queryStringDate = getDate(search);
  let [date, setDate] = useState(queryStringDate);
  let { HiddenInput, previews, open } = useImageUploader();

  console.log("UploadImagesForm -> queryStringDate", queryStringDate, date);
  useEffect(() => {
    if (queryStringDate) {
      setDate(queryStringDate);
    }
  }, [queryStringDate]);

  return (
    <div>
      <h1>Upload Photos</h1>

      <form>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button type="button" className="btn-secondary" onClick={open}>
          Choose Photos
        </button>
        {HiddenInput}
        <ImageGrid imgUrls={previews} />
        <FormActions isValid={previews.length > 0} />
      </form>
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
