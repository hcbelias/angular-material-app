"use strict";
/* eslint no-sync: 0 */

import angular from "angular";

export class KegDetailCardComponent {
  constructor() {
    "ngInject";

  }
}

export default angular
  .module("directives.kegDetailCard", [])
  .component("kegDetailCard", {
    template: require("./keg-detail-card.pug"),
    controller: KegDetailCardComponent,
    bindings: {
      keg: "=",
      position: "<",
      small: "<"
    }
  }).name;
