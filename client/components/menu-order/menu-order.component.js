"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class MenuOrderComponent {
  productSelectedList = [];
  growlerList = [];

  constructor(Auth, $mdDialog, Store, $mdToast) {
    "ngInject";
    this.dialog = $mdDialog;
    this.Store = Store;
    this.toast = $mdToast;
  }

  filterByGrowlerIdList(data, filterGrowler) {
    return data.filter(iterator => {
      if (!iterator.item) {
        return false;
      }
      const index = iterator.item.name.search(new RegExp("growler", "i"));

      return filterGrowler ? index !== -1 : index === -1;
    });
  }

  removeGrowler(growler, removeFromList) {
    if (!growler.qtd) {
      growler.qtd = 0;
    }
    if (growler.qtd > 0) {
      growler.qtd--;
      growler.remaining++;
    }
    if (removeFromList && growler.qtd === 0) {
      let index = this.productSelectedList.findIndex(item => item === growler);
      this.removeProductFromList(index, growler);
    }
  }
  addGrowler(growler, addToList) {
    if (!growler.qtd) {
      growler.qtd = 0;
    }
    if (growler.remaining > 0) {
      growler.qtd++;
      growler.remaining--;
      if (addToList) {
        this.addProductToList(growler);
      }
    }
  }

  isNewProduct() {
    if (!this.selectedProduct)
      return false;
    const index = this.productSelectedList.find(item => item.id === this.selectedProduct.id);
    return !index || index < 0;
  }

  addProductToList(product) {
    const isNew = this.isNewProduct();
    if (isNew) {
      this.productSelectedList.unshift(product);
    }
  }

  removeProductFromList(index, product) {
    this.productSelectedList.splice(index, 1);
  }

  $onInit() {
    this.Store.getProducts(
      { id: this.store },
      data => {
        this.growlerList = this.filterByGrowlerIdList(data, true);
        this.productList = this.filterByGrowlerIdList(data, false);
      },
      err => {
        this.toast.show(
          this.toast
            .simple()
            .textContent(
            "Ocorreu um erro ao buscar os produtos desta loja. Por favor, tente novamente ou entre em contato com o administrador."
            )
            .position("bottom right")
            .hideDelay(3000)
        );
      }
    );
  }
}

export default angular
  .module("directives.menuOrder", [])
  .component("menuOrder", {
    template: require("./menu-order.pug"),
    controller: MenuOrderComponent,
    bindings: {
      store: "<",
      growler: "=",
      growlerList: "=",
      productSelectedList: "="
    },
    controllerAs: "menu"
  }).name;
