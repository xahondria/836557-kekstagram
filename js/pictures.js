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


/* Объект класса содержит готовый массив для вставки в DOM */
var picturesData = new PicturesData();


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

PostRenderer.addPicture = function (pictureData) {

  var postRenderer = new PostRenderer(pictureData);
  postRenderer.renderPreview();

  return postRenderer.element;
};


/* Функция создает фрагмент разметки и вставляет его в заданное место*/
var createDomElements = function (dataArray, elementGenerator, positionInDom) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(elementGenerator(dataArray[i]));
  }
  positionInDom.appendChild(fragment);
};

createDomElements(picturesData.properties, PostRenderer.addPicture, PostRenderer.container);


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

        if (!$this.element.classList.contains('hidden')) {
          $this.hide();
        }
      }
    });

  }
};

BigPictureRenderer.bindEvents();


/* Класс описывает редактор загружаемых изображений*/
var PictureUploader = function PictureUploader() {
  this.element = document.querySelector('.img-upload');

  this.uploadOverlay = this.element.querySelector('.img-upload__overlay');
  this.uploadOverlayHideButton = this.element.querySelector('.img-upload__cancel');
  this.inputFile = this.element.querySelector('#upload-file');

  this.effectLevelPin = this.element.querySelector('.effect-level__pin');
  this.effectLevelLine = this.element.querySelector('.effect-level__line');
  this.effectLevel = this.element.querySelector('.effect-level__value');

};

PictureUploader.prototype.show = function () {
  this.uploadOverlay.classList.remove('hidden');
};

PictureUploader.prototype.hide = function () {
  this.uploadOverlay.classList.add('hidden');
  this.inputFile.value = '';
};

PictureUploader.prototype.bindEvents = function () {
  var $this = this;

  if (this.__eventsBinded__) {
    return;
  }
  this.__eventsBinded__ = true;

  // Открываем попап
  this.inputFile.addEventListener('change', function (ev) {
    ev.preventDefault();
    $this.show();
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

      if (!$this.uploadOverlay.classList.contains('hidden')) {
        $this.hide();
      }
    }
  });

  // Записываем значение уровня насыщенности в соответствующий input
  this.effectLevelPin.addEventListener('mouseup', function (ev) {
    ev.preventDefault();

    var maxValue = $this.effectLevelLine.offsetWidth;
    var value = $this.effectLevelPin.offsetLeft;

    $this.effectLevel.value = Math.round(100 * value / maxValue);
  });

};

var pictureUploader = new PictureUploader();

pictureUploader.bindEvents();
