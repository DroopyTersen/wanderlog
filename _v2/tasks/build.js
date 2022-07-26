const path = require("path");
const fsExtra = require("fs-extra");
let projPath = path.join(__dirname, "..");

fsExtra.copySync(path.join(projPath, "static"), path.join(projPath, "dist"));
