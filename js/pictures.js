'use strict';

/* Функция выбирает случайный элемент из массива*/
var getRandomElement = function (array) {

  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};


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

/* Функция создает фрагмент разметки и вставляет его в заданное место*/
var createDomElements = function (dataArray, elementGenerator, positionInDom) {
  var fragment = document.createDocumentFragment();

  dataArray.forEach(function (data) {
    fragment.appendChild(elementGenerator(data));
  });

  positionInDom.appendChild(fragment);
};

/* Класс описывает массив исходных данных для вставки в DOM */
var PicturesData = function () {
  this.properties = [];

  for (var i = 0; i < this.numberOfPictures; i++) {
    this.properties.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.floor(this.likesMinNumber + Math.random() * (this.likesMaxNumber - this.likesMinNumber)),
      comments: getRandomElements(this.inputComments, Math.random() * (this.numberOfComments)),
      description: getRandomElement(this.inputdescriptions)
    });
  }
};

PicturesData.prototype.inputComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

PicturesData.prototype.inputdescriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

PicturesData.prototype.numberOfPictures = 25;
PicturesData.prototype.likesMinNumber = 15;
PicturesData.prototype.likesMaxNumber = 200;
PicturesData.prototype.numberOfComments = 2;


/* Класс описывает превью картинки на главной странице */
var PostRenderer = function PostRenderer(picture) {
  this.element = PostRenderer.template.cloneNode(true);
  this.picture = picture;

  this.element.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    BigPictureRenderer.show(picture);
  });
};

/* Метод отрисовывает превью картинок */
PostRenderer.prototype.renderPreview = function () {
  this.element.querySelector('.picture__img').src = this.picture.url;
  this.element.querySelector('.picture__likes').textContent = this.picture.likes;
  this.element.querySelector('.picture__comments').textContent = this.picture.comments.length;
};

/* Шаблон разметки картинки*/
PostRenderer.template = document.querySelector('#picture')
  .content
  .querySelector('.picture');

/* Сюда вставляем готовую разметку с картинками*/
PostRenderer.container = document.querySelector('.pictures');

/**
 *
 * @param {Object} pictureData
 * @param {string} pictureData.url
 * @param {string} pictureData.description
 * @param {number} pictureData.likes
 * @param {Object[]} pictureData.comments
 *
 * @return {HTMLElement}
 */
PostRenderer.addPicture = function (pictureData) {

  var postRenderer = new PostRenderer(pictureData);
  postRenderer.renderPreview();

  return postRenderer.element;
};

/* Объект описывает попап с большой картинкой, комментариями, описанием и т.п. */
var BigPictureRenderer = {
  element: document.querySelector('.big-picture'),

  renderPreview: function (pictureData) {
    this.element.querySelector('.big-picture__img img').src = pictureData.url;
    this.element.querySelector('.likes-count').textContent = pictureData.likes;
    this.element.querySelector('.comments-count').textContent = pictureData.comments.length;
    this.element.querySelector('.social__caption').textContent = pictureData.description;

    this.element.querySelector('.social__comment-count').classList.add('visually-hidden');
    this.element.querySelector('.comments-loader').classList.add('visually-hidden');
  },

  renderComments: function (pictureData) {
    var fragment = document.createDocumentFragment();

    var commentContainer = this.element.querySelector('.social__comments');
    var commentTemplate = commentContainer.querySelector('.social__comment');

    /* Удаляем старые комментарии из поста*/
    commentContainer.innerHTML = '';

    /* Создаем новые комментарии*/
    pictureData.comments.forEach(function (comment) {
      var newComment = commentTemplate.cloneNode(true);

      newComment.querySelector('.social__picture').src = 'img/avatar-' + Math.floor(Math.random() * 6 + 1) + '.svg';
      newComment.querySelector('.social__text').textContent = comment;

      fragment.appendChild(newComment);
    });

    commentContainer.appendChild(fragment);

  },

  show: function (pictureData) {
    this.renderPreview(pictureData);
    this.renderComments(pictureData);
    this.element.classList.remove('hidden');
  },

  hide: function () {
    this.element.classList.add('hidden');
  },

  bindEvents: function () {
    var $this = this;
    if (this.__eventsBinded__) {
      return;
    }
    this.__eventsBinded__ = true;

    this.element.querySelector('.big-picture__cancel').addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      $this.hide();
    });

    window.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();

        $this.hide();
      }
    });

  }
};


