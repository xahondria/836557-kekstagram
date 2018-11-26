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


/* Функция выбирает случайный элемент из массива*/
var getRandomElement = function (array) {

  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};


/* Функция выбирает заданное количество случайных элементов из массива и формирует из них новый массив*/
var getRandomElements = function (inputArrayOfElements, maxNumberOfElements) {

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


/* удалялка всех дочених элементов из DOM*/
Element.prototype.removeAll = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
  return this;
};


/* Класс описывает массив исходных данных для вставки в DOM */
var PicturesData = function () {
  this.properties = [];

  for (var i = 0; i < numberOfPictures; i++) {
    this.properties.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.floor(likesMinNumber + Math.random() * (likesMaxNumber - likesMinNumber)),
      comments: getRandomElements(comments, Math.random() * numberOfComments),
      description: getRandomElement(descriptions)
    });
  }
};

/* Объект класса содержит готовый массив для вставки в DOM */
var picturesData = new PicturesData();


/* Класс описывает картинку, лайки, комментарии и т.п. */
var PostRenderer = function PostRenderer(element, picture) {
  this.element = element;
  this.picture = picture;
};

/* Метод отрисовывает превью картинок */
PostRenderer.prototype.renderPreview = function () {
  this.element.querySelector('.picture__img').src = this.picture.url;
  this.element.querySelector('.picture__likes').textContent = this.picture.likes;
  this.element.querySelector('.picture__comments').textContent = this.picture.comments.length;
};


/* добавление превью картинок в DOM*/

var picturesContainer = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');


var addPicture = function (pictureData) {
  var newPicture = pictureTemplate.cloneNode(true);

  var postRenderer = new PostRenderer(newPicture, pictureData);
  postRenderer.renderPreview();

  return newPicture;
};


var createDomElements = function (dataArray, elementGenerator, positionInDOM) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(elementGenerator(dataArray[i]));
  }
  positionInDOM.appendChild(fragment);
};

createDomElements(picturesData.properties, addPicture, picturesContainer);


/* Добавление информации в увеличенную картинку*/

var bigPicture = document.querySelector('.big-picture');


/* показываем пост*/
bigPicture.classList.remove('hidden');


/* Формируем пост*/

bigPicture.querySelector('.big-picture__img img').src = picturesData.properties[0].url;
bigPicture.querySelector('.likes-count').textContent = picturesData.properties[0].likes;
bigPicture.querySelector('.comments-count').textContent = picturesData.properties[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = picturesData.properties[0].description;

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');


/* Формируем блок комментариев*/

var fragment = document.createDocumentFragment();


var commentContainer = bigPicture.querySelector('.social__comments');
var commentTemplate = commentContainer.querySelector('.social__comment');


/* Удаляем старые комментарии из поста*/
commentContainer.removeAll();

/* Создаем новые комментарии*/
for (var i = 0; i < picturesData.properties[0].comments.length; i++) {
  var newComment = commentTemplate.cloneNode(true);

  newComment.querySelector('.social__picture').src = 'img/avatar-' + Math.floor(Math.random() * 6 + 1) + '.svg';
  newComment.querySelector('.social__text').textContent = picturesData.properties[0].comments[i];

  fragment.appendChild(newComment);
  commentContainer.appendChild(fragment);
}
