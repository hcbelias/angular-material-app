/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stocks              ->  index
 * POST    /api/stocks              ->  create
 * GET     /api/stocks/:id          ->  show
 * PUT     /api/stocks/:id          ->  upsert
 * PATCH   /api/stocks/:id          ->  patch
 * DELETE  /api/stocks/:id          ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Stock from "./stock.model";
import mongoose from "mongoose";

function respondWithResult(res, statusCode) {
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

// Gets a list of Stocks
export function index(req, res) {
  return Stock.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Stock from the DB
export function show(req, res) {
  return Stock.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Stock in the DB
export function create(req, res) {
  return Stock.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Stock in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Stock.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  })
    .exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function finalizeStock(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Stock.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { finalized: true, finalizeDate: new Date() } },
    { new: true, runValidators: true }
  )
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Stock in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Stock.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Stock from the DB
export function destroy(req, res) {
  return Stock.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function getEmptyTime(data, empty) {
  let dateData = new Date(data);
  if (empty) {
    dateData.setHours(0);
    dateData.setMinutes(0);
    dateData.setSeconds(0);
  } else {
    dateData.setHours(23);
    dateData.setMinutes(59);
    dateData.setSeconds(59);
  }
  return dateData;
}


function getEmptyTime(data, empty) {
  let dateData = new Date(data);
  if (empty) {
    dateData.setHours(0);
    dateData.setMinutes(0);
    dateData.setSeconds(0);
  } else {
    dateData.setHours(23);
    dateData.setMinutes(59);
    dateData.setSeconds(59);
  }
  return dateData;//new Date(dateData.year, dateData.month, dateData.day, 0, 0, 0);
}

export function getKegDataReport(req, res) {
  let query = {
    isKeg: true,
    finalized: true,
    store: mongoose.Types.ObjectId(req.params.storeId)
  };

  if (req.query.start) {
    query.createdAt = { $gte: getEmptyTime(req.query.start, true) };
  }
  if (req.query.end) {
    query.finalizeDate = { $lte: getEmptyTime(req.query.end, false) };
  }

  return Stock.find(query)
    .populate("product")
    .populate("store")
    .populate("invoice")
    .populate("item")
    .populate("provider")
    .sort({ createdAt: 1})
    .exec()
    .then((data)=> {
      return req.query.profit ? data.filter(p=> p.profitPercentage > req.query.profit) : data;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
