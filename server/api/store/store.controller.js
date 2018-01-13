/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stores              ->  index
 * POST    /api/stores              ->  create
 * GET     /api/stores/:id          ->  show
 * PUT     /api/stores/:id          ->  upsert
 * PATCH   /api/stores/:id          ->  patch
 * DELETE  /api/stores/:id          ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Store from "./store.model";
import Stock from "../stock/stock.model";
import Cashier from "../cashier/cashier.model";
import mongoose from "mongoose";

//mongoose.set('debug', true);

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

function handleError(res) {
  return function(err) {
    res.status(500).send(err);
  };
}

// Gets a list of Stores
export function index(req, res) {
  return Store.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Store from the DB
export function show(req, res) {
  return Store.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Store in the DB
export function create(req, res) {
  return Store.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Store in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  })
    .exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Store in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Store.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Store from the DB
export function destroy(req, res) {
  return Store.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getStockByStore(req, res) {
  return Stock.find({ store: req.params.id, finalized: false })
    .populate("product")
    .populate("provider")
    .populate("invoice")
    .populate("item")
    .populate("store")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getProducts(req, res) {
  return Stock.find({
    store: req.params.id,
    finalized: false,
    active: true,
    isKeg: false
  })
    .populate("product")
    .populate("provider")
    .populate("invoice")
    .populate("item")
    .populate("store")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getKegList(req, res) {
  return Stock.find({
    store: req.params.id,
    finalized: false,
    active: true,
    isKeg: true
  })
    .populate("product")
    .populate("provider")
    .populate("invoice")
    .populate("item")
    .populate("store")
    .sort({ kegOrder: 1 })
    .exec()
    .then(handleEntityNotFound(res))
    .then(data => {
      return data.map(item => {
        return {
          name: item.name,
          provider: item.provider.shortName || item.provider.name,
          type: item.product.type,
          abv: item.product.abv,
          ibu: item.product.ibu,
          literPrice: item.literPrice,
          pintPrice: item.pintPrice,
          img: item.product.imgGooglePath
        };
      });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getActiveKegs(req, res) {
  let queryActive = true;
  if (req.query.q) {
    queryActive = req.query.q;
  }

  return Stock.find({
    store: req.params.id,
    finalized: false,
    active: queryActive,
    isKeg: true
  })
    .populate("product")
    .populate("provider")
    .populate("invoice")
    .populate("item")
    .populate("store")
    .sort({ kegOrder: 1 })
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function getLatestCashierData(req) {
  return Cashier.findOne({ store: req.params.id })
    .sort({ closeDate: 1 })
    .sort({ createdAt: 1 })
    .exec();
}

export function getLatestCashier(req, res) {
  return getLatestCashierData(req)
    .then(data => {
      if (!data) {
        return res.status(200).json({});
      }
      return res.status(200).json(data);
    })
    .catch(handleError(res));
}

export function openCashier(req, res) {
  let cashier = new Cashier();
  cashier.store = req.params.id;
  cashier.userOpened = req.user.id;
  cashier.userEmailOpened = req.user.email;
  cashier.userNameOpened = req.user.name;
  cashier.moneyBalance = req.body.moneyBalance;
  return cashier.save(err => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(cashier);
  });
}

export function closeCashier(req, res) {
  return getLatestCashierData(req).then(data => {
    if (!data) {
      return res.status(200).json({});
    }
    if (data.userClosed) {
      return res.status(200).json(data);
    }
    data.userClosed = req.user.id;
    data.userEmailClosed = req.user.email;
    data.userNameClosed = req.user.name;
    data.closeDate = Date.now();
    data.justifyCard = req.body.justifyCard || "";
    data.justifyMoney = req.body.justifyMoney || "";
    data.balanceMoney = req.body.balanceMoney || 0;
    data.balanceCard = req.body.balanceCard || 0;
    return data.save(function(err) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

export function setActiveKeg(req, res) {
  let query = { store: req.params.id, kegOrder: req.body.position };
  let set = { $set: { kegOrder: -1, active: false } };
  let multi = true;
  if (req.body.finalize && req.body.kegFinalized) {
    query._id = req.body.kegFinalized;
    multi = false;
    set = {
      $set: {
        kegOrder: -1,
        active: false,
        finalized: true,
        finalizeDate: new Date()
      }
    };
  }

  return Stock.update(query, set, { new: true, multi: multi })
    .exec()
    .then(data => {
      return Stock.findByIdAndUpdate(
        req.params.kegid,
        {
          $set: {
            kegOrder: req.body.position,
            active: true,
            openDate: new Date()
          }
        },
        { new: true }
      )
        .exec()
        .then(data => {
          return res.status(200).json(data);
        });
    })
    .catch(handleError(res));
}
