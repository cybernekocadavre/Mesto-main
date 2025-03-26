import { addLikeRequest, deleteLikeRequest } from "./api.js";

// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Функция создания карточки
function createCard(dataCard, openDeletePopup, openImagePopup, likeCard, myId) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = dataCard.name;
  cardImage.src = dataCard.link;
  cardImage.alt = dataCard.name;
  cardLikeCount.textContent = dataCard.likes.length;

  if (hasMyLike(dataCard, myId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  } else {
    cardLikeButton.classList.remove("card__like-button_is-active");
  }

  if (dataCard.owner._id === myId) {
    cardElement.dataset.cardId = dataCard._id;

    cardDeleteButton.addEventListener("click", () => openDeletePopup(dataCard));
  } else {
    cardDeleteButton.remove();
  }

  cardImage.addEventListener("click", () => openImagePopup(dataCard));

  cardLikeButton.addEventListener("click", () =>
    likeCard(dataCard, cardLikeButton, cardLikeCount, myId)
  );

  return cardElement;
}

// Функция лайка карточки
function likeCard(dataCard, cardLikeButton, cardLikeCount, myId) {
  if (!hasMyLike(dataCard, myId)) {
    addLikeRequest(dataCard)
      .then((newDataCard) => {
        cardLikeButton.classList.add("card__like-button_is-active");
        cardLikeCount.textContent = newDataCard.likes.length;
        dataCard.likes = newDataCard.likes;
      })
      .catch((err) => console.log(err));
  } else {
    deleteLikeRequest(dataCard)
      .then((newDataCard) => {
        cardLikeButton.classList.remove("card__like-button_is-active");
        cardLikeCount.textContent = newDataCard.likes.length;
        dataCard.likes = newDataCard.likes;
      })
      .catch((err) => console.log(err));
  }
}

// Функция проверки лайка на карточке
function hasMyLike(dataCard, myId) {
  return dataCard.likes.some((like) => like._id === myId);
}

export { createCard, likeCard };
