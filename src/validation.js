// Функция для показа ошибки валидации
export function showInputError(
  formElement,
  inputElement,
  errorMessage,
  config
) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (!errorElement) {
    console.error(`Элемент ошибки для ${inputElement.name} не найден`);
    return;
  }
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Функция для скрытия ошибки валидации
export function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

// Функция для управления текстом и состоянием кнопки во время загрузки
export function renderLoading(
  isLoading,
  buttonElement,
  defaultText = "Сохранить"
) {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = defaultText;
    buttonElement.disabled = false;
  }
}

// Проверка поля на валидность
export function checkInputValidity(formElement, inputElement, config) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  const isNameOrTitleField =
    inputElement.name === "name" || inputElement.name === "place-name";

  if (isNameOrTitleField && !regex.test(inputElement.value)) {
    inputElement.setCustomValidity(
      "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы"
    );
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Проверка состояния кнопки отправки
export function toggleButtonState(inputList, buttonElement, config) {
  const isFormValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );

  if (isFormValid) {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  }
}

// Навешиваем обработчики событий на форму
export function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

// Функция включения валидации
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();

      const buttonElement = formElement.querySelector(
        config.submitButtonSelector
      );
      renderLoading(true, buttonElement);

      // Имитация запроса, например, через fetch
      setTimeout(() => {
        renderLoading(false, buttonElement);
      }, 2000); // Замените на реальный запрос
    });

    setEventListeners(formElement, config);
  });
}

// Очистка ошибок валидации и сброс состояния кнопки
export function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
    inputElement.value = "";
  });

  toggleButtonState(inputList, buttonElement, config);
}
