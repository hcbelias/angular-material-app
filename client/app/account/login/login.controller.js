'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $location) {
    this.Auth = Auth;
    this.$state = $state;
    this.location = $location;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          this.submitted = false;
          if (err) {
            this.errors.login = err.message;
          }
          else{
            console.log(err);
            this.errors.login = 'Um erro ocorreu, tente novamente';
          }
        });
    }
  }
}
