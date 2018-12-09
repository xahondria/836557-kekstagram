'use strict';

(function () {

  var URLS = {
    GET_DATA: 'https://js.dump.academy/kekstagram/data',
  };

  window.backend = {
    getData: function () {
      return fetch(URLS.GET_DATA, {
        method: 'get',
      }).then(function (response) {
        return response.json();
      });
    },

    postData: function (URL, formData) {
      return fetch(URL, {
        method: 'post',
        body: formData,
      }).then(function (response) {
        return response.json();
      });
    },
  };

})();
