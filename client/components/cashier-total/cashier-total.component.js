"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class CashierTotalComponent {
  constructor(data, successCallback, dialog, CashierCalculator) {
    "ngInject";
    this.data = data;
    this.lengthTime =
      ((new Date() - new Date(this.data.cashier.createdAt)) / (60 * 60 * 1000)).toFixed(2);
    this.cb = successCallback;
    this.dialog = dialog;
    this.calculator = CashierCalculator;
  }

  finalizeCashier() {
    this.data.loading = true;
    this.validateMoneyBalance();
  }

  validateMoneyBalance() {
    let calculatedBalance = this.getCurrentMoneyBalance();
    let diff = Math.abs(calculatedBalance - this.balance);

    if (diff > 0) {
      let textCond = diff === 1 ? "real" : "reais";
      var confirm = this.dialog
        .prompt()
        .title(
          "Diferença do saldo informado e o saldo calculado no caixa - Dinheiro"
        )
        .textContent(
          `O saldo calculado não está de acordo com o valor informado(R$${
            this.balance
          }) no caixa. Há uma diferença de ${diff.toFixed(2)} ${textCond}.`
        )
        .placeholder("Justificativa - Dinheiro")
        .ariaLabel("Justificativa - Dinheiro")
        .required(true)
        .ok("Confirmar")
        .cancel("Cancelar");
      this.dialog.show(confirm).then(this.validateCardBalance.bind(this));
    } else {
      this.validateCardBalance("");
    }
  }

  validateCardBalance(justifyMoney) {
    let calculatedBalance = this.getCardPayment();
    let diff = Math.abs(calculatedBalance - this.balanceCard);
    if (diff > 0) {
      let textCond = diff === 1 ? "real" : "reais";
      var confirm = this.dialog
        .prompt()
        .title("Diferença do saldo informado e o recibo do cartão - Cartão")
        .textContent(
          `O recibo não está de acordo com o valor informado(R$${
            this.balanceCard
          }). Há uma diferença de ${diff.toFixed(2)} ${textCond}.`
        )
        .placeholder("Justificativa - Cartão")
        .ariaLabel("Justificativa - Cartão")
        .required(true)
        .ok("Confirmar")
        .cancel("Cancelar");

      this.dialog.show(confirm).then(answer => {
        this.cb(this.balanceCard, this.balance, justifyMoney, answer);
      });
    } else {
      this.cb(justifyMoney, "");
    }
  }

  getTotalPayment() {
    return this.calculator.getTotalPayment(this.data.cashier.sales);
  }
  getMoneyPayment() {
    return this.calculator.getMoneyPayment(this.data.cashier.sales);
  }
  getCardPayment() {
    return this.calculator.getCardPayment(this.data.cashier.sales);
  }

  getCardAndMoneySales() {
    return this.calculator.getCardAndMoneySales(this.data.cashier.sales);
  }

  getCardSales() {
    return this.data.cashier.sales.filter(
      item => item.paymentCard === item.total
    ).length;
  }

  getMoneySales() {
    return this.data.cashier.sales.filter(
      item => item.paymentMoney === item.total
    ).length;
  }
  getCurrentMoneyBalance() {
    return this.calculator.getCurrentMoneyBalance(
      this.data.cashier.moneyBalance,
      this.data.cashier.sales
    );
  }

  getCardSales() {
    return this.data.cashier.sales.filter(
      item => item.paymentCard === item.total
    ).length;
  }

  getMoneySales() {
    return this.data.cashier.sales.filter(
      item => item.paymentMoney === item.total
    ).length;
  }
}