/* Класс описывает редактор загружаемых изображений*/
var PictureUploader = function PictureUploader() {
  this.element = document.querySelector('.img-upload');

  this.uploadOverlay = this.element.querySelector('.img-upload__overlay');
  this.uploadOverlayHideButton = this.element.querySelector('.img-upload__cancel');
  this.inputFile = this.element.querySelector('#upload-file');

  this.effectLevelPin = this.element.querySelector('.effect-level__pin');
  this.effectLevelLine = this.element.querySelector('.effect-level__line');
  this.effectLevel = this.element.querySelector('.effect-level__value');

  this.effectSwitch = this.element.querySelectorAll('.effects__radio');

  this.picture = this.element.querySelector('.img-upload__preview img');

};

PictureUploader.prototype.show = function () {
  this.uploadOverlay.classList.remove('hidden');
};

PictureUploader.prototype.hide = function () {
  this.uploadOverlay.classList.add('hidden');
  this.inputFile.value = '';
};

/**
 * @param {HTMLInputElement} effect checkbox element
 */
PictureUploader.prototype.setEffect = function (effect) {
  if (!effect.checked) {
    this.picture.className = '';
    return;
  }
  this.picture.className = 'effects__preview--' + effect.value;
};

PictureUploader.prototype.bindEvents = function () {
  if (this.__eventsBinded__) {
    return;
  }
  this.__eventsBinded__ = true;

  this.bindPopupEvents();
  this.bindEffectEvents();
};

PictureUploader.prototype.bindPopupEvents = function () {
  var $this = this;
  // Открываем попап
  this.inputFile.addEventListener('change', function (ev) {
    ev.preventDefault();
    if ($this.inputFile.files.length > 0) {
      $this.loadImage($this.inputFile.files[0], function (err, imgURL) {
        if (err) {
          // TODO: show error
          return;
        }
        $this.picture.src = imgURL;
        $this.show();
      });
    }
  });

  // Закрываем попап
  this.uploadOverlayHideButton.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    $this.hide();
  });

  // Закрываем попап
  window.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      $this.hide();
    }
  });
};

PictureUploader.prototype.bindEffectEvents = function () {
  var $this = this;
  // Записываем значение уровня насыщенности в соответствующий input
  this.effectLevelPin.addEventListener('mouseup', function (ev) {
    ev.preventDefault();

    var maxValue = $this.effectLevelLine.offsetWidth;
    var value = $this.effectLevelPin.offsetLeft;

    $this.effectLevel.value = Math.round(100 * value / maxValue);
  });

  // Устанавливаем эффект
  this.effectSwitch.forEach(function (effect) {
    effect.addEventListener('change', function () {
      $this.setEffect(effect);
    });
  });
};

/**
 * Загружает изображение из файла в виде base64
 * @param {File} file файл с изображением
 * @param {Function} cb callback(err, base64image)
 */
PictureUploader.prototype.loadImage = function (file, cb) {
  if (file.type.indexOf('image/') !== 0) {
    cb(new Error('FILE_NOT_IMAGE'));
    return;
  }

  cb(null, window.URL.createObjectURL(file));
};

PictureUploader.prototype.validateForm = function (input) {
  var findDuplicates = function (arr) {
    var values = {};
    arr.forEach(function (element) {
      if (element in values) {
        return console.log('Один и тот же хэш-тег не может быть использован дважды');
      }
      values[element] = true;
    });
    return false;
  };

  var str = '#Один #четыре #три #два';

  str = str.toLowerCase();

  var arr = str.split(' ');
  console.log(arr);

  if (arr.length > 5) {
    console.log('Нельзя указать больше пяти хэш-тегов');
  } else {
    arr.forEach(function (element) {

      if (element.indexOf('#') !== 0) {
        console.log('Хеш-тег должен начинаться с символа #');

      } else if (element.length < 2) {
        console.log('Хеш-тег не может состоять только из одной решётки');

      } else if (element.length >= 20) {
        console.log('Хеш-тег должен быть короче 20 символов');
      }
    });
  }

  console.log('_____________________');

  findDuplicates(arr);

};

/*
 * Основной код программы
 */

(function () {
  var picturesData = new PicturesData();

  createDomElements(picturesData.properties, PostRenderer.addPicture, PostRenderer.container);

  BigPictureRenderer.bindEvents();

  var pictureUploader = new PictureUploader();

  pictureUploader.bindEvents();
})();
