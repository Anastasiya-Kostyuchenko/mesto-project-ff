import "./index.css";
import { createCard, delCard, openImagePopup } from "./components/card.js";
import {
  openPopup,
  closePopup,
  handleEscClose,
  getOpenedPopup,
} from "./components/modal.js";
import { initialCards } from "./cards";

// Переменные
const cardTemplate = document.querySelector("#card-template");
const placesList = document.querySelector(".places__list");
const editPopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const formElement = document.querySelector(".popup__form");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const cardUrlInput = document.querySelector(".popup__input_type_url");
const cardForm = document.querySelector('form[name="new-place"]');

// Добавляем карточки на страницу при загрузке
initialCards.forEach((element) => {
  const cardElement = createCard(cardTemplate, element);
  placesList.append(cardElement);
});

// Обработчик открытия и закрытия попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup);
});

// Обработчик сохранения данных профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closePopup(editPopup);
}

// Слушатель отправки формы редактирования профиля
formElement.addEventListener("submit", handleFormSubmit);

// Обработчик открытия попапа добавления карточки
addButton.addEventListener("click", () => {
  openPopup(addCardPopup);
});

// Обработчик добавления новой карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };
  const cardElement = createCard(cardTemplate, newCardData);
  placesList.prepend(cardElement);
  closePopup(addCardPopup);
  cardForm.reset();
}

const closeButtons = document.querySelectorAll(".popup__close");
closeButtons.forEach((button) => {
  const popup = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popup));
});
