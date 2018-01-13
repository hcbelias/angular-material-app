"use strict";

var express = require("express");
var controller = require("./product.controller");
var multer = require("multer");
var multerupload = multer({ dest: "fileprint/" });
var router = express.Router();
import * as auth from "../../auth/auth.service";

router.get("/", auth.isAuthenticated(), controller.index);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.get(
  "/:id/cost",
  auth.isAuthenticated(),
  controller.getLatestInvoiceByProduct
);
router.get(
  "/:id/price",
  auth.isAuthenticated(),
  controller.getLatestPriceByProduct
);
//router.post('/image', multerupload.any(), controller.uploadImage);
router.post("/", auth.isAuthenticated(), controller.create);
router.put("/:id", auth.isAuthenticated(), controller.upsert);
router.patch("/:id", auth.isAuthenticated(), controller.patch);
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

module.exports = router;
