// Torna a variável acessível globalmente
let mapa;

//Mapa do patrimônio
document.addEventListener("DOMContentLoaded", () => {
    mapa = L.map("mapaEscola", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 3,
        zoom: 0,
        zoomSnap: 0.5
    });

    const bounds = [[0, 0], [1024, 1024]];
    L.imageOverlay("./assets/imgs/mapaEscola.png", bounds).addTo(mapa);
    mapa.fitBounds(bounds);

    const clusterGroup = L.markerClusterGroup();

    const dadosPatrimonio = [
        { codPat: "332", local: "SALA 10", pos: [0, 0] },
        { codPat: "441", local: "SALA 05", pos: [420, 610] },
        { codPat: "59831", local: "COZINHA", pos: [900, 800] },
        { codPat: "50461", local: "COZINHA", pos: [905, 805] },
        { codPat: "13608", local: "SECRETARIA", pos: [200, 105] },
        { codPat: "30542", local: "SECRETARIA", pos: [105, 110] },
        { codPat: "13379", local: "BANHEIRO", pos: [300, 150] },
    ];

    dadosPatrimonio.forEach((pat) => {
        const marker = L.marker(pat.pos).bindPopup(`<strong>${pat.codPat}</strong><br>${pat.local}`);
        clusterGroup.addLayer(marker);
    });

    mapa.addLayer(clusterGroup);
});


// Modal do mapa patrimônio
const btnAbrir = document.getElementById("abrirMapa");
const modal = document.getElementById("modalMapa");
const spanFechar = document.querySelector(".fechar");

btnAbrir.onclick = () => {
    modal.style.display = "block";

    // Redesenha o mapa ao abrir (evita erros de tamanho)
    setTimeout(() => {
        mapa.invalidateSize();
    }, 200);
};

spanFechar.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) { modal.style.display = "none"; }
};