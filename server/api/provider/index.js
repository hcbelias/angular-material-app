"use strict";

var express = require("express");
var controller = require("./provider.controller");

import * as auth from "../../auth/auth.service";
var router = express.Router();

router.get("/", auth.isAuthenticated(), controller.index);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.get(
  "/:id/products",
  auth.isAuthenticated(),
  controller.getProviderProducts
);
router.get(
  "/:id/invoices",
  auth.isAuthenticated(),
  controller.getProviderInvoices
);
router.post("/", auth.isAuthenticated(), controller.create);
router.put("/:id", auth.isAuthenticated(), controller.upsert);
router.patch("/:id", auth.isAuthenticated(), controller.patch);
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

module.exports = router;
