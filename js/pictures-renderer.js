'use strict';

(function () {
  var PicturesRenderer = function (data) {
    // elements
    this.filters = document.querySelector('.img-filters');
    this.filterButtons = this.filters.querySelectorAll('.img-filters__button');

    // action
    this.filters.classList.remove('img-filters--inactive');

    this.filterIdListMap = {
      'filter-popular': this.sortByLikes.bind(this, data),
      'filter-new': this.getRandomElements.bind(this, data),
      'filter-discussed': this.sortByPopularity.bind(this, data),
    };

    this.sortedData = [];

    this.timeout = null;

  };

  PicturesRenderer.prototype.bindEvents = function () {
    this.bindFilterEvents(this.filterButtons, 'img-filters__button--active');
  };

  // смена активной кнопки
  PicturesRenderer.prototype.bindFilterEvents = function (elementList, className) {
    var $this = this;
    elementList.forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.classList.contains(className)) {
          return;
        }
        elementList.forEach(function (element) {
          element.classList.remove(className);
        });
        button.classList.add(className);
        $this.filterIdListMap[button.id]();

        $this.renderData($this.sortedData);
      });
    });
  };

  PicturesRenderer.prototype.changeFilter = function (id) {
    this.filterButtons.forEach(function (button) {
      if (button.id !== id) {
        return;
      }

      button.click();
    });
  };

  // создаем массив, отсортированный по лайкам
  PicturesRenderer.prototype.sortByLikes = function (data) {
    this.sortedData = data.slice().sort(function (left, right) {
      if (left.likes < right.likes) {
        return 1;
      }
      if (left.likes > right.likes) {
        return -1;
      }
      return 0;

    });
  };

  // создаем массив "Новые — 10 случайных, не повторяющихся фотографий"
  PicturesRenderer.prototype.getRandomElements = function (data) {
    this.sortedData = window.utils.getRandomPictures(data, 10);
  };

  // создаем массив, отсортированный по количеству комментариев
  PicturesRenderer.prototype.sortByPopularity = function (data) {
    this.sortedData = data.slice().sort(function (left, right) {
      if (left.comments.length < right.comments.length) {
        return 1;
      }
      if (left.comments.length > right.comments.length) {
        return -1;
      }
      if (left.likes < right.likes) {
        return 1;
      }
      if (left.likes > right.likes) {
        return -1;
      }
      return 0;

    });
  };

  PicturesRenderer.prototype.renderData = function (dataArray) {
    PicturesRenderer.container.querySelectorAll('.picture').forEach(function (pic) {
      pic.remove();
    });
    window.utils.createDomElements(dataArray, window.PostRenderer.addPicture, PicturesRenderer.container);
  };

  PicturesRenderer.filters = {
    popular: 'filter-popular',
    new: 'filter-new',
    discussed: 'filter-discussed',
  };

  /* Сюда вставляем готовую разметку с картинками*/
  PicturesRenderer.container = document.querySelector('.pictures');


  window.SortPicturesData = PicturesRenderer;

})();
