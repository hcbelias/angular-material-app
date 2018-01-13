import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./product-view.routes";

export class ProductViewController {
  /*@ngInject*/
  constructor($stateParams, Product, $mdToast) {
    this.stateParams = $stateParams;
    this.Product = Product;
    this.toast = $mdToast;
  }

  $onInit() {
    if (this.stateParams.id) {
      this.Product.getProduct(
        { id: this.stateParams.id },
        data => this.loadData(data),
        error => this.onError(error, "buscar")
      );
    }
  }

  loadData(data) {
    this.data = data;
    this.Product.getLatestPrice(
      { id: this.stateParams.id },
      payload => {
        this.data.pintPrice = payload.pintPrice;
        this.data.literPrice = payload.literPrice;
      },
      error => console.log(error)
    );
  }

  onError(error, operationName) {
    let errorMessage =
      error.data && error.data.message
        ? error.data.message
        : `Ocorreu um erro ao ${operationName} os dados. Tente novamente.`;
    this.toast.show(
      this.toast
        .simple()
        .textContent(errorMessage)
        .position("bottom right")
        .hideDelay(9000)
    );
    console.log(error);
  }
}

export default angular
  .module("webApp.productview", [uiRouter])
  .config(routing)
  .component("productview", {
    template: require("./product-view.pug"),
    controller: ProductViewController
  }).name;
