//we can create all the requests related to products using this syntax only in this file
const express = require("express");
const router = express.Router();

//importing middleware
const check_auth = require("../middleware/check_auth");

//importing controllers
const ProductController = require("../controllers/products");

//for uploading files ,use multer,
const multer = require("multer");

//storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString() + file.originalname),
});

//to allow only specific types of files to accept
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};

//upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, //setting limit of file upload
  fileFilter: fileFilter,
});

const Product = require("../models/product"); //importing  product model

router.get("/", ProductController.products_get_all);

router.post(
  "/",
  check_auth,
  upload.single("productImage"),
  ProductController.products_create_product
);

router.get("/:productId", check_auth, ProductController.products_get_product);

router.patch(
  "/:productId",
  check_auth,
  ProductController.product_patch_product
);

router.delete(
  "/:productId",
  check_auth,
  ProductController.product_delete_product
);

module.exports = router;
