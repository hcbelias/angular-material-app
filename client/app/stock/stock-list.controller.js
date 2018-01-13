
export default class ListStockController {

  'ngInject';

  /*@ngInject*/
  constructor(Store, $stateParams, $mdToast, Auth, $state, $location) {
    this.Store = Store;
    this.stateParams = $stateParams;
    this.toast = $mdToast;
    this.Auth = Auth;
    this.state = $state;
    this.location = $location;
  }

  $onInit() {
    this.Auth.isAdmin()
      .then((admin) => this.isAdmin = admin);
    this.statusFilter = 'all';
    this.Store.getStores({}, (data) => this.storeList = data.sort((a, b) => a.order - b.order), (error) => this.onError(error, 'buscar'));
    let querystring = this.location.search();
    if(querystring && querystring.s){
      this.storeId = querystring.s;
      this.Store.getStock({ id: this.storeId }, (data) => {
        this.loadData(data, true);
        this.filterByStatus(this.statusFilter);      
      }, (error) => this.onError(error, 'buscar'));
    }
  }

  updateStock() {
    this.Store.getStock({ id: this.storeId }, (data) => {
      this.loadData(data, true);
      this.filterByStatus(this.statusFilter);      
    }, (error) => this.onError(error, 'buscar'));

  }

  filterByStatus(filter) {
    switch (filter) {
      case 'all': this.data = this.dataCache;
        break;
      case 'active': this.data = this.dataCache.filter((item) => item.active && item.active === "true");
        break;
      case 'inactive': this.data = this.dataCache.filter((item) => !item.active || item.active === "false");
        break;
    }
    this.updateIndividualArrays(this.data);
  }

  updateIndividualArrays(data){
    this.kegList = this.data.filter((item)=>item.isKeg);
    this.productList = this.data.filter((item)=>!item.isKeg);
  }

  loadData(data, cache){
    this.data = data;
    this.data.forEach((item)=>{
      if (typeof item.active !== 'undefined') {
        item.active = item.active.toString();
      }
    });
    if(cache){
      this.dataCache = data;
    }
    this.updateIndividualArrays(data);
  }

  search(filter) {
    this.filterByStatus(this.data, filter);
  }

  openInfo(id) {
    this.Auth.isAdmin()
      .then((admin) => {
        let nextState = admin ? 'invoice-edit' : 'stock-list';
        this.state.go(nextState, { id });
      });

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
