'use strict';

export default class PasswordController {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  submitted = false;



  /*@ngInject*/
  constructor(Auth, $state, $stateParams) {
    this.Auth = Auth;
    this.state = $state;
    this.stateParams= $stateParams;
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
          this.state.go('user-edit', { id: this.stateParams.id });
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Senha incorreta';
          this.message = '';
          this.submitted = false;
        });
    }
  }

  onClickCancelButton(){
    this.state.go('main');
  }
}
