import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import { SaleTotalComponent } from '../../components/sale-total/sale-total.component';
import { CashierTotalComponent } from '../../components/cashier-total/cashier-total.component';

const COOKIE_NAME = 'selected_store';
export class MainController {
  kegList = [];
  lockedCashier = false;
  productSelectedList = [];
  growlerList = [];
  kegList = [];

  /*@ngInject*/
  constructor(
    $http,
    $cookies,
    $mdDialog,
    Store,
    Auth,
    $mdToast,
    $state,
    CashierCalculator
  ) {
    this.$http = $http;
    this.cookies = $cookies;
    this.dialog = $mdDialog;
    this.Store = Store;
    this.Auth = Auth;
    this.toast = $mdToast;
    this.state = $state;
    this.calculator = CashierCalculator;
  }

  $onInit() {
    this.loading = true;
    this.Auth.getCurrentUser().then(data => {
      this.user = data;
      if (!this.initialized) {
        this.alertSelectedStore();
      } else {
        this.getCashierData();
      }
    });
    this.loadStoreCookieData();
    this.needGrowler = false;
  }

  getActiveKegList() {
    const kegConst = {
      empty: true
    };
    this.kegList = [
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst,
      kegConst
    ];
    this.Store.getActiveKegs(
      { id: this.storeId },
      data => {
        data.forEach((element, i) => {
          this.kegList[element.kegOrder] = element;
        });
      },
      err => {
        console.log(err);
        this.toast.show(
          this.toast
            .simple()
            .textContent(
              'Um erro ocorreu ao obter a lista de barris da loja. Tente atualizar a página ou entre em contato com o administrador.'
            )
            .position('bottom right')
            .hideDelay(3000)
        );
        this.initialized = false;
      }
    );
  }

  getTotalSale() {
    return this.calculator
      .getTotalSale(this.kegList, this.growlerList, this.productSelectedList)
      .toFixed(2);
  }

  showOpenCashierConfirmation() {
    var confirm = this.dialog
      .confirm()
      .title(`Abertura de Caixa`)
      .textContent(`Deseja abrir o caixa?`)
      .ariaLabel('Abertura de Caixa')
      .ok('Confirmar')
      .cancel('Cancelar');

    this.dialog.show(confirm).then(() => {
      this.loading = true;
      this.Store.openCashier(
        { id: this.storeId },
        { moneyBalance: this.moneyBalance || 0 },
        data => {
          this.validateData(data);
          this.loading = false;
        },
        err => {
          console.log(err);
          this.toast.show(
            this.toast
              .simple()
              .textContent(err.data.message)
              .position('bottom right')
              .hideDelay(9000)
          );
          this.loading = false;
        }
      );
    });
  }

  openCashier() {
    this.showOpenCashierConfirmation();
  }

  loadStoreCookieData() {
    this.storeId = this.cookies.get(COOKIE_NAME);
    this.initialized = !!this.storeId;
  }

  alertSelectedStore() {
    var confirm = this.dialog
      .alert()
      .title(`Seleção de Loja`)
      .textContent(
        `É necessário escolher uma loja antes de iniciar as operações de caixa. Por favor, entre em contato com o administrador.`
      )
      .ariaLabel('Seleção de Loja')
      .ok('Confirmar');

    this.loading = false;
    this.dialog.show(confirm);
  }

