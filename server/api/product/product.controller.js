/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  upsert
 * PATCH   /api/products/:id          ->  patch
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Product from './product.model';
import Invoice from '../invoice/invoice.model';
import Stock from '../stock/stock.model';
import mongoose from 'mongoose';
import { debug } from 'util';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
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
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).json({ "message": err.message });
  };
}

// Gets a list of Products
export function index(req, res) {
  const query = {};
  if (req.query && req.query.q) {
    const querystring = req.query.q
      .replace(/a/g, '[aáäãâà]')
      .replace(/e/g, '[eéëèê]')
      .replace(/i/g, '[iíïìî]')
      .replace(/o/g, '[oóöõôò]')
      .replace(/u/g, '[uúüùû]')
      ;
    $or: [
      {
        name: {
          $regex: `.*${querystring}.*`,
          $options: 'i'
        }
      }
    ]
  }


  if (req.query && req.query.provider) {
    query.$or.push({ provider: req.query.provider });
  }

  return Product.find(query)
    .sort({ name: 1 })
    .populate('item')
    .populate('provider')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  return Product.findById(req.params.id)
    .populate('item')
    .populate('provider')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getLatestInvoiceByProduct(req, res) {
  const productId = new mongoose.Types.ObjectId(req.params.id);

  return Invoice.findOne({ "productList.product": productId })
    .sort({ invoiceNumber: -1 })
    .limit(1)
    .exec()
    .then((data) => {
      let cost = 0;
      if (data !== null) {
        let productArray = data.productList.filter((a) => {
          return a.product.toJSON() === productId.toJSON();
        });

        cost = productArray.length > 0 ? productArray[0].unitCost : 0;
      }
      return res.status(200).json({ unitCost: cost });
    })
    .catch(handleError(res));
}


export function getLatestPriceByProduct(req, res) {
  const productId = new mongoose.Types.ObjectId(req.params.id);

  return Stock.findOne({ "product": productId })
    .sort({ createdAt: -1 })
    .limit(1)
    .exec()
    .then((data) => {
      if(!data){
         return res.status(200).json({});
      }
      let price = {
        unitPrice: data ? data.unitPrice : 0,
        pintPrice: data ? data.pintPrice : 0,
        literPrice: data ? data.literPrice : 0,
      };
      return res.status(200).json(price);
    })
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  return Product.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Product in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function uploadImage(req, res) {
  debugger;

}