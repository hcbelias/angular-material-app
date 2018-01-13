import { debug } from "util";

export default class ConfirmationInvoiceController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Invoice, $mdToast, Store, Provider, $mdDialog, Auth, Product) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Invoice = Invoice;
    this.toast = $mdToast;
    this.Provider = Provider;
    this.dialog = $mdDialog;
    this.Auth = Auth;
    this.Product = Product;
  }

  $onInit() {
    this.Auth.isLoggedIn(
      (role) => {
        this.isAdmin = (role === 'admin');
      });

    this.loadInvoiceData();
    this.label = 'Buscar Pedidos';

  }

  loadInvoiceData() {
    this.Invoice.getInvoice({ id: this.stateParams.id }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
  }

  loadData(data) {
    this.data = data;

    this.data.productList.forEach(
      (item) => {
        this.Product.getLatestPrice({ id: item.product }, (payload) => {
          item.sellPrice = payload.unitPrice;
          item.sellPricePint = payload.pintPrice;
          item.sellPriceLiter = payload.literPrice;
        }, (error) => console.log(error));
      },
    );

    this.Provider.getProviderProducts({ id: this.data.provider._id }, (data) => {
      this.productList = data;
      this.data.productList.forEach(
        (item) => {
          item.product = this.productList.find((cache) => item.product === cache._id);
        },
      );
    }, (error) => this.onError(error, 'buscar'));
  }

  onError(error, operationName) {
    let errorMessage = error.data && error.data.Message ? error.data.message : `Ocorreu um erro ao ${operationName} os dados. Tente novamente.`;
    this.toast.show(
      this.toast.simple()
        .textContent(errorMessage)
        .position('bottom right')
        .hideDelay(3000)
    );
    console.log(error);
  }

  openInvoiceDetail() {
    if (this.isAdmin) {
      this.state.go('invoice-edit', { id: this.stateParams.id });
    }

  }

  confirmProduct(product) {
    if (product.sellPrice) {
      var confirm = this.dialog.confirm()
        .title(`Confirmação de Recebimento - Produto`)
        .textContent(`Esta operação não pode ser desfeita. \nDeseja confirmar o recebimento de ${product.quantity} unidade(s) do ${product.product.name} - ${product.product.item.name}?`)
        .ariaLabel('Confirmação de Recebimento')
        .ok('Confirmar')
        .cancel('Cancelar');

      this.dialog.show(confirm).then(() => {
        this.Invoice.confirmProduct({ id: this.stateParams.id, actionid: product._id, price: product.sellPrice }, (data) => {
          product.done = true;
        }, (error) => this.onError(error, 'confirmar'));
      }, () => { });
    }
  }

  confirmKeg(product, keg, literPrice, pintPrice) {
    if (pintPrice && literPrice) {
      var confirm = this.dialog.confirm()
        .title(`Confirmação de Recebimento - Barril de Chopp`)
        .textContent(`Esta operação não pode ser desfeita. Deseja confirmar o recebimento de ${product.quantity} barril de chopp ${product.product.name} de ${keg.volume} L?`)
        .ariaLabel('Confirmação de Recebimento')
        .ok('Confirmar')
        .cancel('Cancelar');

      this.dialog.show(confirm).then(() => {
        this.Invoice.confirmKeg({ id: this.stateParams.id, actionid: product._id, subactionid: keg._id, literPrice, pintPrice }, (data) => {
          keg.delivered++;
          keg.done = keg.delivered >= keg.quantity;
          product.done = product.volume.every((item) => item.done || !item.enabled || item.quantity === 0);
          this.data.done = data.productList.every((item) => item.done);
        }, (error) => this.onError(error, 'buscar'));
      }, () => { });
    }
  }
}
