// inicializando o mapa e o ligando ele ao "div-do-mapa", utilizando as coordenadas de Curitiba e o zoom 13

const map = L.map('div-do-mapa').setView([-25.4284, -49.2733], 13);

// configurando o mapa com o tileLayer do OpenStreetMap, com zoom máximo 19 e atribuição de direitos autorais

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// pin teste
// const marker = L.marker([-25.4284, -49.2733]).addTo(map);
// marker.bindPopup("Ecopontos Curitiba");