'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

const COOKIE_NAME = 'selected_store';

export class NavbarComponent {

  constructor(Auth, $mdSidenav, Store, $mdDialog, $cookies, $state) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUser;
    this.sidenav = $mdSidenav;
    this.Store = Store;
    this.dialog = $mdDialog;
    this.cookies = $cookies;
    this.state = $state;
  }


  $onInit() {
    this.isUserAdmin = this.isAdmin();
    this.getCurrentUser().then((data) => this.user = data);
    this.Store.getStores({}, (data) => {
      this.storeList = data.sort((a, b) => a.order - b.order);
      this.loadStoreCookieData();
    }, (error) => this.onError(error, 'buscar'));
  }

  openSidenav() {
    this.sidenav('left').toggle();
  }

  closeSidenav() {
    this.sidenav('left').close();
  }
  loadStoreCookieData() {
    let storeData = this.cookies.get(COOKIE_NAME);
    this.store = this.storeList.find((item) => item._id === storeData);
  }

  saveStoreCookieData() {
    this.cookies.put(COOKIE_NAME, this.store._id, { expires: 'Thu, 01 Jan 2100 00:00:00 GMT'});
  }

  alertStoreChange() {
    var confirm = this.dialog.confirm()
      .title(`Alteração de Loja`)
      .textContent(`Esta operação não pode ser desfeita. Deseja alterar a loja para ${this.store.name}?`)
      .ariaLabel('Alteração de Loja')
      .ok('Confirmar')
      .cancel('Cancelar');
    this.dialog.show(confirm).then(() => {
      this.saveStoreCookieData();
      this.state.reload();
    }, () => { this.loadStoreCookieData(); });
  }

  getTitle(){
    return this.state.current.title;
  }

  hasNavbar(){
    return this.state.current.nav;
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent,
    controllerAs: 'navbarCtrl'
  })
  .name;
