import "./index.css";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template");
// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
// @todo: Функция создания карточки
function createCard(cardTemplate, element) {
  const cardElement = cardTemplate.content
    .querySelector(".places__item")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.setAttribute("src", element.link);
  cardImage.setAttribute("alt", element.name);
  cardElement.querySelector(".card__title").textContent = element.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", function () {
    delCard(cardElement);
  });

  return cardElement;
}
// @todo: Функция удаления карточки

function delCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу

initialCards.forEach((element) => {
  const cardElement = createCard(cardTemplate, element);

  placesList.append(cardElement);
});

// const addIcon = new URL("./images/avatar.jpg", import.meta.url);
// const avatar = new URL("./images/avatar.jpg", import.meta.url);
// const card1 = new URL("./images/card_1.jpg", import.meta.url);
// const card2 = new URL("./images/card_2.jpg", import.meta.url);
// const card3 = new URL("./images/card_3.jpg", import.meta.url);
// const closeimagine = new URL("./images/close.svg", import.meta.url);
// const deleteIcon = new URL("./images/delete-icon.svg", import.meta.url);
// const editIcon = new URL("./images/edit-icon.svg", import.meta.url);
// const likeActive = new URL("./images/like-active.svg", import.meta.url);
// const likeInactive = new URL("./images/like-inactive.svg", import.meta.url);
// const logo = new URL("./images/logo.svg", import.meta.url);

// const images = [
//   // меняем исходные пути на переменные
//   { name: "addIcon", link: addIcon },
//   { name: "avatar", link: avatar },
//   { name: "card1", link: card1 },
//   { name: "card2", link: card2 },
//   { name: "card3", link: card3 },
//   { name: "closeimagine", link: closeimagine },
//   { name: "deleteIcon", link: deleteIcon },
//   { name: "ditIcon", link: editIcon },
//   { name: "likeActive", link: likeActive },
//   { name: "likeInactive", link: likeInactive },
//   { name: "logo", link: logo },
// ];
