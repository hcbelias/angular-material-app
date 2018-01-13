"use strict";

var express = require("express");
var controller = require("./invoice.controller");

import * as auth from "../../auth/auth.service";
var router = express.Router();

router.get("/", auth.isAuthenticated(), controller.index);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.post("/", auth.isAuthenticated(), controller.create);
router.put(
  "/:id/product/:productId",
  auth.isAuthenticated(),
  controller.confirmProduct
);
router.put(
  "/:id/product/:productId/keg/:kegId",
  auth.isAuthenticated(),
  controller.confirmKeg
);
router.put("/:id", auth.isAuthenticated(), controller.upsert);
router.patch("/:id", auth.isAuthenticated(), controller.patch);
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

module.exports = router;
