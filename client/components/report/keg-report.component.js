"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class KegReportComponent {
  constructor(Stock, CSVExporter) {
    "ngInject";
    this.CSVExporter = CSVExporter;
    this.Stock = Stock;
  }

  $onInit() {

  }
  searchData() {
    this.loading = true;
    this.Stock.getKegsReportData({ id: this.store._id, start: this.startDate, end: this.endDate, profit: this.profitPercentage }, (data) => {
      if (data.length) {
        this.data = data;
      } else {
        this.data = [];
      }
      this.loading = false;
    });
  }

  generateFile() {
    if (this.data) {
      this.CSVExporter.JSONToCSVConvertor(
        this.data.map(item => {
          return {
            name: item.name,
            volume: item.volume,
            volumeFinalizado: item.remaining,
            volumeFinalizadoPercentual: (item.remaining/item.volume*100),
            totalSale: item.totalSale,
            totalCost: item.totalCost,
            profit: item.profitPercentage || "Sem Venda",
            dataEstoque: item.createdAt,
            dataFinalizado: item.finalizeDate
          };
        }), 'Barril', true);
    }
  }
}

export default angular.module("directives.kegReport", [])
  .component("kegReport", {
    template: require("./keg-report.pug"),
    controller: KegReportComponent,
    controllerAs: 'ctrl',
    bindings: {
      storeList: '='
    }
  }).name;
