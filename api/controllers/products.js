const mongoose = require("mongoose");
const Product = require("../models/product");
exports.products_get_all = (req, res, next) => {
  //to find all documents from the product object
  Product.find()
    .select("name price productImage _id") //select will send only selected fields from the object in response
    .exec()
    .then((docs) => {
      //sending our own response with some extra precise data
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            requests: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      //if docs are present then sent the docs else show corresponding message
      if (docs.length >= 1) res.status(200).json(response);
      else
        res.status(200).json({
          message: "No entries found",
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log(req.file);
  //upload.single() middleware allows to upload single file
  //creating a new mongoose object using mongoose model
  const product = new Product({
    _id: new mongoose.Types.ObjectId(), //for unique id of each object
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  //saving the data object
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          requests: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;

  //finding the product by id
  Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
      } else
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_patch_product = (req, res, next) => {
  const id = req.params.productId;
  //for updating only those field that are present in the body
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "PATCH",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_delete_product = (req, res, next) => {
  const id = req.params.productId;
  //to remove a product using its id
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "DELETE",
          url: "http://localhost:3000/products/" + id,
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
