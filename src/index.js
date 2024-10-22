import "./index.css";
import { createCard, deleteCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  setPopupListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getUserInfo,
  getCards,
  updateProfile,
  addCard,
  checkResponse,
  cohortId,
  apiToken,
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

const avatarForm = document.querySelector('form[name="avatar-form"]');
const profileImage = document.querySelector(".profile__image");

setPopupListeners();

// Обработчик открытия попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(editProfileForm, validationConfig);
  openPopup(editPopup);
});

// Обработчик сохранения данных профиля
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(true, submitButton, "Сохранение...");
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
      renderLoading(false, submitButton, "Сохранить");
    });
});

// Обработчик открытия попапа добавления карточки
addButton.addEventListener("click", () => {
  clearValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
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

let userId;

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    if (!Array.isArray(cards)) {
      console.error("cards не является массивом");
      return;
    }

    // Отображение карточек на странице
    cards.forEach((card) => {
      const cardElement = createCard(cardTemplate, card, userData._id);
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(`Ошибка получения данных с сервера: ${err}`);
  });

// Обработчик добавления новой карточки
cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(true, submitButton, "Сохранение...");
  addCard(cardNameInput.value, cardUrlInput.value)
    .then((newCardData) => {
      const cardElement = createCard(cardTemplate, newCardData, userId);
      placesList.prepend(cardElement);
      closePopup(addCardPopup);
      cardForm.reset();
    })
    .catch((err) => {
      console.error(`Ошибка добавления карточки: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Сохранить");
    });
});

const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarOpenButton = document.querySelector(".profile__image");
const avatarCloseButton = avatarPopup.querySelector(".popup__close");
const submitButton = avatarForm.querySelector(".popup__button");

// Открытие попапа
avatarOpenButton.addEventListener("click", () => {
  openPopup(avatarPopup);
});

// Закрытие попапа
avatarCloseButton.addEventListener("click", () => {
  closePopup(avatarPopup);
  avatarForm.reset(); // Сбросить форму при закрытии
  const errorElement = document.getElementById("avatar-error");
  errorElement.textContent = ""; // Очистить сообщение об ошибке
});

// Обработчик отправки формы
avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
  const newAvatarUrl = avatarInput.value;

  // Проверяем валидность URL перед отправкой
  if (!isValidURL(newAvatarUrl)) {
    const errorElement = document.getElementById("avatar-error");
    errorElement.textContent = "Пожалуйста, введите корректный URL.";
    return; // Прекращаем выполнение, если URL невалидный
  }

  renderLoading(true, submitButton, "Сохранение...");

  fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      authorization: apiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar: newAvatarUrl }),
  })
    .then(checkResponse)
    .then((data) => {
      // Обновляем аватар пользователя
      profileImage.style.backgroundImage = `url('${newAvatarUrl}')`;
      closePopup(avatarPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при смене аватара: ${err}`);
      const errorElement = document.getElementById("avatar-error");
      errorElement.textContent = "Не удалось сменить аватар. Попробуйте снова."; // Сообщение об ошибке
    })
    .finally(() => {
      renderLoading(false, submitButton, "Сохранить");
    });
});

// Функция для отображения состояния загрузки
function renderLoading(isLoading, buttonElement, defaultText) {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = defaultText;
    buttonElement.disabled = false;
  }
}
