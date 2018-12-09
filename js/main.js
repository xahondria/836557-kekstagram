'use strict';

/*
 * Основной код программы
 */

(function () {
  var picturesData = new window.PicturesData();

  picturesData.getProperties().then(function () {
    window.utils.createDomElements(picturesData.properties, window.PostRenderer.addPicture, window.PostRenderer.container);

    window.BigPictureRenderer.bindEvents();

    var pictureUploader = new window.PictureUploader();

    pictureUploader.bindEvents();
  }).catch(function (error) {
    console.log(error);
  });

})();
