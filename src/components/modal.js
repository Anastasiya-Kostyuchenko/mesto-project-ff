let openedPopup = null; // Переменная для хранения открытого попапа

// Универсальная функция открытия попапов
export function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  openedPopup = popup;
  document.addEventListener("keydown", handleEscClose);
}

// Универсальная функция закрытия попапов

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  function handleTransitionEnd() {
    popup.classList.remove("popup_is-opened");
    popup.removeEventListener("transitionend", handleTransitionEnd);
  }
  popup.addEventListener("transitionend", handleTransitionEnd);

  openedPopup = null;
  document.removeEventListener("keydown", handleEscClose);
}

// Закрытие по клавише Escape
export function handleEscClose(evt) {
  if (evt.key === "Escape") {
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function setPopupListeners() {
  // Закрытие попапа по клику на оверлей
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    popup.addEventListener("click", (evt) => {
      if (
        evt.target === evt.currentTarget ||
        evt.target.classList.contains("popup__close")
      ) {
        closePopup(popup);
      }
    });
  });
}

// Экспортируем функцию для открытия изображения
export function openImagePopup(
  link,
  name,
  imageElement,
  captionElement,
  imagePopup
) {
  imageElement.src = link;
  imageElement.alt = name;
  captionElement.textContent = name;

  openPopup(imagePopup);
}
