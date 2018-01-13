'use strict';

import angular from 'angular';

export default class SignupController {

  errors = {};
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, User, $stateParams, $mdToast) {
    this.Auth = Auth;
    this.state = $state;
    this.Service = User;
    this.stateParams = $stateParams;
    this.toast = $mdToast;
  }

  $onInit() {
    this.isEdition = this.stateParams.id && this.stateParams.id !== 'new';
    this.title = this.isEdition ? 'Editar Funcionário' : 'Novo Funcionário';
    this.Auth.getCurrentUser((user) => this.currentUserEmail = user.email);

    if (this.isEdition) {
      this.Service.getUser({ id: this.stateParams.id }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
    } else
      this.user = {
        name: '',
        email: '',
        password: '',
        active: "true",
        role: 'user'
      };
  }

  loadData(data) {
    this.user = data;
    this.canChangePassword = this.isEdition && this.currentUserEmail === this.user.email;
    if (typeof this.user.active !== 'undefined') {
      this.user.active = this.user.active.toString();
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
    this.state.go('user-edit', { id: data._id });
  }

  onClickCancelButton(){
    this.state.go('main');
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      if (this.isEdition) {
        this.Service.editUser(this.user,  (data) => this.onSuccess(data), (payload) => this.onError(payload, 'salvar'));
      } else {
        return this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          role: this.user.role,
          active: this.user.active
        })
          .then((payload) => {
            this.toast.show(
              this.toast.simple()
                .textContent('Dados salvo com sucesso!')
                .position('bottom right')
                .hideDelay(3000)
            );
            this.state.go('main');
          })
          .catch(err => {
            err = err.data;
            this.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, (error, field) => {
              form[field].$setValidity('mongoose', false);
              this.errors[field] = error.message;
            });
            form.$valid = true;
          });
      }
    }
  }
}
