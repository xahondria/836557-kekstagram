'use strict';

(function () {

  /* Объект описывает попап с большой картинкой, комментариями, описанием и т.п. */
  window.BigPictureRenderer = {
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

        newComment.querySelector('.social__picture').src = comment.avatar;
        newComment.querySelector('.social__text').textContent = comment.message;

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

})();