//we can create all the requests related to orders using this syntax only in this file
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "Order was created",
    order: order,
  });
});

router.get("/:orderId", (req, res, next) => {
  if (id === "special")
    res.status(200).json({
      message: "You discovered a special ID",
      orderId: req.params.orderId,
    });
  else
    res.status(200).json({
      message: "You passed an ID",
    });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order deleted",
  });
});

module.exports = router;
