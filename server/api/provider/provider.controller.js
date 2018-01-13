/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/providers              ->  index
 * POST    /api/providers              ->  create
 * GET     /api/providers/:id          ->  show
 * PUT     /api/providers/:id          ->  upsert
 * PATCH   /api/providers/:id          ->  patch
 * DELETE  /api/providers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Provider from './provider.model';
import Product from '../product/product.model';
import Invoice from '../invoice/invoice.model';

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Providers
export function index(req, res) {
  let query = {};
  if (req.query && req.query.q) {
    const querystring = req.query.q
      .replace(/a/gi, '[aáäãâà]')
      .replace(/e/gi, '[eéëèê]')
      .replace(/i/gi, '[iíïìî]')
      .replace(/o/gi, '[oóöõôò]')
      .replace(/u/gi, '[uúüùû]');
    query = {
      $or: [
        {
          shortName: {
            $regex: `.*${querystring}.*`,
            $options: 'i'
          }
        },
        {
          name: {
            $regex: `.*${querystring}.*`,
            $options: 'i'
          }
        }
      ]
    }
  }

  return Provider.find(query)
    .sort({ shortName: 1 })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Provider from the DB
export function show(req, res) {
  return Provider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getProviderProducts(req, res) {
  return Product.find({ provider: req.params.id })
    .sort({ name: 1 })
    .populate('item')
    .populate('provider')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getProviderInvoices(req, res) {
  return Invoice.find({ provider: req.params.id })
    .sort({ name: 1 })
    .populate('product')
    .populate('store')
    .populate('provider')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Provider in the DB
export function create(req, res) {
  return Provider.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Provider in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Provider.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Provider in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Provider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Provider from the DB
export function destroy(req, res) {
  return Provider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
