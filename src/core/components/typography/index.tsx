import React from "react";

export const PageTitle = ({ className = "", ...rest }) => {
  let cssClass = ["page-title", className].filter(Boolean).join(" ");
  return <h1 className={cssClass} {...rest} />;
};