  alertEmptyCashier() {
    var confirm = this.dialog
      .alert()
      .title(`Caixa Vazio`)
      .textContent(`É necessário adicionar algum produto ao caixa.`)
      .ariaLabel('Caixa Vazio')
      .ok('Ok');

    this.dialog.show(confirm);
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


  closeOtherUseCashierConfirmationAlert() {
    var confirm = this.dialog
      .confirm()
      .title(`Fechar Caixa de Outro Usuário`)
      .textContent(
        `Não é possível desfazer esta operação. Deseja realmente cancelar o caixa de ${
          this.cashier.userEmailOpened
        }?`
      )
      .ariaLabel('Fechar Caixa de Outro Usuário')
      .ok('Confirmar')
      .cancel('Cancelar');

    return this.dialog.show(confirm);
  }

  showOpenCashierByOtherUserAlert() {
    var confirm = this.dialog
      .confirm()
      .title(`Caixa Aberto por outro Funcionário`)
      .textContent(
        `Há um caixa aberto por "${
          this.cashier.userEmailOpened
        }". Esta operação não pode ser desfeita, deseja fechar o caixa?`
      )
      .ariaLabel('Caixa Aberto por outro Funcionário')
      .ok('Confirmar')
      .cancel('Cancelar');

    this.dialog.show(confirm).then(
      () => {
        let promiseDialog = this.closeOtherUseCashierConfirmationAlert();
        promiseDialog.then(
          () => {
            this.Store.closeCashier(
              { id: this.storeId },
              data => {
                this.state.reload();
              },
              error => { this.onError(error, 'fechar'); }
            );
          },
          () => {
            this.lockedCashier = true;
            this.isCashierOpen = false;
          }
        ).catch(err=>{
          this.onError(error, 'confirmar'); 
        });
      },
      () => {
        this.lockedCashier = true;
        this.isCashierOpen = false;
      }
    );
  }

  getCashierData() {
    this.Store.getCashier({ id: this.storeId }, data => {
      this.validateData(data);
      if (
        !!this.cashier.userOpened &&
        this.user._id !== this.cashier.userOpened
      ) {
        this.showOpenCashierByOtherUserAlert();
      } else {
        this.getActiveKegList();
      }
      this.loading = false;
    });
  }
  getTotalPayment() {
    return this.calculator.getTotalPayment(this.cashier.sales);
  }
  getMoneyPayment() {
    return this.calculator.getMoneyPayment(this.cashier.sales);
  }
  getCardPayment() {
    return this.calculator.getCardPayment(this.cashier.sales);
  }

  getCardAndMoneySales() {
    return this.calculator.getCardAndMoneySales(this.cashier.sales);
  }

  getMoneySales() {
    return this.cashier.sales.filter(item => item.paymentMoney === item.total)
      .length;
  }
  getCurrentMoneyBalance() {
    return this.calculator.getCurrentMoneyBalance(
      this.cashier.moneyBalance,
      this.cashier.sales
    );
  }

  openCashierInfoModal() {
    this.dialog.show({
      controller: CashierTotalComponent,
      template: require('../../components/cashier-total/cashier-total.pug'),
      locals: {
        data: {
          cashier: this.cashier,
          moneyBalance: this.moneyBalance,
          loading: this.loading
        },
        successCallback: this.finalizeCashier.bind(this),
        dialog: this.dialog
      },
      controllerAs: 'ctrl'
    });
  }

  finalizeCashier(balanceCard, balanceMoney, justifyMoney, justifyCard) {
    let confirmDialog = this.dialog
      .confirm()
      .title(`Finalizar Caixa`)
      .textContent(
        `Não é possível desfazer esta operação. Deseja realmente finalizar o caixa?`
      )
      .ariaLabel('Finalizar Caixa')
      .ok('Confirmar')
      .cancel('Cancelar');

    this.dialog.show(confirmDialog).then(
      () => {
        this.loading = true
        let parameterRequest = {
          id: this.storeId,
          actionid: this.cashier.id,
          justifyMoney,
          justifyCard,
          balanceCard,
          balanceMoney
        };
        this.Store.closeCashier(parameterRequest,
          data => {
            this.validateData(data);
            this.loading = false;
          },
          err => {
            let errorMsg =
              err.status === 401
                ? 'Por favor, realize o login novamente.'
                : 'Ocorreu um erro ao finalizar o caixa, por favor entre em contato com o administrador. Err: ' + err.data.message;
            this.errorMsg = err.data.message;
            this.errorParam = parameterRequest;
            
            this.loading = false;
            console.log(this.errorMsg);
          }
        );
      },
      () => {
        this.dialog.cancel();
      }
    );
  }

  validateData(data) {
    this.isCashierOpen = data.createdAt && !data.closeDate;
    if (this.isCashierOpen) {
      this.cashier = data.toJSON();
    } else {
      this.cashier = {};
    }
  }

  finalizeSale() {
    const growlerList = this.growlerList.filter(
      item => item.qtd && item.qtd > 0
    );
    const productList = this.productSelectedList.filter(
      item => item.qtd && item.qtd > 0
    );
    const kegList = this.kegList.filter(
      item =>
        (item.qtdPint && item.qtdPint > 0) ||
        (item.qtdLiter && item.qtdLiter > 0)
    );

    if (!growlerList.length && !productList.length && !kegList.length) {
      this.alertEmptyCashier();
      return;
    }
    this.dialog
      .show({
        controller: SaleTotalComponent,
        template: require('../../components/sale-total/sale-total.pug'),
        locals: {
          data: {
            growlerList,
            productList,
            kegList,
            cashier: this.cashier
          },
          loadingFunc: bool => (this.loading = bool),
          successCallback: () => {
            this.state.reload();
          }
        },
        controllerAs: 'ctrl'
      })
      .then(
        () => {},
        () => {
          this.loading = false;
        }
      );
  }

  checkIfGrowlerIsNeeded() {
    const bool = this.kegList.some(item => item.growler);
    return bool;
  }

  cancelSale() {
    var confirm = this.dialog
      .confirm()
      .title(`Limpar Tela`)
      .textContent(
        `Não é possível desfazer esta operação. Deseja realmente cancelar limpar a tela?`
      )
      .ariaLabel('Cancelar Venda')
      .ok('Confirmar')
      .cancel('Cancelar');

    this.dialog.show(confirm).then(
      () => {
        this.state.reload();
      },
      () => {
        this.dialog.cancel();
      }
    );
  }
}

export default angular
  .module('webApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  }).name;
