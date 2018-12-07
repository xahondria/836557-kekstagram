'use strict';

(function () {

  /* Класс описывает массив исходных данных для вставки в DOM */
  var PicturesData = function () {
    this.properties = [];

    for (var i = 0; i < this.numberOfPictures; i++) {
      this.properties.push({
        url: 'photos/' + (i + 1) + '.jpg',
        likes: Math.floor(this.likesMinNumber + Math.random() * (this.likesMaxNumber - this.likesMinNumber)),
        comments: window.utils.getRandomElements(this.inputComments, Math.random() * (this.numberOfComments)),
        description: window.utils.getRandomElement(this.inputdescriptions)
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

  window.PicturesData = PicturesData;

})();
