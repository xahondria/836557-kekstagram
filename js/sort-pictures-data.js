'use strict';

(function () {
  var SortPicturesData = function (data) {
    // elements
    this.filters = document.querySelector('.img-filters');
    this.filterButtons = this.filters.querySelectorAll('.img-filters__button');

    // action
    this.filters.classList.remove('img-filters--inactive');

    this.sortByLikes(data);
  };

  SortPicturesData.prototype.bindEvents = function () {
    this.changeFilter(this.filterButtons, 'img-filters__button--active');
  };

  // смена активной кнопки
  SortPicturesData.prototype.changeFilter = function (elementList, className) {
    elementList.forEach(function (button) {
      button.addEventListener('click', function () {
        elementList.forEach(function (element) {
          element.classList.remove(className);
        });
        button.classList.add(className);
      });
    });
  };

  // создаем массив, отсортированный по новым правилам
  SortPicturesData.prototype.sortByLikes = function (data) {
    console.log(data);
    console.log('data.likes = ' + data[0].likes);
    this.sortedByLikes = data.slice().sort(function (left, right) {
      if (left.likes < right.likes) {
        return 1;
      }

      if (left.likes > right.likes) {
        return -1;
      }

      return 0;

    });
    console.log(this.sortedByLikes);
  };


  window.SortPicturesData = SortPicturesData;

})();
