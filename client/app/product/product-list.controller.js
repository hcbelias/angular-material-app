export default class ListProductController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Product, $mdToast) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Product = Product;
    this.toast = $mdToast;
  }

  $onInit() {
    this.label = 'Buscar Produtos';
    this.filter = 'active';
    this.Product.getProducts({}, (data) => this.loadData(data, true), (error) => this.onError(error, 'buscar'));
  }

  search(text, filter) {
    let data = [];
    switch (filter) {
      case 'all': data = this.dataCache;
        break;
      case 'active': data = this.dataCache.filter((item) => item.active);
        break;
      case 'inactive': data = this.dataCache.filter((item) => !item.active);
        break;
    }
    data = data.filter(function (product) {
      return (product.name.search(new RegExp(text, 'i')) !== -1);
    });

    this.loadData(data);

  }

  loadData(data, firstLoad) {
    this.data = data;
    if (firstLoad) {
      this.dataCache = data;
    }
  }

  openInfo(id) {
    this.state.go('product-edit', { id });
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
}
