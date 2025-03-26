// Объект настроек API
const configAPI = {
  baseUrl: "https://nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "99f5c381-f5fd-459e-84cd-e6e54a047885",
    "Content-Type": "application/json",
  },
};

// Функция обработки ответа
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Функция запроса без тела
function request(url, method) {
  return fetch(configAPI.baseUrl + url, {
    method: method,
    headers: configAPI.headers,
  }).then(handleResponse);
}

// Функция запроса с телом
function bodyRequest(url, method, data) {
  return fetch(configAPI.baseUrl + url, {
    method: method,
    headers: configAPI.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// Функция запроса информации о пользователе
function getMyInfoRequest() {
  return request("/users/me", "GET");
}

// Функция запроса информации о карточках
function getСardsRequest() {
  return request("/cards", "GET");
}

// Функция запроса обновления профиля
function patchProfileRequest(nameProfile, descriptionProfile) {
  return bodyRequest("/users/me", "PATCH", {
    name: nameProfile,
    about: descriptionProfile,
  });
}

// Функция запроса обновления аватара
function patchAvatarRequest(avatarLink) {
  return bodyRequest("/users/me/avatar", "PATCH", { avatar: avatarLink });
}

// Функция запроса проверки ссылки на картинку
function checkImageLinkRequest(link) {
  return fetch(link, {
    method: "HEAD",
  }).then((link) => {
    if (link.ok) {
      if (link.headers.get("Content-Type").includes("image")) {
        return Promise.resolve();
      }

      return Promise.reject("Ссылка не является изображением");
    }

    return Promise.reject(`Ссылка недействительна. Ошибка: ${link.status}`);
  });
}

// Функция запроса добавления карточки
function postCardRequest(nameCard, linkCard) {
  return bodyRequest("/cards", "POST", { name: nameCard, link: linkCard });
}

// Функция запроса удаления карточки
function deleteCardRequest(cardId) {
  return request(`/cards/${cardId}`, "DELETE");
}

// Функция запроса лайка карточки
function addLikeRequest(dataCard) {
  return request(`/cards/likes/${dataCard._id}`, "PUT");
}

// Функция запроса удаления лайка карточки
function deleteLikeRequest(dataCard) {
  return request(`/cards/likes/${dataCard._id}`, "DELETE");
}

export {
  getMyInfoRequest,
  getСardsRequest,
  patchProfileRequest,
  patchAvatarRequest,
  checkImageLinkRequest,
  postCardRequest,
  deleteCardRequest,
  addLikeRequest,
  deleteLikeRequest,
};
