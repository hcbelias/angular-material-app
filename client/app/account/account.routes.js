"use strict";

export default function routes($stateProvider) {
  "ngInject";

  $stateProvider
    .state("login", {
      url: "/login",
      template: require("./login/login.pug"),
      controller: "LoginController",
      controllerAs: "vm",
      nav: true
    })
    .state("logout", {
      url: "/logout",
      referrer: "main",
      template: "",
      controller($state, Auth, $location) {
        "ngInject";
        Auth.logout();
        $location.path("/login");
      },
      nav: false
    })
    .state("user-list", {
      url: "/users",
      template: require("./signup/signup-list.pug"),
      controller: "SignupListController",
      controllerAs: "vm",
      nav: true
    })

    .state("user-edit", {
      url: "/users/:id",
      template: require("./signup/signup.pug"),
      controller: "SignupController",
      controllerAs: "vm",
      nav: true
    })
    .state("user-create", {
      url: "/users/new",
      template: require("./signup/signup.pug"),
      controller: "SignupController",
      controllerAs: "vm",
      nav: true
    })
    .state("change-password", {
      url: "/users/:id/password",
      template: require("./password/password.pug"),
      controller: "PasswordController",
      controllerAs: "vm",
      nav: true
    });
}
