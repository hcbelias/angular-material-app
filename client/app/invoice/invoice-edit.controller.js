import { error, debug } from 'util';

class CheckboxList {
  constructor(volume, enabled = false, quantity = 0, custom = false) {
    this.volume = volume;
    this.enabled = enabled;
    this.quantity = quantity;
    this.custom = custom;
    this.delivered = 0;
  }
}



export default class EditInvoiceController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Invoice, Product, $mdToast, Provider, Store) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Invoice = Invoice;
    this.Product = Product;
    this.Provider = Provider;
    this.toast = $mdToast;
    this.Store = Store;

  }

  $onInit() {
    this.isEdition = this.stateParams.id && this.stateParams.id !== 'new';
    this.title = this.isEdition ? 'Editar Pedido' : 'Novo Pedido';
    this.productListCache = [];
    this.kegVolumeList = [new CheckboxList(50), new CheckboxList(30), new CheckboxList(20), new CheckboxList(15), new CheckboxList(10), new CheckboxList(5), new CheckboxList(1, false, 1, true)];
    if (this.isEdition) {
      this.loadingData = true;
      this.Invoice.getInvoice({ id: this.stateParams.id }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
    } else {
      this.Store.getStores({}, (data) => this.storeList = data.sort((a, b) => a.order - b.order), (error) => this.onError(error, 'buscar'));
      this.Provider.getProviders({}, (data) => this.providerList = data, (error) => this.onError(error, 'buscar'));
      this.data = { productList: [], done: false };
    }
  }

  addItem() {
    if (!this.selectedProduct) {
      return;
    }

    const tempVolume = this.selectedProduct.item.isKeg ?
       [].concat(new CheckboxList(50), new CheckboxList(30), new CheckboxList(20), new CheckboxList(15), new CheckboxList(10), new CheckboxList(5), new CheckboxList(1, false, 1, true)) :
       [];

    let item = {
      product: this.selectedProduct,
      quantity: 1,
      totalQuantityVolume: 0,
      totalCostVolume: 0,
      volume: tempVolume,
      done: false
    };

    this.Product.getLatestUnitCost({ id: this.selectedProduct._id }, (payload) => item.unitCost = payload.unitCost, (error) => console.log(error));
    this.data.productList.unshift(item);
    this.selectedProduct = undefined;
  }
  
  toggleInfo(){
    this.confirmationPage = !this.confirmationPage;
  }

  removeProduct(product) {
    let index = this.data.productList.indexOf(product);
    if (index > -1) {
      this.data.productList.splice(index, 1);
    }
  }
  checkIfCostIsFilled(){
    return this.data && this.data.productList.some(item => !item.unitCost);
  }

  updateProductList(clearProductList) {
    if (clearProductList) {
      this.data.productList = [];
    }
    this.Provider.getProviderProducts({ id: this.data.provider._id }, (data) => {
      this.productListCache = data;
      this.loadingData = false;
      this.data.productList.forEach(
        (item) => {
          item.product = this.productListCache.find((cache) => item.product === cache._id);
        },
      );

    }, (error) => this.onError(error, 'buscar'));
  }

  loadData(data) {
    this.data = data;
    this.updateProductList(false);
  }

  onClickSaveButton(form) {
    if (form.$invalid) {
      return;
    }
    this.saveInvoice();
  }

  saveInvoice() {
    this.loading = true;
    if (this.isEdition) {
      this.Invoice.editInvoice(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'))
    } else {
      this.Invoice.createInvoice(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'))
    }
  }

  calculateCost(product){
    const isKeg = product.product.item.isKeg;
    const qtd = isKeg ? product.volume.reduce((a, b) => {
      return a + (b.enabled ? b.quantity * b.volume : 0); // number of L - qtd * keg size
    }, 0) : (product.quantity || 0);

    const cost = product.unitCost || 0;
    return (qtd * cost).toFixed(2);
  }

  calculateTotalCost() {
    if (this.data && this.data.productList) {
      let total = this.data.productList.reduce((a, b) => {
        const isKeg = b.product.item.isKeg;
        const qtd = isKeg ? b.volume.reduce((a, b) => {
          return a + (b.enabled ? b.quantity * b.volume : 0); // number of L - qtd * keg size
        }, 0) : (b.quantity || 0);
        const cost = b.unitCost || 0;
        return a + (qtd * cost);
      }, 0);
      return total.toFixed(2);
    }
  }
  calculateTotalQuantity() {
    if (this.data && this.data.productList) {
      let total = this.data.productList.reduce((a, b) => {
        let isKeg = b.product.item.isKeg;
        const qtd = isKeg ? b.volume.reduce((a, b) => {
          return a + (b.enabled ? b.quantity : 0);
        }, 0) : (b.quantity || 0);
        return a + (qtd);
      }, 0);
      return total;
    }
  }

  prevent(event) {

    event.stopPropagation();
    event.preventDefault();
  }


  onError(error, operationName) {
    this.loading = false;
    let errorMessage = error.data && error.data.Message ? error.data.message : `Ocorreu um erro ao ${operationName} os dados. Tente novamente.`;
    this.toast.show(
      this.toast.simple()
        .textContent(errorMessage)
        .position('bottom right')
        .hideDelay(3000)
    );
    console.log(error);
  }

  onSuccess(data) {
    this.loading = false;
    this.toast.show(
      this.toast.simple()
        .textContent('Dados salvo com sucesso!')
        .position('bottom right')
        .hideDelay(3000)
    );
    //redirect to edition page of client
    this.state.go('invoice-edit', { id: data._id });
  }

  onClickCancelButton() {
    //redirect to feature
    this.state.go('invoice-list');
  }

  addItemQuantity(item) {
    item.quantity++;
  }

  removeItemQuantity(item) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }

}