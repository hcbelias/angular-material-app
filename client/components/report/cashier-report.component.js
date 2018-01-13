"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class CashierReportComponent {
  constructor(Cashier, CSVExporter, $scope, $filter) {
    "ngInject";
    this.Cashier = Cashier;
    this.CSVExporter = CSVExporter;
    this.scope = $scope;
    this.filter = $filter;
  }

  $onInit() {
    this.sales = [];
    this.datasetOverride = [
      {
        label: "Fechamento de Caixa",
        borderWidth: 1,
        type: "bar"
      }
    ];

    this.chartOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };
  }

  getTotalPerSale(entry, type) {
    let val = entry.reduce((agg, it) => agg + it[type], 0);

    return val;
  }
  getTotal(type) {
    if (this.reportData) {
      let reducerSale = (agg, it) => agg + it[type];
      let reducerDestructure = (agg, it) => agg + it.reduce(reducerSale, 0);
      let reducerCashier = (agg, it) =>
        agg + it.sales.reduce(reducerDestructure, 0);
      let val = this.reportData.reduce(reducerCashier, 0);
      return val.toFixed(2);
    }
  }

  getSalesId(type) {
    if (this.reportData) {
      let reducerSale = (agg, it) => agg + it[type];
      let reducerDestructure = (agg, it) => agg + it.reduce(reducerSale, 0);
      let reducerCashier = (agg, it) =>
        agg + it.sales.reduce(reducerDestructure, 0);
      let val = this.reportData.reduce(reducerCashier, 0);
      return val.toFixed(2);
    }
  }

  setReportData(reportData) {
    this.reportData = reportData;
    this.listReportData = [];
    let reportIndex = this.reportData.length;
    for (let i = 0; i < reportIndex; i++) {
      for (
        let innerIndex = 0;
        innerIndex < this.reportData[i].count;
        innerIndex++
      ) {
        let innerData = this.reportData[i][innerIndex];
        this.listReportData.push({
          balanceCard: this.reportData[i].balanceCard[innerIndex],
          balanceMoney: this.reportData[i].balanceMoney[innerIndex],
          cashierNumber: this.reportData[i].cashierNumber[innerIndex],
          closeDate: this.reportData[i].closeDate[innerIndex],
          createdAt: this.reportData[i].createdAt[innerIndex],
          id: this.reportData[i].id[innerIndex],
          justifyCard: this.reportData[i].justifyCard[innerIndex],
          justifyMoney: this.reportData[i].justifyMoney[innerIndex],
          moneyBalance: this.reportData[i].moneyBalance[innerIndex],
          sales: this.reportData[i].sales[innerIndex],
          userClosed: this.reportData[i].userClosed[innerIndex],
          userNameClosed: this.reportData[i].userNameClosed[innerIndex],
          userNameOpened: this.reportData[i].userNameOpened[innerIndex],
          userOpened: this.reportData[i].userOpened[innerIndex]
        });
      }
    }

    //updating options to send data through chart lib
    this.chartOptions.info = reportData;

    this.data = [[]];
    this.series = ["FechamentoCaixa"];
    this.labels = [];
    reportData.forEach(element => {
      this.data[0].push(element.count);
      let date = new Date(
        element._id.year,
        element._id.month - 1,
        element._id.day
      );
      let dateFormatted = this.filter("date")(date, "d/MM/yy");
      this.labels.push(dateFormatted);
    });
  }

  searchData() {
    this.loading = true;
    this.Cashier.getCashiersReportData(
      { id: this.store._id, start: this.startDate, end: this.endDate },
      data => {
        if (data.length) {
          this.setReportData(data);
        } else {
          this.reportData = [];
          this.data = [[]];
          this.labels = [];
        }
        this.loading = false;
      }
    );
  }

  generateFile() {
    if (this.reportData) {
      this.CSVExporter.JSONToCSVConvertor(
        this.reportData.map(item => {
          return {
            day: item._id.day,
            month: item._id.month,
            year: item._id.year,
            count: item.count,
            moneyBalance: item.moneyBalance,
            store: item._id.store
          };
        }),
        "Fechamento_Caixa",
        true
      );
    }
  }
}

export default angular
  .module("directives.cashierReport", [])
  .component("cashierReport", {
    template: require("./cashier-report.pug"),
    controller: CashierReportComponent,
    controllerAs: "ctrl",
    bindings: {
      storeList: "="
    }
  }).name;
