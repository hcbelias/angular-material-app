import { debug } from "util";

const COOKIE_NAME = "selected_store";

export default class ListInvoiceController {
  ngInject;

  /*@ngInject*/
  constructor($state, $stateParams, Invoice, $mdToast, Store, Auth, $cookies) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Invoice = Invoice;
    this.toast = $mdToast;
    this.Store = Store;
    this.Auth = Auth;
    this.cookies = $cookies;
  }

  $onInit() {
    this.loadStoreCookieData();
    this.Store.getStores(
      {},
      data => {
        if(this.initialized){
          this.storeFilter = this.storeId;
        }
        this.storeList = data.sort((a, b) => a.order - b.order);
      },
      error => this.onError(error, "buscar")
    );
    this.Invoice.getInvoices(
      {},
      data => {
        this.dataCache = data;
        this.search(this.searchText, this.statusFilter, this.storeFilter);
      },
      error => this.onError(error, "buscar")
    );
    this.label = "Buscar Pedidos";
    this.statusFilter = "active";
    this.storeFilter = "all";
  }

  search(text, filter, storeId) {
    switch (filter) {
      case "all":
        this.data = this.dataCache;
        break;
      case "active":
        this.data = this.dataCache.filter(item => !item.done);
        break;
      case "inactive":
        this.data = this.dataCache.filter(item => item.done);
        break;
    }
    this.data = text
      ? data.filter(function(invoice) {
          return invoice.provider.name.search(new RegExp(text, "i")) !== -1;
        })
      : this.data;

    this.data = this.data.filter(function(invoice) {
      return (
        storeId === "all" || (invoice.store && invoice.store._id === storeId)
      );
    });

    this.data.sort((a, b) => b.invoiceNumber - a.invoiceNumber);
  }

  loadData(data, firstLoad) {
    this.data = data.sort((a, b) => b.invoiceNumber - a.invoiceNumber);
  }

  loadStoreCookieData() {
    this.storeId = this.cookies.get(COOKIE_NAME);
    this.initialized = !!this.storeId;
  }

  openInfo(id) {
    this.Auth.isLoggedIn(role => {
      let nextState =
        role === "admin" ? "invoice-edit" : "invoice-confirmation";
      this.state.go(nextState, { id });
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
