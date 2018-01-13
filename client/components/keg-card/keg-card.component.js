"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class KegCardComponent {
  constructor(Auth, $mdDialog, CashierCalculator) {
    "ngInject";
    this.dialog = $mdDialog;
    this.calculator = CashierCalculator;
  }

  addLiter() {
    if (!this.keg.qtdLiter) {
      this.keg.qtdLiter = 0;
    }

    this.keg.qtdLiter++;
    this.keg.remaining--;
    if (this.keg.qtdLiter > 0) {
      this.keg.growler = true;
    }
  }
  addPint() {
    if (!this.keg.qtdPint) {
      this.keg.qtdPint = 0;
    }

    this.keg.qtdPint++;
    this.keg.remaining -= 1 / 2;
  }

  removeLiter(val) {
    if (!this.keg.qtdLiter) {
      this.keg.qtdLiter = 0;
    }
    this.keg.qtdLiter--;
    this.keg.remaining++;
    if (this.keg.qtdLiter === 0) {
      this.keg.growler = false;
    }
  }
  removePint(val) {
    if (!this.keg.qtdPint) {
      this.keg.qtdPint = 0;
    }
    this.keg.qtdPint--;
    this.keg.remaining += 1 / 2;
  }

  getTotal() {
    return this.calculator
      .getKegSaleWithDoublePintDiscount(this.keg)
      .toFixed(2);
  }

  exchangeKeg(keg, position) {
    this.dialog
      .show({
        controller: KegExchangeModalComponent,
        template: require("./keg-exchange-modal.pug"),
        locals: { keg, position, storeId: this.store, cb: this.cb },
        controllerAs: "dialog"
      })
      .then(
        function(answer) {
          // $scope.status = 'You said the information was "' + answer + '".';
        },
        function() {
          //$scope.status = 'You cancelled the dialog.';
        }
      );
  }
}

export class KegExchangeModalComponent {
  constructor(keg, position, Store, storeId, $mdDialog, Stock, cb) {
    "ngInject";
    this.keg = keg;
    this.position = position;
    this.Store = Store;
    this.storeId = storeId;
    this.dialog = $mdDialog;
    this.Stock = Stock;
    this.cb = cb;
  }

  $onInit() {
    this.Store.getActiveKegs(
      { id: this.storeId, q: false },
      data => {
        this.kegList = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  setKegActive(newKeg, position, finalize) {
    this.Store.setActiveKeg(
      {
        id: this.storeId,
        actionid: newKeg._id,
        position: position,
        finalize,
        kegFinalized: this.keg._id
      },
      data => {
        this.cb();
        this.cancel();
      }
    );
  }
  showExchangeConfirmationModal(finalize, newKeg, position) {
    if (this.keg.empty) {
      this.setKegActive(newKeg, position, finalize);
      return;
    }
    const message = finalize
      ? `Trocar barril e finalizar barril:  ${this.keg.name} - ${
          this.keg.kegId
        }LJ${("0" + this.keg.store.order).slice(-2)} por ${newKeg.name} - ${
          newKeg.kegId
        }LJ${("0" + newKeg.store.order).slice(-2)}`
      : `Trocar barril:  ${this.keg.name} - ${this.keg.kegId}LJ${(
          "0" + this.keg.store.order
        ).slice(-2)} por ${newKeg.name} - ${newKeg.kegId}LJ${(
          "0" + newKeg.store.order
        ).slice(-2)}`;
    var confirm = this.dialog
      .confirm()
      .title(`Realizar Troca de Barril`)
      .textContent(`Esta operação não pode ser desfeita. ${message}?`)
      .ariaLabel("Finalizar Barril")
      .ok("Trocar")
      .cancel("Cancelar");
    this.dialog.show(confirm).then(
      () => {
        this.setKegActive(newKeg, position, finalize);
      },
      () => {
        this.cancel();
      }
    );
  }

  answer(keg, position) {
    if (this.keg.empty) {
      this.showExchangeConfirmationModal(false, keg, position);
      return;
    }
    var confirm = this.dialog
      .confirm()
      .title(`Finalizar Barrl`)
      .textContent(
        `Desejar finalizar o barril  ${this.keg.name} - ${this.keg.kegId}LJ${(
          "0" + this.keg.store.order
        ).slice(-2)}?`
      )
      .ariaLabel("Finalizar Barril")
      .ok("Finalizar")
      .cancel("Não Finalizar");
    this.dialog.show(confirm).then(
      () => {
        this.showExchangeConfirmationModal(true, keg, position);
      },
      () => {
        this.showExchangeConfirmationModal(false, keg, position);
      }
    );
  }

  cancel() {
    this.dialog.cancel();
  }
}

export default angular.module("directives.kegCard", []).component("kegCard", {
  template: require("./keg-card.pug"),
  controller: KegCardComponent,
  bindings: {
    keg: "=",
    position: "<",
    store: "<",
    cb: "&",
    growler: "=",
    edit: "<"
  }
}).name;
