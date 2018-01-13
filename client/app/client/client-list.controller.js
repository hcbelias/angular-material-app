export default class ListClientController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Client, $mdToast) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Client = Client;
    this.toast = $mdToast;
  }

  $onInit() {
    this.label = 'Buscar Clientes';
    this.Client.getClients({}, (data) => this.loadData(data, true), (error) => this.onError(error, 'buscar'));
  }

  search(text) {
    if (text) {
      this.Client.getClients({ q: text }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
    } else {
      this.loadData(this.dataCache);
    }
  }

  loadData(data, firstLoad) {
    this.data = data;
    if (firstLoad) {
      this.dataCache = data;
    }
  }

  openInfo(id) {
    this.state.go('client-edit', { id });
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
