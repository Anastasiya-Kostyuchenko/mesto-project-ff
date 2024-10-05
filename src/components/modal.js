let openedPopup = null;

// Универсальная функция открытия попапов
export function openPopup(popup) {
  popup.style.display = "flex";
  popup.style.opacity = "0";
  popup.style.visibility = "visible";
  requestAnimationFrame(() => {
    popup.style.transition = "opacity 0.6s";
    popup.style.opacity = "1";
  });

  openedPopup = popup;
  document.addEventListener("keydown", handleEscClose);
}

// Универсальная функция закрытия попапов
export function closePopup(popup) {
  popup.style.transition = "opacity 0.6s";
  popup.style.opacity = "0";

  popup.addEventListener("transitionend", function handleTransitionEnd() {
    popup.style.display = "none";
    popup.style.visibility = "hidden";
    popup.removeEventListener("transitionend", handleTransitionEnd);
    if (openedPopup === popup) {
      openedPopup = null;
    }
  });

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
