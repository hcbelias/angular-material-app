export default class EditProductController {
  ngInject;

  /*@ngInject*/
  constructor($state, $stateParams, Product, $mdToast, Item, Provider) {
    this.state = $state;
    this.stateParams = $stateParams;
    this.Product = Product;
    this.Item = Item;
    this.Provider = Provider;
    this.toast = $mdToast;
  }

  $onInit() {
    this.isEdition = this.stateParams.id && this.stateParams.id !== "new";
    this.title = this.isEdition ? "Editar Produto" : "Novo Produto";
    if (this.isEdition) {
      this.Product.getProduct(
        { id: this.stateParams.id },
        data => this.loadData(data),
        error => this.onError(error, "buscar")
      );
    } else {
      this.data = {
        active: "true"
      };
      this.loadItems(true);
      this.loadProviders();
    }
  }

  loadProviders() {
    return this.Provider.getProviders(
      {},
      data => this.loadProvidersData(data),
      error => this.onError(error, "buscar")
    ).$promise;
  }

  loadProvidersData(data) {
    this.providerList = data;
  }

  loadItems(setFirstData) {
    return this.Item.getItems(
      {},
      data => this.loadItemsData(data, setFirstData),
      error => this.onError(error, "buscar")
    ).$promise;
  }

  isKeg(item) {
    return item && item.name ? item.name.toLowerCase() === "chopp" : false;
  }

  loadItemsData(data, setFirstData) {
    this.itemList = data;

    if (setFirstData) {
      let dataChopp = this.itemList.filter(data => {
        return data.name.toLowerCase() === "chopp";
      });

      this.data.item = { _id: dataChopp[0]._id };
    }
  }

  openUploadWindow() {
    this.inputFileElement.click();
  }

  loadData(data) {
    this.data = data;
    if (typeof this.data.active !== "undefined") {
      this.data.active = this.data.active.toString();
    }
  }

  onClickSaveButton(form, redirectNew) {
    if (!form.$submitted) {
      form.$setSubmitted();
    }
    if (form.$invalid) {
      return;
    }

    if (this.isEdition) {
      this.Product.editProduct(
        this.data,
        data => this.onSuccess(data),
        payload => this.onError(payload, "salvar")
      );
    } else {
      this.Product.createProduct(
        this.data,
        data => this.onSuccess(data, redirectNew),
        payload => this.onError(payload, "salvar")
      );
    }
  }

  onError(error, operationName) {
    let errorMessage =
      error.data && error.data.message
        ? error.data.message
        : `Ocorreu um erro ao ${operationName} os dados. Tente novamente.`;
    this.toast.show(
      this.toast
        .simple()
        .textContent(errorMessage)
        .position("bottom right")
        .hideDelay(3000)
    );
    console.log(error);
  }

  onSuccess(data, redirectNew) {
    this.toast.show(
      this.toast
        .simple()
        .textContent("Dados salvo com sucesso!")
        .position("bottom right")
        .hideDelay(3000)
    );
    if (redirectNew) {
      this.state.go("product-create");
    } else {
      this.state.go("product-list");
    }
  }

  onClickGenerateButton() {
    if (this.isEdition) {
      var url = this.state.href('product-view', {id: this.stateParams.id });
      window.open(url,'_blank');
    }
  }

  onClickCancelButton() {
    //redirect to feature
    this.state.go("product-list");
  }
}
