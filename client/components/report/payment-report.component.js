"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class PaymentReportComponent {
  constructor(Cashier, CSVExporter, $filter) {
    "ngInject";
    this.Cashier = Cashier;
    this.CSVExporter = CSVExporter;
    this.filter = $filter;
  }

  $onInit() {
    this.datasetOverride = [
      {
        label: "Faturamento Total",
        borderWidth: 1,
        type: "bar"
      },
      {
        label: "Vendas",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: "line"
      },
      {
        label: "Faturamento Médio",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: "line"
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

  getTotal(type) {
    if (this.reportData) {
      let reducerSale = (agg, it) => agg + it[type];
      let reducerCashier = (agg, it) => agg + it.sales.reduce(reducerSale, 0);
      let val = this.reportData.reduce(reducerCashier, 0);
      return val.toFixed(2);
    }
  }

  setReportData(reportData) {
    this.reportData = reportData;
    this.data = [[], [], []];
    this.series = ["Faturamento"];
    this.labels = [];
    reportData.forEach(element => {
      this.data[0].push(element.totalSales.toFixed(2));
      this.data[1].push(element.count);
      this.data[2].push(element.averageSales.toFixed(2));
      let date = new Date(element._id.year, (element._id.month-1), element._id.day);
      let dateFormatted = this.filter("date")(date, "d/MM/yy");
      this.labels.push(dateFormatted);
    });
  }

  searchPaymentData() {
    this.loading = true;
    this.Cashier.getPaymentsReportData(
      { id: this.store._id, start: this.startDate, end: this.endDate },
      data => {
        if (data.length) {
          this.setReportData(data);
        } else {
          this.reportData = [];
          this.data = [[], [], []];
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
            month: item._id.month,
            year: item._id.year,
            store: item._id.store,
            count: item.count,
            averageSales: item.averageSales,
            totalSales: item.totalSales
          };
        }),
        "Faturamento",
        true
      );
    }
  }
}

export default angular
  .module("directives.paymentReport", [])
  .component("paymentReport", {
    template: require("./payment-report.pug"),
    controller: PaymentReportComponent,
    controllerAs: "ctrl",
    bindings: {
      storeList: "="
    }
  }).name;
