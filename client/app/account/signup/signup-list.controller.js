export default class SignupListController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, User, $mdToast) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Service = User;
    this.toast = $mdToast;
  }

  $onInit() {
    this.label = 'Buscar Funcionários';
    this.Service.getUsers({}, (data) => this.loadData(data, true), (error) => this.onError(error, 'buscar'));
  }

  search(text) {
    if (text) {
      this.Service.getUsers({ q: text }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
    } else {
      this.data = this.dataCache;
    }
  }

  loadData(data, firstLoad) {
    this.data = data;
    if (firstLoad) {
      this.dataCache = data;
    }
  }

  openInfo(id) {
    this.state.go('user-edit', { id });
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
