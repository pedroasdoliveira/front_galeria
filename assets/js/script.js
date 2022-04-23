const baseURL = "http://localhost:3005/galleries";

// --------------------------------------------------------- Find All -------------------------------------------
async function findAllGalleries() {
    const response = await fetch(`${baseURL}/catalog_images`);
    const galleries = await response.json();

    galleries.forEach(function (galeria) {
        document.querySelector('#galleryList').insertAdjacentHTML('beforeend', `
            <div class="galeriaListaItem" id="galeriaListaItem_${galeria._id}">

                <div>
                    <div class="galeriaListaItem__titulo">${galeria.titulo}</div>
                    <div class="galeriaListaItem__tema">${galeria.tema}</div>
                    <img class="galeriaListaItem__imagem" src="${galeria.imagem}" alt="Imagem ${galeria.titulo}"/>
                    <div class="galeriaListaItem__ano">${galeria.ano}</div>
                    <div class="galeriaListaItem__descr">${galeria.descricao}</div>
                    <div class="galeriaListaItem__btns">
                        <button class="edit btn" onclick="openModal(${galeria._id})">Editar</button>
                        <button class="delete btn" onclick="openModalDelete(${galeria._id})">Apagar</button>
                    </div>
                </div>
            </div>
        `)
    });
}

findAllGalleries();
// --------------------------------------------------------- Find By Id -------------------------------------------
async function findbyGallery() {
    const idGallery = document.querySelector('#idImage').value;

    const response = await fetch(`${baseURL}/images/${idGallery}`);
    const gallery = await response.json();

    const divChosenGallery = document.querySelector('#foundImage');

    if (gallery.id == undefined) {
        alert('Card não encontrado!');
        return;
    }

    divChosenGallery.innerHTML = 
    `
        <div class="galeriaCardItem" id="galeriaListaItem_${gallery._id}">
            <div>
                <div class="galeriaCardItem__titulo">${gallery.titulo}</div>
                <div class="galeriaCardItem__tema">${gallery.tema}</div>
                <img class="galeriaCardItem__imagem" src="${gallery.imagem}" alt="Imagem ${gallery.titulo}"/>
                <div class="galeriaCardItem__ano">${gallery.ano}</div>
                <div class="galeriaCardItem__descr">${gallery.descricao}</div>
                <div class="galeriaCardItem__btn">
                    <button class="edit btn" onclick="openModal(${gallery._id})">Editar</button>
                    <button class="delete btn" onclick="openModalDelete(${gallery._id})">Apagar</button>
                </div>
            </div>
        </div>
    `
};