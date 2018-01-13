"use strict";
/* eslint no-sync: 0 */

import angular from "angular";
import { debug } from "util";
import { loadavg } from "os";

export class SaleTotalComponent {
  constructor(
    Auth,
    $mdDialog,
    Store,
    $mdToast,
    data,
    Cashier,
    $state,
    successCallback,
    CashierCalculator,
    loadingFunc
  ) {
    "ngInject";
    this.dialog = $mdDialog;
    this.toast = $mdToast;
    this.data = data;
    this.Cashier = Cashier;
    this.successCallback = successCallback;
    this.calculator = CashierCalculator;
    this.loading = loadingFunc;
  }

  getTotalSale() {
    return this.calculator
      .getTotalSale(
        this.data.kegList,
        this.data.growlerList,
        this.data.productList
      )
      .toFixed(2);
  }

  updateMoneyValue() {
    if (this.paymentCard > this.totalSales) {
      this.paymentCard = this.totalSales;
    }
    this.paymentMoney = this.totalSales - this.paymentCard;
  }
  updateCardValue() {
    if (this.paymentMoney > this.totalSales) {
      this.paymentMoney = this.totalSales;
    }
    this.paymentCard = this.totalSales - this.paymentMoney;
  }

  validateTotal() {
    const valueOK = this.totalSales === this.paymentCard + paymentMoney;
    if (!valueOK) {
      var alert = this.dialog
        .alert()
        .title(`Valor Total Incorreto`)
        .textContent(``)
        .ariaLabel("Valor Total Incorreto")
        .ok("Confirmar");

      this.dialog.show(alert);
    }
  }

  finalizeSaleCompleteAlert() {
    var alert = this.dialog
      .alert()
      .title(`Compra finalizada com sucesso!`)
      .textContent(`Compra finalizada com sucesso`)
      .ariaLabel("Compra finalizada com sucesso")
      .ok("OK");

    this.dialog.show(alert);
  }

  changeValue() {
    if (!this.change) return (0).toFixed(2);
    return (this.change - this.totalSales).toFixed(2);
  }

  confirmSales() {
    this.loading(true);
    this.wait = true;
    return this.Cashier.finalizeSale(
      { id: this.data.cashier._id },
      {
        kegList: this.data.kegList,
        productList: this.data.productList,
        growlerList: this.data.growlerList,
        total: Number(this.totalSales),
        paymentMoney: Number(this.paymentMoney),
        paymentCard: Number(this.paymentCard)
      },
      data => {
        this.wait = false;
        this.loading(false);
        this.finalizeSaleCompleteAlert();
        this.successCallback();
      },
      err => {
        this.wait = false;
        let errorMsg =
          err.status === 401
            ? "Por favor, realize o login novamente."
            : "Ocorreu um erro ao finalizar a venda, por favor entre em contato com o administrador. Err: " +
              err.statusText.stringify();
        this.toast.show(
          this.toast
            .simple()
            .textContent(errorMsg)
            .position("bottom right")
            .hideDelay(9000)
        );
        console.log(err);
      }
    );
  }

  setPayment() {
    switch (this.payment) {
      case "money":
        this.paymentMoney = this.totalSales;
        this.updateCardValue();
        break;
      case "card":
        this.paymentCard = this.totalSales;
        this.updateMoneyValue();
        break;
      case "both":
        if (!this.paymentCard) {
          this.paymentCard = 0;
          this.updateMoneyValue();
        }
        if (!this.paymentMoney) {
          this.paymentMoney = 0;
          this.updateCardValue();
        }
        break;
      default:
        break;
    }
  }

  $onInit() {
    this.totalSales = this.getTotalSale();
    this.wait = false;
  }
}
