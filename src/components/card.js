// Создание карточки с колбэками для событий
export function createCard(
  template,
  cardData,
  userId,
  { onLike, onUnlike, onDelete, onImageClick }
) {
  const cardElement = template.content
    .querySelector(".places__item")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const likeCounter = cardElement.querySelector(".card__like-counter");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.setAttribute("src", cardData.link);
  cardImage.setAttribute("alt", cardData.name);
  cardElement.querySelector(".card__title").textContent = cardData.name;

  const isLiked = cardData.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Обновление счетчика лайков
  if (likeCounter) {
    likeCounter.textContent = cardData.likes.length;
  } else {
    console.error("Элемент likeCounter не найден");
  }

  // Обработчик лайка
  likeButton.addEventListener("click", () => {
    likeCallback(cardData._id, likeButton, likeCounter, onLike, onUnlike);
  });

  // Обработчик удаления
  deleteCallback(cardData, userId, cardElement, deleteButton, onDelete);

  // Обработчик клика на изображение для открытия попапа
  cardImage.addEventListener("click", () => {
    onImageClick(cardData);
  });

  return cardElement;
}

// Колбэк для лайка
const likeCallback = (cardId, likeButton, likeCounter, onLike, onUnlike) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const action = isLiked ? onUnlike : onLike;

  action(cardId)
    .then((updatedCardData) => {
      likeButton.classList.toggle("card__like-button_is-active", !isLiked);
      if (likeCounter) {
        likeCounter.textContent = updatedCardData.likes.length;
      }
    })
    .catch((err) => {
      console.error(`Ошибка при изменении лайка: ${err}`);
    });
};

// Колбэк для удаления карточки
const deleteCallback = (
  cardData,
  userId,
  cardElement,
  deleteButton,
  onDelete
) => {
  if (cardData.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      onDelete(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => {
          console.error(`Ошибка при удалении карточки: ${err}`);
        });
    });
  } else {
    deleteButton.remove();
  }
};
