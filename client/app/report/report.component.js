import angular from "angular";
import uiRouter from "angular-ui-router";
import routing from "./report.routes";

const COOKIE_NAME = "selected_store";
export class ReportController {


  /*@ngInject*/
  constructor($cookies, Store) {
    this.cookies = $cookies;
    this.Store = Store;

  }

  $onInit() {
    this.Store.getStores({}, (data) => this.storeList = data.sort((a, b) => a.order - b.order), (error) => this.onError(error, 'buscar'));
  }
}

export default angular
  .module("webApp.report", [uiRouter])
  .config(routing)
  .component("report", {
    template: require("./report.pug"),
    controller: ReportController
  }).name;
