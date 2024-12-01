import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // server side
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  // reserved func name: https://www.npmjs.com/package/multer#filefilter
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image formats are supported"));
  }
}

const upload = multer({
  storage,
  fileFilter,
});

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    res.send({
      message: "Image Uploaded",
      image: `/${req.file.path}`,
    });
  });
});

export default router;
