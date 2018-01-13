export default class ListProviderController {

  'ngInject';

  /*@ngInject*/
  constructor($state, $stateParams, Provider, $mdToast, Util) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Provider = Provider;
    this.toast = $mdToast;
  }

  $onInit() {
    this.label = 'Buscar Fornecedor';
    this.Provider.getProviders({}, (data) => this.loadData(data, true), (error) => this.onError(error, 'buscar'));
  }

  search(text) {
    if (text) {
      this.Provider.getProviders({ q: text }, (data) => this.loadData(data), (error) => this.onError(error, 'buscar'));
    } else {
      this.loadData(this.dataCache);
    }
  }


  loadData(data, firstLoad) {
    if (firstLoad) {
      this.dataCache = data;
      let dictionary = {};
      this.dataCache.forEach((item) => {
        if (item.shortName) {
          const firstLetter = item.shortName[0].toLowerCase();
          if (!dictionary[firstLetter]) {
            dictionary[firstLetter] = [];
          }
          dictionary[firstLetter].push(item);
        }
      });
      this.dictionaryAlpha = dictionary;
    }
    this.data = data;
  }

  loadDictionaryData(letter) {
    this.data = this.dictionaryAlpha[letter.toLowerCase()];
  }

  openInfo(id) {
    this.state.go('provider-edit', { id });
  }

  onError(error, operationName) {
    debugger;
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
