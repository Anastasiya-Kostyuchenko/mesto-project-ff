import "./index.css";
import { createCard, delCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  handleEscClose,
  getOpenedPopup,
  setPopupListeners,
} from "./components/modal.js";
import { initialCards } from "./cards";

// Переменные
const cardTemplate = document.querySelector("#card-template");
const placesList = document.querySelector(".places__list");
const editPopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const popupForm = document.querySelector(".popup__form");
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

// Добавляем карточки на страницу при загрузке
initialCards.forEach((element) => {
  const cardElement = createCard(cardTemplate, element);
  placesList.append(cardElement);
});

setPopupListeners();

// Обработчик открытия и закрытия попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup);
});

// Обработчик сохранения данных профиля
function profileSaveButton(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closePopup(editPopup);
}

// Слушатель отправки формы редактирования профиля
popupForm.addEventListener("submit", profileSaveButton);

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

// Экспортируем функцию для открытия изображения
export function openImagePopup(link, name) {
  imageElement.src = link;
  imageElement.alt = name;
  captionElement.textContent = name;

  openPopup(imagePopup);
}
