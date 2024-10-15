// Функция для показа ошибки валидации
export function showInputError(
  formElement,
  inputElement,
  errorMessage,
  config
) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
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

// Проверка поля на валидность
export function checkInputValidity(formElement, inputElement, config) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/; // Допустимые символы для имени или названия
  const isNameOrTitleField =
    inputElement.name === "name" || inputElement.name === "place-name";

  if (isNameOrTitleField && !regex.test(inputElement.value)) {
    inputElement.setCustomValidity(
      "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы"
    );
  } else {
    inputElement.setCustomValidity(""); // Сброс ошибки
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

// const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

// function validateInput(input) {
//   const errorElement = document.querySelector(`.${input.name}-error`);

//   if (!input.validity.valid) {
//     if (input.name === "place-name") {
//       if (input.validity.tooShort || input.validity.tooLong) {
//         errorElement.textContent = `Должно быть от ${input.minLength} до ${input.maxLength} символов`;
//       } else if (!regex.test(input.value)) {
//         errorElement.textContent =
//           "Поле может содержать только буквы, пробелы и дефисы";
//       }
//     } else if (input.name === "link" && input.validity.typeMismatch) {
//       errorElement.textContent = "Введите правильный URL";
//     } else {
//       errorElement.textContent = input.validationMessage;
//     }
//     input.classList.add("form__input_type_error");
//     errorElement.classList.add("form__input-error_active");
//   } else {
//     errorElement.textContent = "";
//     input.classList.remove("form__input_type_error");
//     errorElement.classList.remove("form__input-error_active");
//   }
// }

// export function toggleButtonState(inputList, buttonElement, config) {
//   const isFormValid = inputList.every(
//     (inputElement) => inputElement.validity.valid
//   );

//   if (isFormValid) {
//     buttonElement.disabled = false;
//     buttonElement.classList.remove(config.inactiveButtonClass);
//   } else {
//     buttonElement.disabled = true;
//     buttonElement.classList.add(config.inactiveButtonClass);
//   }
// }

// function resetForm(form) {
//   const inputList = Array.from(form.querySelectorAll(".popup__input"));
//   inputList.forEach((input) => {
//     const errorElement = document.querySelector(`.${input.name}-error`);
//     errorElement.textContent = "";
//     input.classList.remove("form__input_type_error");
//     errorElement.classList.remove("form__input-error_active");
//   });
//   form.reset();
//   toggleButtonState(form, form.querySelector(".popup__button"));
// }

// const saveButton = cardForm.querySelector(".popup__button");

// cardForm.addEventListener("input", (evt) => {
//   validateInput(evt.target);
//   toggleButtonState(cardForm, saveButton);
// });

// addButton.addEventListener("click", () => {
//   resetForm(cardForm);
//   openPopup(addCardPopup);
// });
