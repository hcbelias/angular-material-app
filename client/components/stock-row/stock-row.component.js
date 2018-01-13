"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class StockRowComponent {
  constructor(Auth, Stock, $mdToast, $mdDialog) {
    "ngInject";
    this.Stock = Stock;
    this.toast = $mdToast;
    this.dialog = $mdDialog;
  }

  $onInit() {
    this.data.store.orderFormatted = ("0" + this.data.store.order).slice(-2);
  }

  saveStockData(stock) {
    this.Stock.editStock(
      { id: stock._id },
      stock,
      data => {
        this.toast.show(
          this.toast
            .simple()
            .textContent("Dados salvo com sucesso!")
            .position("bottom right")
            .hideDelay(3000)
        );
      },
      error => this.onError(error, "salvar")
    );
  }

  finalizeStock(stock) {
    const stockDesc = stock.isKeg
      ? `${stock.name} - ${stock.kegId}LJ${stock.store.orderFormatted}`
      : `${stock.name}`;

    let confirm = this.dialog
      .confirm()
      .title(`Finalização de Produto`)
      .textContent(
        `Esta operação não pode ser desfeita. Deseja finalizar o produto ${
          stockDesc
        }?`
      )
      .ariaLabel("Finalização de Produto")
      .ok("Confirmar")
      .cancel("Cancelar");
    this.dialog.show(confirm).then(() => {
      this.Stock.finalizeStock(
        { id: stock._id },
        data => {
          stock.finalized = true;
          this.toast.show(
            this.toast
              .simple()
              .textContent("Estoque finalizado com sucesso!")
              .position("bottom right")
              .hideDelay(3000)
          );
        },
        error => this.onError(error, "buscar")
      );
    });
  }

  onError(error, operationName) {
    let errorMessage =
      error.data && error.data.Message
        ? error.data.message
        : `Ocorreu um erro ao ${operationName} os dados. Tente novamente.`;
    this.toast.show(
      this.toast
        .simple()
        .textContent(errorMessage)
        .position("bottom right")
        .hideDelay(3000)
    );
    console.log(error);
  }
}

export default angular.module("directives.stockrow", []).component("stockrow", {
  template: require("./stock-row.pug"),
  controller: StockRowComponent,
  bindings: {
    data: "<",
    admin: "<"
  },
  controllerAs: "stockrowCtrl"
}).name;
