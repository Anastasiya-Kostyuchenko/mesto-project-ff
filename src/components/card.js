export { createCard, delCard };

// Функция создания карточки
function createCard(template, element, openImagePopup) {
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
