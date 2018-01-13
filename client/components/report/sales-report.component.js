"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class SalesReportComponent {
  constructor(Cashier, CSVExporter, CashierCalculator) {
    "ngInject";
    this.CSVExporter = CSVExporter;
    this.Cashier = Cashier;
    this.CashierCalculator = CashierCalculator;
  }

  $onInit() {}

  sumItem(item) {
    let reducerTotalLiter = (agg, it) => agg + it.literSold + it.pintSold / 2;
    let reducerKegTotalCost = (agg, it) =>
      agg + (it.literSold + it.pintSold / 2) * it.unitCost;
    let reducerProductTotalCost = (agg, it) => agg + it.qtdSold * it.unitCost;

    let kegList = item.sales.stockList.filter(product => product.isKeg);
    let productList = item.sales.stockList.filter(product => !product.isKeg);
    this.kegTotalSales += this.CashierCalculator.getTotalSale(
      kegList,
      [],
      [],
      true
    );
    this.kegTotalLiter += kegList.reduce(reducerTotalLiter, 0);
    this.kegTotalCost += kegList.reduce(reducerKegTotalCost, 0);

    this.productTotalCost += productList.reduce(reducerProductTotalCost, 0);
    this.productTotalSales += this.CashierCalculator.getTotalSale(
      [],
      [],
      productList,
      true
    );
  }

  setDetailResult(data) {
    this.kegTotalLiter = 0;
    this.kegTotalCost = 0;
    this.kegTotalSales = 0;
    this.kegProfit = 0;
    this.productTotalCost = 0;
    this.productTotalSales = 0;
    this.productProfit = 0;

    data.forEach(this.sumItem.bind(this));
    this.kegProfit = this.kegTotalSales - this.kegTotalCost;
    this.productProfit = this.productTotalSales - this.productTotalCost;
  }

  searchData() {
    this.loading = true;
    this.Cashier.getSalesReportData(
      { id: this.store._id, start: this.startDate, end: this.endDate },
      data => {
        if (data.length) {
          this.data = data;
        } else {
          this.data = [];
        }
        this.setDetailResult(data);
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  generateFile() {
    if (this.data) {
      this.CSVExporter.JSONToCSVConvertor(
        this.data.map(item => {
          return {
            id: item.sales._id,
            cashier: item.cashierNumber || item._id,
            total: item.sales.total,
            paymentCard: item.sales.paymentCard,
            paymentMoney: item.sales.paymentMoney,
            user: item.sales.userName || item.sales.userEmail,
            createdAt: item.sales.createdAt
          };
        }),
        "Vendas",
        true
      );
    }
  }
}

export default angular
  .module("directives.salesReport", [])
  .component("salesReport", {
    template: require("./sales-report.pug"),
    controller: SalesReportComponent,
    controllerAs: "ctrl",
    bindings: {
      storeList: "="
    }
  }).name;
