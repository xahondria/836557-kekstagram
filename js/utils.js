'use strict';

(function () {

  window.utils = {};

  /*
   *
   * Returns a number whose value is limited to the given range.
   *
   * Example: limit the output of this computation to between 0 and 255
   * (x * 255).clamp(0, 255)
   *
   * @param {Number} min The lower boundary of the output range
   * @param {Number} max The upper boundary of the output range
   * @returns A number in the range [min, max]
   * @type Number
   */
  var clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  Object.defineProperty(window.utils, 'clamp', {
    value: clamp,
    enumerable: true,
  });

  /* функция возвращает значение от 0 до 1 при перетаскивании пина мышью*/
  var moveSliderPin = function (sliderElement, sliderPin, cb) {
    sliderPin.addEventListener('mousedown', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var sliderWidth = sliderElement.getBoundingClientRect().width;
      var sliderCoordX = sliderElement.getBoundingClientRect().left;

      var onMouseMove = function (moveEv) {
        moveEv.preventDefault();
        var newCoordX = moveEv.clientX;

        var sliderValue = (newCoordX - sliderCoordX) / sliderWidth;

        cb(clamp(sliderValue, 0, 1));

      };

      var onMouseUp = function (upEv) {
        upEv.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

    });

  };

  Object.defineProperty(window.utils, 'moveSliderPin', {
    value: moveSliderPin,
    enumerable: true,
  });


  /* Функция выбирает случайный элемент из массива*/
  var getRandomElement = function (array) {

    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  Object.defineProperty(window.utils, 'getRandomElement', {
    value: getRandomElement,
    enumerable: true,
  });


  /* Функция выбирает заданное количество случайных элементов из массива и формирует из них новый массив*/
  var getRandomElements = function (inputArrayOfElements, maxNumberOfElements) {
    inputArrayOfElements = inputArrayOfElements.slice();

    if (inputArrayOfElements.length < maxNumberOfElements) {
      maxNumberOfElements = inputArrayOfElements.length;
    }

    var randomElements = [];

    while (randomElements.length < maxNumberOfElements) {
      var randomIndex = Math.floor(Math.random() * inputArrayOfElements.length);
      randomElements.push(inputArrayOfElements[randomIndex]);
      inputArrayOfElements.splice(randomIndex, 1);
    }
    return randomElements;
  };

  Object.defineProperty(window.utils, 'getRandomElements', {
    value: getRandomElements,
    enumerable: true,
  });

  /* Функция создает фрагмент разметки и вставляет его в заданное место*/
  var createDomElements = function (dataArray, elementGenerator, positionInDom) {
    var fragment = document.createDocumentFragment();

    dataArray.forEach(function (data) {
      fragment.appendChild(elementGenerator(data));
    });

    positionInDom.appendChild(fragment);
  };

  Object.defineProperty(window.utils, 'createDomElements', {
    value: createDomElements,
    enumerable: true,
  });

  /* отправляем форму*/
  window.utils.makeFormAjax = function (form) {
    var URL = form.action;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var formData = new FormData(form);

      window.backend.postData(URL, formData)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          // TODO : обработать ошибку
        });

    });
  };

})();
