"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

const COOKIE_NAME = "selected_store";

export class NavbarComponent {
  constructor(Auth, $mdSidenav, Store, $mdDialog, $cookies, $state) {
    "ngInject";
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUser;
    this.sidenav = $mdSidenav;
    this.dialog = $mdDialog;
    this.state = $state;
  }

  $onInit() {
    this.isUserAdmin = this.isAdmin();
    this.getCurrentUser().then(data => (this.user = data));
  }
  openSidenav() {
    this.sidenav("left").toggle();
  }

  closeSidenav() {
    this.sidenav("left").close();
  }

  hasNavbar() {
    return this.state.current.nav;
  }
}

export default angular.module("directives.navbar", []).component("navbar", {
  template: require("./navbar.pug"),
  controller: NavbarComponent,
  controllerAs: "navbarCtrl"
}).name;
