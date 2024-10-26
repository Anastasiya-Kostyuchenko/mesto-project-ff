import "./index.css";
import { createCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  setPopupListeners,
} from "./components/modal.js";
import {
  enableValidation,
  clearValidation,
  showInputError,
  hideInputError,
  checkInputValidity,
  toggleButtonState,
  setEventListeners,
} from "./validation.js";
import {
  getUserInfo,
  getCards,
  updateProfile,
  addCard,
  checkResponse,
  cohortId,
  apiToken,
  deleteCard,
  likeCard,
  unlikeCard,
  getUserProfile,
  updateAvatar,
} from "./api.js";

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

const profileImage = document.querySelector(".profile__image");

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

setPopupListeners();

// Обработчик открытия попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(editProfileForm, config);
  openPopup(editPopup);
});

// Обработчик сохранения данных профиля
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton, "Сохранение...");
  updateProfile(nameInput.value, jobInput.value)
    .then((updatedUserData) => {
      profileName.textContent = updatedUserData.name;
      profileJob.textContent = updatedUserData.about;
      closePopup(editPopup);
    })
    .catch((err) => {
      console.error(`Ошибка обновления профиля: ${err}`);
    })
    .finally(() => {
      renderLoading(false, avatarSubmitButton, "Сохранить");
    });
});

// Обработчик открытия попапа добавления карточки
addButton.addEventListener("click", () => {
  clearValidation(addCardForm, config);
  openPopup(addCardPopup);
});

let userId;

Promise.all([getUserInfo(), getCards()]).then(([userData, cards]) => {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  profileImage.style.backgroundImage = `url('${userData.avatar}')`;
  if (!Array.isArray(cards)) {
    console.error("cards не является массивом");
    return;
  }

  // Отображение карточек на странице
  cards.forEach((card) => {
    const cardElement = createCard(cardTemplate, card, userData._id, {
      onLike: likeCard,
      onUnlike: unlikeCard,
      onDelete: deleteCard,
    });
    placesList.append(cardElement);
  });
  userId = userData._id;
});

// Обработчик добавления новой карточки
cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton, "Сохранение...");

  addCard(cardNameInput.value, cardUrlInput.value)
    .then((newCardData) => {
      const cardElement = createCard(cardTemplate, newCardData, userId, {
        onLike: likeCard,
        onUnlike: unlikeCard,
        onDelete: deleteCard,
      });
      placesList.prepend(cardElement);
      closePopup(addCardPopup);
      cardForm.reset();
    })
    .catch((err) => {
      console.error(`Ошибка добавления карточки: ${err}`);
    })
    .finally(() => {
      renderLoading(false, avatarSubmitButton, "Сохранить");
    });
});

const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarOpenButton = document.querySelector(".profile__image");
const avatarCloseButton = avatarPopup.querySelector(".popup__close");
const avatarForm = document.querySelector('form[name="avatar-form"]');
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

// Открытие попапа
avatarOpenButton.addEventListener("click", () => {
  openPopup(avatarPopup);
  avatarSubmitButton.disabled = true;
  avatarSubmitButton.classList.add(config.inactiveButtonClass);
});

// Закрытие попапа
avatarCloseButton.addEventListener("click", () => {
  closePopup(avatarPopup);
  avatarForm.reset();
  avatarSubmitButton.disabled = true;
  avatarSubmitButton.classList.add(config.inactiveButtonClass);
});

// Функция для проверки валидности URL
function isValidURL(url) {
  const urlPattern =
    /^(http:\/\/|https:\/\/)([\w\-]+\.)+[\w]{2,}(\/[\w\-.~:?#[\]@!$&'()*+,;=]*)*\/?$/i;
  return urlPattern.test(url);
}

// Функция для отображения состояния загрузки
function renderLoading(isLoading, buttonElement, defaultText = "Сохранить") {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = defaultText;
    buttonElement.disabled = false;
  }
}

enableValidation(config, renderLoading);

// Проверка валидности URL перед отправкой
avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
  const newAvatarUrl = avatarInput.value;

  renderLoading(true, avatarSubmitButton, "Сохранение...");

  updateAvatar(cohortId, apiToken, newAvatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url('${newAvatarUrl}')`;
      closePopup(avatarPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при смене аватара: ${err}`);
      const errorElement = document.querySelector(".avatar-error");
      errorElement.textContent = "Не удалось сменить аватар. Попробуйте снова.";
    })
    .finally(() => {
      renderLoading(false, avatarSubmitButton, "Сохранить");
    });
});
