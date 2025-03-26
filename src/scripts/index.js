import "../pages/index.css";
import { createCard, likeCard } from "../components/card.js";
import {
  openModal,
  closeModal,
  closeModalByOverlay,
} from "../components/modal.js";
import {
  showInputError,
  disableButton,
  clearValidation,
  enableValidation,
} from "../components/validation.js";
import {
  getMyInfoRequest,
  getСardsRequest,
  patchProfileRequest,
  patchAvatarRequest,
  checkImageLinkRequest,
  postCardRequest,
  deleteCardRequest,
} from "../components/api.js";

// DOM узлы
// Профиль
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const profileEditButton = document.querySelector(".profile__edit-button");

// Карточки
const cardAddButton = document.querySelector(".profile__add-button");
const cardsContainer = document.querySelector(".places__list");

// Модальные окна
const popups = document.querySelectorAll(".popup");
const closeButtons = document.querySelectorAll(".popup__close");

// Окно редактирования профиля
const profileEditPopup = document.querySelector(".popup_type_edit");
const profileForm = document.forms["edit-profile"];
const profileNameInput = profileForm.elements.name;
const profileDescriptionInput = profileForm.elements.description;
const profileSubmitButton = profileForm.querySelector(".popup__button");

// Окна редактирования аватара
const avatarEditPopup = document.querySelector(".popup_type_avatar");
const avatarForm = document.forms["edit-avatar"];
const avatarLinkInput = avatarForm.elements.avatar;
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

// Окно добавления карточки
const cardAddPopup = document.querySelector(".popup_type_new-card");
const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const cardSubmitButton = cardForm.querySelector(".popup__button");

// Окно удаления карточки
const cardDeletePopup = document.querySelector(".popup_type_delete");
const cardDeleteButton = cardDeletePopup.querySelector(".popup__button");

// Окно просмотра картинки
const cardViewPopup = document.querySelector(".popup_type_image");
const cardViewPopupImage = cardViewPopup.querySelector(".popup__image");
const cardViewPopupCaption = cardViewPopup.querySelector(".popup__caption");

// Объект настроек валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Id моего профиля
let myId;

// Id удаляемой карточки
let cardDeleteId;

// Функция процесса загрузки
function renderLoading(isLoading, buttonElement) {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
  } else {
    buttonElement.textContent = "Сохранить";
  }
}

// Функция редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, profileSubmitButton);

  patchProfileRequest(profileNameInput.value, profileDescriptionInput.value)
    .then((dataProfile) => {
      profileName.textContent = dataProfile.name;
      profileDescription.textContent = dataProfile.about;
      closeModal(profileEditPopup);
    })
    .catch((err) => console.log(err))
    .finally(() => renderLoading(false, profileSubmitButton));
}

// Функция редактирования аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  checkImageLinkRequest(avatarLinkInput.value)
    .then(() => {
      renderLoading(true, avatarSubmitButton);
      patchAvatarRequest(avatarLinkInput.value)
        .then((dataAvatar) => {
          profileImage.style.backgroundImage = `url(${dataAvatar.avatar})`;
          closeModal(avatarEditPopup);
        })
        .catch((err) => console.log(err))
        .finally(() => renderLoading(false, avatarSubmitButton));
    })
    .catch((error) => {
      showInputError(avatarForm, avatarLinkInput, error, validationConfig);
      disableButton(avatarSubmitButton, validationConfig);
    });
}

// Функция добавления карточки из формы
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, cardSubmitButton);

  postCardRequest(cardNameInput.value, cardLinkInput.value)
    .then((dataCard) => {
      cardsContainer.prepend(
        createCard(dataCard, openDeletePopup, openImagePopup, likeCard, myId)
      );
      closeModal(cardAddPopup);
      cardForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => renderLoading(false, cardSubmitButton));
}

// Функция открытия картинки карточки
function openImagePopup(dataCard) {
  cardViewPopupImage.src = dataCard.link;
  cardViewPopupImage.alt = dataCard.name;
  cardViewPopupCaption.textContent = dataCard.name;
  openModal(cardViewPopup);
}

// Функция открытия попапа удаления карточки
function openDeletePopup(dataCard) {
  cardDeleteId = dataCard._id;
  openModal(cardDeletePopup);
}

// Функция удаления карточки
function handleCardDelete(evt) {
  evt.preventDefault();

  deleteCardRequest(cardDeleteId)
    .then(() => {
      document.querySelector(`[data-card-id="${cardDeleteId}"]`).remove();
      cardDeleteId = "";
      closeModal(cardDeletePopup);
    })
    .catch((err) => console.log(err));
}

// Загрузка информации о пользователе и карточках
Promise.all([getMyInfoRequest(), getСardsRequest()])
  .then(([me, dataCards]) => {
    profileName.textContent = me.name;
    profileDescription.textContent = me.about;
    profileImage.style.backgroundImage = `url(${me.avatar})`;
    myId = me._id;

    dataCards.forEach((dataCard) => {
      cardsContainer.append(
        createCard(dataCard, openDeletePopup, openImagePopup, likeCard, myId)
      );
    });
  })
  .catch((err) => console.log(err));

// Активация валидации
enableValidation(validationConfig);

// Слушатели открытия модальных окон
// Окно редактирования профиля
profileEditButton.addEventListener("click", () => {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profileEditPopup);
});

// Окно редактирования аватара
profileImage.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarEditPopup);
});

// Окно добавления карточки
cardAddButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModal(cardAddPopup);
});

// Слушатели закрытия модальных окон
// По клику на кнопку закрытия
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".popup"));
  });
});

// По клику на оверлей
popups.forEach((popup) => {
  popup.addEventListener("mousedown", closeModalByOverlay);
});

// Слушатель редактирования профиля
profileForm.addEventListener("submit", handleProfileFormSubmit);

// Слушатель редактирования аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Слушатель добавления карточки
cardForm.addEventListener("submit", handleCardFormSubmit);

// Слушатель удаления карточки
cardDeleteButton.addEventListener("click", handleCardDelete);
