/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cashiers              ->  index
 * POST    /api/cashiers              ->  create
 * GET     /api/cashiers/:id          ->  show
 * PUT     /api/cashiers/:id          ->  upsert
 * PATCH   /api/cashiers/:id          ->  patch
 * DELETE  /api/cashiers/:id          ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Cashier from "./cashier.model";
import Sales from "../sale/sale.model";
import Stock from "../stock/stock.model";
import { currentId } from "async_hooks";
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function getPaymentDataReport(req, res) {
  //getting only the ones that have sales
  let query = {
    sales: { $exists: true, $not: { $size: 0 } },
    store: mongoose.Types.ObjectId(req.params.id)
  };

  if (req.query.start) {
    query.createdAt = { $gte: getEmptyTime(req.query.start, true) };
  }
  if (req.query.end) {
    query.closeDate = { $lte: getEmptyTime(req.query.end, false) };
  }

  return Cashier.aggregate([
    {
      $match: query
    },
    {
      $unwind: "$sales"
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          store: "$store"
        },
        totalSales: { $sum: "$sales.total" },
        averageSales: { $avg: "$sales.total" },
        count: { $sum: 1 },
        sales: { $push: "$sales" },
        paymentMoney: { $sum: "$sales.paymentMoney" },
        paymentCard: { $sum: "$sales.paymentCard" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ])
    .exec()
    .then(respondWithResult(res))
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
  return dateData; //new Date(dateData.year, dateData.month, dateData.day, 0, 0, 0);
}

export function getSalesDataReport(req, res) {
  let query = {
    store: mongoose.Types.ObjectId(req.params.id)
  };

  let dateFilter = {};

  if (req.query.start) {
    dateFilter['sales.createdAt'] = { $gte: getEmptyTime(req.query.start, true) };
  }
  if (req.query.end) {
    dateFilter['sales.createdAt'] = { $lte: getEmptyTime(req.query.end, false) };
  }

  return Cashier.aggregate([
    {
      $match: query
    },
    {
      $unwind: "$sales"
    },
    {
      $match:  dateFilter
    },
    {
      $sort: {
        "sales.createdAt": -1
      }
    }
  ])
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getCashierDataReport(req, res) {
  //getting only the ones that have sales
  let query = {
    store: mongoose.Types.ObjectId(req.params.id)
  };

  if (req.query.start) {
    query.createdAt = { $gte: getEmptyTime(req.query.start, true) };
  }
  if (req.query.end) {
    query.closeDate = { $lte: getEmptyTime(req.query.end, false) };
  }

  return Cashier.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          store: "$store"
        },
        count: { $sum: 1 },
        sales: { $push: "$sales" },
        closeDate: { $push: "$closeDate" },
        userNameClosed: { $push: "$userNameClosed" },
        userNameOpened: { $push: "$userNameOpened" },
        userClosed: { $push: "$userEmailClosed" },
        userOpened: { $push: "$userEmailOpened" },
        moneyBalance: { $push: "$moneyBalance" },
        balanceMoney: { $push: "$balanceMoney" },
        balanceCard: { $push: "$balanceCard" },
        createdAt: { $push: "$createdAt" },
        justifyCard: { $push: "$justifyCard" },
        justifyMoney: { $push: "$justifyMoney" },
        cashierNumber: { $push: "$cashierNumber" },
        id: { $push: "$_id" }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ])
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Cashiers
export function index(req, res) {
  let query = {};

  if (req.query.start) {
    query.createdAt = { $gte: req.query.start };
  }
  if (req.query.end) {
    query.closeDate = { $lte: req.query.end };
  }

  return Cashier.find(query)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cashier from the DB
export function show(req, res) {
  return Cashier.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cashier in the DB
export function create(req, res) {
  return Cashier.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Cashier in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Cashier.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  })
    .exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Cashier in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Cashier.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .catch(handleError(res));
}

// Deletes a Cashier from the DB
export function destroy(req, res) {
  return Cashier.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function addSales(req, res) {
  let updateStock = currentValue => {
    let inc = {};
    if (currentValue.isKeg) {
      currentValue.literSold = currentValue.qtdLiter;
      currentValue.pintSold = currentValue.qtdPint;

      inc.literSold = currentValue.qtdLiter;
      inc.pintSold = currentValue.qtdPint;
      inc.remaining = -(currentValue.qtdPint / 2 + currentValue.qtdLiter);
    } else {
      currentValue.qtdSold = currentValue.qtd;
      inc.qtdSold = currentValue.qtd;
      inc.remaining = -currentValue.qtd;
    }
    return Stock.findByIdAndUpdate(currentValue._id, { $inc: inc })
      .exec()
      .catch(err => {
        console.log("Error updating stock: " + currentValue._id);
        return currentValue;
      });
  };

  let productList = req.body.productList;
  let growlerList = req.body.growlerList;
  let kegList = req.body.kegList;
  const allElementsList = [...productList, ...growlerList, ...kegList];
  let promiseList = allElementsList.map(item => {
    return updateStock(item);
  });
  let salesData = new Sales();
  salesData.stockList = allElementsList;
  salesData.user = req.user.id;
  salesData.userEmail = req.user.email;
  salesData.userName = req.user.name;
  salesData.total = req.body.total;
  salesData.paymentMoney = req.body.paymentMoney;
  salesData.paymentCard = req.body.paymentCard;

  return Promise.all(promiseList)
    .then(values => {
      return Cashier.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { sales: salesData } },
        { runValidators: true }
      )
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
    })
    .catch(reason => {
      console.log(reason);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro ao salvar no estoque: " + reason });
    });
}
