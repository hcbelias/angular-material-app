export default class EditClientController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Client, $mdToast) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Client = Client;
    this.toast = $mdToast;
  }

  $onInit() {
    this.isEdition = this.stateParams.id && this.stateParams.id !== 'new';
    this.title = this.isEdition ? 'Editar Cliente' : 'Novo Cliente';
    if (this.isEdition) {
      this.Client.getClient({ id: this.stateParams.id }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar', ));
    } else {
      this.data = {
        active: 'true'
      };
    }
  }

  loadData(data) {
    this.data = data;
    if (typeof this.data.active !== 'undefined' ) {
      this.data.active = this.data.active.toString();
    }
  }

  onClickSaveButton(form) {
    if (form.$invalid) {
      return;
    }
    if (this.isEdition) {
      this.Client.editClient(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'));
    } else {
      this.Client.createClient(this.data, (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'));
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
    this.state.go('client-edit', { id: data._id });
  }

  onClickCancelButton() {
    //redirect to feature
    this.state.go('client-list');
  }
}
