'use strict';

(function () {

  /* Класс описывает массив исходных данных для вставки в DOM */
  var PicturesData = function () {
    this.properties = [];

    this.isLoaded = false;
  };

  PicturesData.prototype.getProperties = function () {
    var $this = this;

    if (this.isLoaded) {
      return window.Promise.resolve(this.properties);
    }

    return window.backend.getData().then(function (data) {
      $this.properties = data;
      $this.isLoaded = true;
      return $this.properties;
    });
  };

  window.PicturesData = PicturesData;

})();
