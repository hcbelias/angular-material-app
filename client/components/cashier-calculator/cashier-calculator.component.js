"use strict";
/* eslint no-sync: 0 */

import angular from "angular";
import { debug } from "util";

export class CashierCalculatorComponent {
  constructor() {
    "ngInject";
  }

  getTotalSale(kegList, growlerList, productList, fill) {
    kegList = kegList || [];
    growlerList = growlerList || [];
    productList = productList || [];

    const reducerProduct = (accumulator, currentValue) => {
      if(fill)
      {
        currentValue.qtd = currentValue.qtdSold;
      }

      if (currentValue.empty || !currentValue.qtd) {
        return accumulator;
      }

      return accumulator + currentValue.qtd * currentValue.unitPrice;
    };
    const reducerKeg = (accumulator, currentValue) => {
      if (currentValue.empty) {
        return accumulator;
      }
      return accumulator + this.getKegSaleWithDoublePintDiscount(currentValue, fill);
    };

    const totalKeg = kegList.reduce(reducerKeg, 0, fill);
    const totalGrowler = growlerList.reduce(reducerProduct, 0, fill);
    const totalProduct = productList.reduce(reducerProduct, 0, fill);
    const totalSale = totalKeg + totalGrowler + totalProduct;
    return totalSale;
  }

  getKegSaleWithDoublePintDiscount(keg, fill) {
    if(fill){
      keg.qtdPint = keg.pintSold;
      keg.qtdLiter = keg.literSold;
    }
    if (!keg.qtdPint) {
      keg.qtdPint = 0;
    }
    if (!keg.qtdLiter) {
      keg.qtdLiter = 0;
    }
    let totalVolume = keg.qtdLiter + keg.qtdPint / 2;
    let volumeLiterPrice = Math.floor(totalVolume);
    let remaining = totalVolume - volumeLiterPrice;
    let volumePintPrice = remaining > 0 ? 1 : 0; // Until we have diff sizes for chopps
    return volumeLiterPrice * keg.literPrice + volumePintPrice * keg.pintPrice;
  }

  getMoneyPayment(sales) {
    const reducer = (agg, it) => agg + it.paymentMoney;
    return sales.reduce(reducer, 0);
  }

  getTotalPayment(sales) {
    const reducer = (agg, it) => agg + it.total;
    return sales.reduce(reducer, 0);
  }
  getCardPayment(sales) {
    const reducer = (agg, it) => agg + it.paymentCard;
    return sales.reduce(reducer, 0);
  }

  getCardAndMoneySales(sales) {
    return sales.filter(
      item =>
        item.paymentCard > 0 &&
        item.paymentMoney > 0 &&
        item.total !== item.paymentCard &&
        item.total !== item.paymentMoney
    ).length;
  }

  getCurrentMoneyBalance(moneyBalance, sales) {
    return moneyBalance + this.getMoneyPayment(sales);
  }
}
export default angular
  .module("webApp.cashiercalculator", [])
  .service("CashierCalculator", CashierCalculatorComponent).name;
