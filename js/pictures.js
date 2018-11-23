'use strict';

// исходные данные для картинок

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

var pictures = [];

var numberOfPictures = 25;
var likesMinNumber = 15;
var likesMaxNumber = 200;
var numberOfComments = 2;

// конец исходных данных для картинок


// конструктор картинок

var getRandomElement = function (array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

var getRandomComments = function (arrayOfComments, maxNumberOfComments) {

  var uniqueIndexes = [];
  var RandomComments = [];

  while (uniqueIndexes.length <= maxNumberOfComments) {
    var randomIndex = Math.floor(Math.random() * arrayOfComments.length);
    if (uniqueIndexes.indexOf(randomIndex) === -1) {
      uniqueIndexes.push(randomIndex);
      RandomComments.push(arrayOfComments[randomIndex]);
    }
  }
  return RandomComments;
};


for (var i = 0; i < numberOfPictures; i++) {
  pictures.push({
    url: 'photos/' + (i + 1) + '.jpg',
    likes: Math.floor(likesMinNumber + Math.random() * (likesMaxNumber - likesMinNumber)),
    comments: getRandomComments(comments, Math.random() * numberOfComments),
    description: getRandomElement(descriptions)
  });

  console.log('pictures url = ' + pictures[i].url);
  console.log('pictures likes = ' + pictures[i].likes);

  console.log('pictures comments = ' + pictures[i].comments);
  console.log('pictures comments 1 = ' + pictures[i].comments[0]);
  console.log('pictures comments 2 = ' + pictures[i].comments[1]);
  console.log('pictures comments.length = ' + pictures[i].comments.length);

  console.log('pictures description = ' + pictures[i].description);
  console.log('');
}

// конец конструктора картинок


// добавление картинок в DOM

var picturesContainer = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var addPicture = function (picture) {
  var newPicture = pictureTemplate.cloneNode(true);

  newPicture.querySelector('.picture__img').setAttribute('src', picture.url);
  newPicture.querySelector('.picture__likes').textContent = picture.likes;
  newPicture.querySelector('.picture__comments').textContent = picture.comments.length;

  return newPicture;
};


var createDOMElements = function (array, elementGenerator, positionInDOM) {
  var fragment = document.createDocumentFragment();

  for (i = 0; i < array.length; i++) {
    fragment.appendChild(elementGenerator(array[i]));
  }
  positionInDOM.appendChild(fragment);
};

createDOMElements(pictures, addPicture, picturesContainer);


var bigPicture = document.querySelector('.big-picture');

bigPicture.classList.remove('hidden');
