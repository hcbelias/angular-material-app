export default class EditProviderController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Provider, $mdToast) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Service = Provider;
    this.toast = $mdToast;
  }

  $onInit() {
    this.isEdition = this.stateParams.id && this.stateParams.id !== 'new';
    this.title = this.isEdition ? 'Editar Fornecedor' : 'Novo Fornecedor';

    if (this.isEdition) {
      this.Service.getProvider({ id: this.stateParams.id }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
      this.Service.getProviderProducts({ id: this.stateParams.id }, (data) => this.productList = data, (error) => this.onError(error, 'buscar'));
      this.Service.getProviderInvoices({ id: this.stateParams.id }, (data) => this.invoiceList = data, (error) => this.onError(error, 'buscar'));
    } else
      this.data = {
        active: 'true'
      };
  }


  loadData(data) {
    this.data = data;
    if (typeof this.data.active !== 'undefined') {
      this.data.active = this.data.active.toString();
    }
  }

  onClickSaveButton(form) {
    if (form.$invalid) {
      return;
    }
    if (this.isEdition) {
      this.Service.editProvider(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'))
    } else {
      this.Service.createProvider(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'))
    }
  }

  openInvoice(id) {
    if (id === 'new') {
      this.state.go('invoice-create', { id });
    } else {
      this.state.go('invoice-edit', { id });
    }
  }

  openProduct(id) {
    if (id === 'new') {
      this.state.go('product-create', { id });
    } else {
      this.state.go('product-edit', { id });
    }
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

  onSuccess(data) {
    this.toast.show(
      this.toast.simple()
        .textContent('Dados salvo com sucesso!')
        .position('bottom right')
        .hideDelay(3000)
    );
    //redirect to edition page of client
    this.state.go('provider-edit', { id: data._id });
  }

  onClickCancelButton() {
    //redirect to feature
    this.state.go('provider-list');
  }
}
