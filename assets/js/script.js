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
                        <button class="edit btn" onclick="openModal('${galeria._id}')">Editar</button>
                        <button class="delete btn" onclick="openModalDelete('${galeria._id}')">Apagar</button>
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
                    <button class="edit btn" onclick="openModal('${gallery._id}')">Editar</button>
                    <button class="delete btn" onclick="openModalDelete('${gallery._id}')">Apagar</button>
                </div>
            </div>
        </div>
    `
};

// ------------------------------------------------------- Modal -----------------------------------------
async function openModal(id = '') {
    if (id != '') { // update
        document.querySelector('#header-modal').innerText = 'Editar Card';
        document.querySelector('#button-modal').innerText = 'Editar';

        const response = await fetch(`${baseURL}/images/${id}`);
        const gallery = await response.json();

        document.querySelector('#_id').value = gallery._id;
        document.querySelector('#titulo').value = gallery.titulo;
        document.querySelector('#tema').value = gallery.tema;
        document.querySelector('#imagem').value = gallery.imagem;
        document.querySelector('#ano').value = gallery.ano;
        document.querySelector('#descricao').value = gallery.descricao;
    }
    else { // add
        document.querySelector('#header-modal').innerText = 'Adicionar card a galeria';
        document.querySelector('#button-modal').innerText = 'Adicionar';
    }

    const modal = document.querySelector('#overlay');
    modal.style.display = 'flex';
}

async function closeModal() {
    const modal = document.querySelector('#overlay');
    modal.style.display = 'none';

    document.querySelector('#titulo').value = '';
    document.querySelector('#tema').value = '';
    document.querySelector('#imagem').value = '';
    document.querySelector('#ano').value = 0;
    document.querySelector('#descricao').value = '';
}

// ------------------------------------------------ Modal create and update ------------------------------
async function modalFunctions(event) {
    event.preventDefault();

    const id = document.querySelector('#_id').value;
    const title = document.querySelector('#titulo').value;
    const theme = document.querySelector('#tema').value;
    const image = document.querySelector('#imagem').value;
    const year = document.querySelector('#ano').value;
    const description = document.querySelector('#descricao').value;

    const gallery = {
        id,
        title,
        theme,
        image,
        year,
        description
    };

    const modo = id != '';

    const endpoint = baseURL + (modo ? `/edit/${id}` : `/add`);

    const response = await fetch(endpoint, {
        method: modo ? 'put' : 'post',
        headers: {
            "content-Type": "application/json",
        },
        mode: 'cors',
        body: JSON.stringify(gallery),
    });

    const newGallery = await response.json();

    document.location.reload(true);

    // const html = `
    //     <div class="galeriaListaItem" id="galeriaListaItem_${gallery._id}">

    //         <div>
    //             <div class="galeriaListaItem__titulo">${newGallery.titulo}</div>
    //             <div class="galeriaListaItem__tema">${newGallery.tema}</div>
    //             <img class="galeriaListaItem__imagem" src="${newGallery.imagem}" alt="Imagem ${newGallery.titulo}"/>
    //             <div class="galeriaListaItem__ano">${newGallery.ano}</div>
    //             <div class="galeriaListaItem__descr">${newGallery.descricao}</div>
    //             <div class="galeriaListaItem__btns">
    //                 <button class="edit btn" onclick="openModal('${newGallery._id}')">Editar</button>
    //                 <button class="delete btn" onclick="openModalDelete('${newGallery._id}')">Apagar</button>
    //             </div>
    //         </div>
    //     </div>
    // `;

    // if (modo) { // update
    //     document.querySelector(`#galeriaListaItem_${id}`).outerHTML = html;
    // }
    // else { // add
    //     document.querySelector('#galleryList').insertAdjacentHTML('beforeend', html);
    // }

    openMessage();
    closeModal();
}

// ----------------------------------------------- Modal delete ---------------------------------
async function openModalDelete(id) {
    document.querySelector('#overlay-delete').style.display = 'flex';

    const btnDelete = document.querySelector('.btns_yes');

    btnDelete.addEventListener('click', function() {
        deleteGallery(id);
    })
}

async function closeModalDelete() {
    document.querySelector('#overlay-delete').style.display = 'none';
}

async function deleteGallery(id) {
    const response = await fetch(`${baseURL}/delete/${id}`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    });

    document.querySelector('#galleryList').innerHTML = '';

    document.location.reload(true);
    openMessage();
    closeModalDelete();
    findAllGalleries();
}

// --------------------------------------------- Alerts -----------------------------------------
let seconds;
let timer;

function openMessage() {
    const alert = document.querySelector('#alert');
    alert.style.display = 'flex';

    seconds = 0;
    timer = setInterval(function() {
        seconds++;

        if (seconds == 5) {
            closeMessage();
        }
    }, 1000);
}

function closeMessage() {
    clearInterval(timer);
    const alert = document.querySelector('#alert');
    alert.style.display = 'none';
}