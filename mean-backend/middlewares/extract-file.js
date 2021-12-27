const multer = require("multer");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// Save imageFile on images folder
const imageFileStorage = multer.diskStorage({
  destination: (request, imageFile, callback) => {
    const isValid = MIME_TYPE_MAP[imageFile.mimetype];
    let error = new Error("Invalid MIME TYPE");

    if (isValid) {
      error = null;
    }
    callback(error, path.join(__dirname, "../", "images"));
  },
  filename: (request, imageFile, callback) => {
    const imageName = imageFile.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("-");
    const imageExtension = MIME_TYPE_MAP[imageFile.mimetype];
    callback(null, imageName + "-" + Date.now() + "." + imageExtension);
  },
});

module.exports = multer({ storage: imageFileStorage }).single("image");
