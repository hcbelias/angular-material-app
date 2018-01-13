import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./store-view.routes";

export class StoreViewController {
  kegList = [];

  /*@ngInject*/
  constructor($stateParams, Store) {
    this.stateParams = $stateParams;
    this.Store = Store;
  }

  $onInit() {
    if (this.stateParams.orderId) {
      const timeout = 1000 * 60 * 20;
      setTimeout(function() {
        window.location.reload();
      }, timeout);
      this.Store.getStores(
        {},
        data => {
          this.findStoreByOrder(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  findStoreByOrder(data) {
    let storeData = data.find(
      p => p.order === Number(this.stateParams.orderId)
    );
    if (storeData) {
      this.store = storeData;
      this.Store.getKegList(
        { id: storeData._id },
        data => {
          this.kegList = data;
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}

export default angular
  .module("webApp.storeview", [uiRouter])
  .config(routing)
  .component("storeview", {
    template: require("./store-view.pug"),
    controller: StoreViewController
  }).name;
