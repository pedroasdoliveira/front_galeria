const baseURL = "http://localhost:3005/galleries";
const msgAlert = document.querySelector(".msg__alert");

// --------------------------------------------------------- Find All -------------------------------------------
async function findAllGalleries() {
  const response = await fetch(`${baseURL}/catalog_images`);
  const galleries = await response.json();

  galleries.forEach(function (galeria) {
    document.querySelector("#galleryList").insertAdjacentHTML(
      "beforeend",
      `
            <div class="galeriaListaItem" id="galeriaListaItem_${galeria._id}">

                <div>
                    <div class="galeriaListaItem__titulo">${galeria.titulo}</div>
                    <div class="galeriaListaItem__tema">${galeria.tema}</div>
                    <img class="galeriaListaItem__imagem" src="${galeria.imagem}" alt="Imagem ${galeria.titulo}"/>
                    <div class="galeriaListaItem__ano">${galeria.ano}</div>
                    <div class="galeriaListaItem__descr">${galeria.descricao}</div>
                    <div class="galeriaListaItem__btns">
                        <button class="edit btn" onclick="openModal('${galeria._id}')">Editar</button>
                        <button class="delete btn" onclick="openModalDelete('${galeria._id}')">Apagar</button>
                    </div>
                </div>
            </div>
        `
    );
  });
}

findAllGalleries();
// --------------------------------------------------------- Find By Id -------------------------------------------
async function findbyGallery() {
  const idGallery = document.querySelector("#idImage").value;

  const response = await fetch(`${baseURL}/images/${idGallery}`);
  const gallery = await response.json();

  if (gallery.message != undefined) {
    localStorage.setItem("message", gallery.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  document.querySelector(".galeriaLista").style.display = "none";
  document.querySelector("#title_galleryList").innerText = "";
  document.querySelector(".list-all").style.display = "flex";

  const divChosenGallery = document.querySelector("#foundImage");

  divChosenGallery.innerHTML = `
        <div class="galeriaCardItem" id="galeriaListaItem_${gallery._id}">
            <div>
                <div class="galeriaCardItem__titulo">${gallery.titulo}</div>
                <div class="galeriaCardItem__tema">${gallery.tema}</div>
                <img class="galeriaCardItem__imagem" src="${gallery.imagem}" alt="Imagem ${gallery.titulo}"/>
                <div class="galeriaCardItem__ano">${gallery.ano}</div>
                <div class="galeriaCardItem__descr">${gallery.descricao}</div>
                <div class="galeriaCardItem__btns">
                    <button class="edit btn" onclick="openModal('${gallery._id}')">Editar</button>
                    <button class="delete btn" onclick="openModalDelete('${gallery._id}')">Apagar</button>
                </div>
            </div>
        </div>
    `;
}

// ------------------------------------------------------- Modal -----------------------------------------
async function openModal(id = "") {
  if (id != "") {
    // update
    document.querySelector("#header-modal").innerText = "Editar Card";
    document.querySelector("#button-modal").innerText = "Editar";

    const response = await fetch(`${baseURL}/images/${id}`);
    const gallery = await response.json();

    document.querySelector("#_id").value = gallery._id;
    document.querySelector("#titulo").value = gallery.titulo;
    document.querySelector("#tema").value = gallery.tema;
    document.querySelector("#imagem").value = gallery.imagem;
    document.querySelector("#ano").value = gallery.ano;
    document.querySelector("#descricao").value = gallery.descricao;
  } else {
    // add
    document.querySelector("#header-modal").innerText =
      "Adicionar card a galeria";
    document.querySelector("#button-modal").innerText = "Adicionar";
  }

  const modal = document.querySelector("#overlay");
  modal.style.display = "flex";
}

async function closeModal() {
  const modal = document.querySelector("#overlay");
  modal.style.display = "none";

  document.querySelector("#titulo").value = "";
  document.querySelector("#tema").value = "";
  document.querySelector("#imagem").value = "";
  document.querySelector("#ano").value = 0;
  document.querySelector("#descricao").value = "";
}

// ------------------------------------------------ Modal create and update ------------------------------
async function modalFunctions() {
  const id = document.querySelector("#_id").value;
  const titulo = document.querySelector("#titulo").value;
  const tema = document.querySelector("#tema").value;
  const imagem = document.querySelector("#imagem").value;
  const ano = document.querySelector("#ano").value;
  const descricao = document.querySelector("#descricao").value;

  const gallery = {
    id,
    titulo,
    tema,
    imagem,
    ano,
    descricao,
  };

  const modo = id != "";

  const endpoint = baseURL + (modo ? `/edit/${id}` : `/add`);

  const response = await fetch(endpoint, {
    method: modo ? "put" : "post",
    headers: {
      "content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(gallery),
  });

  const newGallery = await response.json();

  if (newGallery.message != undefined) {
    localStorage.setItem("message", newGallery.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  if (modo) {
    // update
    localStorage.setItem("message", "Card editado com sucesso!");
    localStorage.setItem("type", "success");
  } else {
    // add
    openMessage();
  }

  closeModal();
  setTimeout(function () {
    document.location.reload(true);
  }, 3000);
}

// ----------------------------------------------- Modal delete ---------------------------------
async function openModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnDelete = document.querySelector(".btns_yes");

  btnDelete.addEventListener("click", function () {
    deleteGallery(id);
  });
}

async function closeModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteGallery(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  messageDelete();
  closeModalDelete();
}

// --------------------------------------------- Alerts -----------------------------------------
let seconds;
let timer;

function openMessage() {
  const alert = document.querySelector("#alert");
  alert.style.display = "flex";

  seconds = 0;
  timer = setInterval(function () {
    seconds++;

    if (seconds == 3) {
      closeMessage();
      document.location.reload(true);
    }
  }, 1000);
}

function closeMessage() {
  clearInterval(timer);
  const alert = document.querySelector("#alert");
  alert.style.display = "none";
}

function messageDelete() {
  const alert = document.querySelector("#alertDelete");
  alert.style.display = "flex";

  seconds = 0;
  timer = setInterval(function () {
    seconds++;

    if (seconds == 3) {
      closeMessageDelete();
      document.location.reload(true);
    }
  }, 1000);
}

function closeMessageDelete() {
  clearInterval(timer);
  const alert = document.querySelector("#alertDelete");
  alert.style.display = "none";
}

// ----------------------------------------------- Message -----------------------------------------
function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));

  closeMessageAlert();
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 5000);
}

showMessageAlert();
