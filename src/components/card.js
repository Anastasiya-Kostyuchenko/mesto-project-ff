import {
  getUserInfo,
  getCards,
  addCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from "../api";

// Создание карточки
export function createCard(template, cardData, userId) {
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

  // Обработчик клика на кнопку лайка
  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    const action = isLiked ? unlikeCard : likeCard;

    action(cardData._id)
      .then((updatedCardData) => {
        if (isLiked) {
          likeButton.classList.remove("card__like-button_is-active");
        } else {
          likeButton.classList.add("card__like-button_is-active");
        }

        if (likeCounter) {
          likeCounter.textContent = updatedCardData.likes.length;
        }
      })
      .catch((err) => {
        console.error(`Ошибка при изменении лайка: ${err}`);
      });
  });

  if (!deleteButton) {
    console.error("Кнопка удаления не найдена");
    return cardElement;
  }

  if (cardData.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      deleteCard(cardData._id)
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

  return cardElement;
}
