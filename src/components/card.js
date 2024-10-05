export { createCard, delCard };
import { openPopup } from "./modal";

// Функция создания карточки
function createCard(template, element) {
  const cardElement = template.content
    .querySelector(".places__item")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.setAttribute("src", element.link);
  cardImage.setAttribute("alt", element.name);
  cardElement.querySelector(".card__title").textContent = element.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => delCard(cardElement));

  const likeButton = cardElement.querySelector(".card__like-button");

  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__like-button_is-active");

    cardImage.addEventListener("click", () => {
      openCardImage(element.link, element.name);
    });
  });

  cardImage.addEventListener("click", () => {
    openImagePopup(element.link, element.name);
  });

  return cardElement;
}

// Функция удаления карточки
function delCard(cardElement) {
  cardElement.remove();
}

// Экспортируем функцию для открытия изображения
export function openImagePopup(link, name) {
  const imagePopup = document.querySelector(".popup_type_image");
  const imageElement = imagePopup.querySelector(".popup__image");
  const captionElement = imagePopup.querySelector(".popup__caption");
  imageElement.src = link;
  imageElement.alt = name;
  captionElement.textContent = name;

  openPopup(imagePopup);
}
