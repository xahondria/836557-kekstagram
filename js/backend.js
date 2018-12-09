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

    postDataFetsh: function (URL, formData) {
      return fetch(URL, {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(function (response) {
        return response.json();
      });
    }
  };


  var URL = 'https://js.dump.academy/kekstagram';

  window.backend.postDataXHR = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccess(xhr.response);
    });

    xhr.open('post', URL);
    xhr.send(data);
  };

})();
