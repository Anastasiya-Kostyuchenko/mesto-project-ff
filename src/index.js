import "./index.css";
import { createCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  setPopupListeners,
} from "./components/modal.js";
import { initialCards } from "./cards";
import { enableValidation, clearValidation } from "./validation.js";

// Переменные
const cardTemplate = document.querySelector("#card-template");
const placesList = document.querySelector(".places__list");
const editPopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editProfileForm = editPopup.querySelector(".popup__form");
const addCardForm = addCardPopup.querySelector(".popup__form");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const cardUrlInput = document.querySelector(".popup__input_type_url");
const cardForm = document.querySelector('form[name="new-place"]');
const imagePopup = document.querySelector(".popup_type_image");
const imageElement = imagePopup.querySelector(".popup__image");
const captionElement = imagePopup.querySelector(".popup__caption");

setPopupListeners();

// Добавляем карточки на страницу при загрузке
initialCards.forEach((element) => {
  const cardElement = createCard(cardTemplate, element, (link, name) =>
    openImagePopup(link, name, imageElement, captionElement, imagePopup)
  );
  placesList.append(cardElement);
});

// Обработчик открытия попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(editProfileForm, validationConfig);
  openPopup(editPopup);
});

// Обработчик сохранения данных профиля
function profileSaveButton(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closePopup(editPopup);
}

editProfileForm.addEventListener("submit", profileSaveButton);

// Обработчик открытия попапа добавления карточки
addButton.addEventListener("click", () => {
  clearValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
});

// Обработчик добавления новой карточки
cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };

  const cardElement = createCard(cardTemplate, newCardData, (link, name) =>
    openImagePopup(link, name, imageElement, captionElement, imagePopup)
  );

  placesList.prepend(cardElement);
  closePopup(addCardPopup);
  cardForm.reset();
});

// Включение валидации для всех форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);
