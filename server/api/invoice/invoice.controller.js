/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/invoices              ->  index
 * POST    /api/invoices              ->  create
 * GET     /api/invoices/:id          ->  show
 * PUT     /api/invoices/:id          ->  upsert
 * PATCH   /api/invoices/:id          ->  patch
 * DELETE  /api/invoices/:id          ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Invoice from "./invoice.model";
import Item from "../item/item.model";
import Provider from "../provider/provider.model";
import mongoose from "mongoose";
import Stock from "../stock/stock.model";
import Store from "../store/store.model";
import { debug } from "util";

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function respondWithResultDetail(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}
function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove().then(() => {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Invoices
export function index(req, res) {
  const query =
    req.query && req.query.q
      ? {
          invoiceNumber: {
            $regex: `.*${req.query.q}.*`,
            $options: "i"
          }
        }
      : {};

  return Invoice.find(query)
    .sort({ invoiceNumber: 1 })
    .populate("provider")
    .populate("store")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function show(req, res) {
  return Invoice.findById(req.params.id)
    .populate("provider")
    .populate("store")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Invoice in the DB
export function create(req, res) {
  return Invoice.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Invoice in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }

  return Invoice.findOneAndUpdate({ _id: req.params.id }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  })
    .populate("provider")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Invoice in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Invoice.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Invoice from the DB
export function destroy(req, res) {
  return Invoice.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function confirmKeg(req, res) {
  const productId = new mongoose.Types.ObjectId(req.params.productId);
  const kegId = new mongoose.Types.ObjectId(req.params.kegId);
  const pintPrice = req.body.pintPrice;
  const literPrice = req.body.literPrice;

  return Invoice.findById(req.params.id)
    .populate("productList.product")
    .exec()
    .then(handleEntityNotFound(res))
    .then(sendKegToStock(productId, kegId, pintPrice, literPrice, res))
    .catch(handleError(res));
}

function sendKegToStock(productId, kegId, pintPrice, literPrice, res) {
  return function(invoice) {
    let product = invoice.productList.find(v => {
      return v._id.toJSON() === productId.toJSON();
    });
    let keg = product.volume.find(v => v._id.toJSON() === kegId.toJSON());
    keg.delivered += 1;

    let activeVolume = product.volume.filter(
      item => item.enabled && item.quantity > 0
    );
    product.done =
      activeVolume.length > 0 ? activeVolume.every(vol => vol.done) : true;

    return Invoice.findOneAndUpdate({ _id: invoice._id }, invoice, {
      new: true
    })
      .exec()
      .then(handleStockKeg(product, keg, pintPrice, literPrice, res));
  };
}

function handleStockKeg(product, keg, pintPrice, literPrice, res) {
  return function(invoice) {
    let stock = new Stock();
    //Common Fields
    stock.quantity = 1;
    stock.name = product.product.name;
    stock.product = product.product._id;
    stock.provider = product.product.provider;
    stock.item = product.product.item;
    stock.store = invoice.store;
    stock.unitCost = product.unitCost;
    //Exclusive
    stock.isKeg = true;
    stock.active = false;
    stock.volume = keg.volume;
    stock.remaining = stock.volume;
    stock.referenceProduct = product._id;
    stock.invoice = invoice._id;
    //#ExclusiveFields
    stock.pintPrice = pintPrice;
    stock.literPrice = literPrice;
    stock.invoiceNumber = invoice.invoiceNumber;
    return stock.save(finalizeKegInvoice(invoice, product, keg, res));
  };
}

function finalizeKegInvoice(invoice, product, keg, res) {
  return err => {
    if (err) return handleError(err);
    return res.status(200).json(invoice);
  };
}

export function confirmProduct(req, res) {
  const productId = new mongoose.Types.ObjectId(req.params.productId);
  const price = req.body.price;

  return Invoice.findOne({ _id: req.params.id, "productList._id": productId })
    .populate("productList.product")
    .exec()
    .then(handleEntityNotFound(res))
    .then(sendItemToStock(productId, price, res))
    .catch(handleError(res));
}

function sendItemToStock(productId, price, res) {
  return function(invoice) {
    var product = invoice.productList.find(v => {
      return v._id.toJSON() === productId.toJSON();
    });
    return Stock.findOne({
      provider: product.product.provider,
      product: product.product._id,
      store: invoice.store,
      unitCost: product.unitCost,
      finalized: false,
      active: true
    })
      .exec()
      .then(handleStockItem(invoice, product, price, res))
      .catch(handleError(res));
  };
}

function finalizeProductInvoice(invoice, product, res) {
  return err => {
    if (err) return handleError(err);
    return Invoice.findOneAndUpdate(
      { _id: invoice._id, productList: { $elemMatch: { _id: product._id } } },
      { $set: { "productList.$.done": true } },
      { new: true }
    )
      .exec()
      .then(invoice => {
        return res.status(200).json(invoice);
      })
      .catch(err => handleError(err));
  };
}

function handleStockItem(invoice, product, price, res) {
  return function(stock) {
    if (!stock) {
      stock = new Stock();
      //CommonFields
      stock.quantity = product.quantity;
      stock.remaining = product.quantity;
      stock.name = product.product.name;
      stock.product = product.product._id;
      stock.provider = product.product.provider;
      stock.item = product.product.item;
      stock.store = invoice.store;
      stock.unitCost = product.unitCost;
      stock.invoice = invoice;
      stock.invoiceNumber = invoice.invoiceNumber;
      stock.referenceProduct = product._id;
    } else {
      stock.quantity += product.quantity;
      stock.remaining += product.quantity;
    }
    stock.unitPrice = price;
    return stock.save(finalizeProductInvoice(invoice, product, res));
  };
}
