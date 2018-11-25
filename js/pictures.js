'use strict';

// исходные данные для объектов картинок

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var numberOfPictures = 25;
var likesMinNumber = 15;
var likesMaxNumber = 200;
var numberOfComments = 2;

// конец исходных данных для объектов картинок


var getRandomElement = function (array) {
  /* Функция выбирает случайный элемент из массива*/

  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

var getRandomElements = function (inputArrayOfElements, maxNumberOfElements) {
  /* Функция выбирает заданное количество случайных элементов из массива и формирует из них новый массив*/

  var uniqueIndexes = [];
  var randomElements = [];

  while (uniqueIndexes.length <= maxNumberOfElements) {
    var randomIndex = Math.floor(Math.random() * inputArrayOfElements.length);
    if (uniqueIndexes.indexOf(randomIndex) === -1) {
      uniqueIndexes.push(randomIndex);
      randomElements.push(inputArrayOfElements[randomIndex]);
    }
  }
  return randomElements;
};

var PostRenderer = function PostRenderer(element, picture) {
  this.element = element;
  this.picture = picture;
};

PostRenderer.prototype.render = function () {
  this.element.querySelector('.picture__img').setAttribute('src', this.picture.url);
  this.element.querySelector('.picture__likes').textContent = this.picture.likes;
  this.element.querySelector('.picture__comments').textContent = this.picture.comments.length;
};

var PicturesData = function () {
  this.pictures = [];

  for (var i = 0; i < numberOfPictures; i++) {
    this.pictures.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.floor(likesMinNumber + Math.random() * (likesMaxNumber - likesMinNumber)),
      comments: getRandomElements(comments, Math.random() * numberOfComments),
      description: getRandomElement(descriptions)
    });
  }
};


/* Функция формирует массив объектов картинок со всеми необходимыми свойствами для кекстаграмма*/

var picturesData = new PicturesData();

// конец конструктора объектов картинок на главный экран


// добавление элементов DOM

var picturesContainer = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var addPicture = function (picture) {
  var newPicture = pictureTemplate.cloneNode(true);

  var postRenderer = new PostRenderer(newPicture, picture);
  postRenderer.render();

  return newPicture;
};


var createDOMElements = function (array, elementGenerator, positionInDOM) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(elementGenerator(array[i]));
  }
  positionInDOM.appendChild(fragment);
};

createDOMElements(picturesData.pictures, addPicture, picturesContainer);


var bigPicture = document.querySelector('.big-picture');

bigPicture.classList.remove('hidden');
