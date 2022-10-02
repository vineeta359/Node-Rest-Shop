const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name price") // to populate data of product from product model into this order object
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  //find the product by its id first then proceed ro save
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) res.status(404).json({ message: "Product not found" });
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.orders_get_order = (req, res, next) => {
  
};

exports.orders_delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orderds",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
