// 1. Configurações iniciais de mapa e API
const API_BASE_URL = 'http://localhost:3000/api';
const CURITIBA_COORDS = [-25.4284, -49.2733];

let todosOsLocaisCache = [];

const map = L.map('map').setView(CURITIBA_COORDS, 12);

// Camada padrão do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Força o Leaflet a recalcular o tamanho correto dentro do card Bootstrap
setTimeout(() => map.invalidateSize(), 300);

const markersGroup = L.layerGroup().addTo(map);


// 2. CORREÇÃO DE ACENTUAÇÃO (UTF-8)

function corrigirTexto(str) {
    if (!str || typeof str !== 'string') return '';
    try {
        if (str.includes('Ã') || str.includes('Â')) {
            return decodeURIComponent(escape(str));
        }
    } catch (e) {}
    return str;
}


// 3. ELEMENTOS DO DOM

const listaEcopontos = document.getElementById('lista-ecopontos');
const contadorLocais = document.getElementById('contador-locais');
const botoesCategorias = document.getElementById('botoes-categorias');
const buscaManualInput = document.getElementById('busca-manual-input');
const btnResetarMapa = document.getElementById('btn-resetar-mapa');
const statusModo = document.getElementById('status-modo');

const chatForm = document.getElementById('chat-form');
const perguntaInput = document.getElementById('pergunta-input');
const btnEnviar = document.getElementById('btn-enviar');
const chatBox = document.getElementById('chat-box');

// 4. ÍCONES POR TIPO DE RESÍDUO

function criarIconePersonalizado(tipoResiduo = '') {
    const tipo = tipoResiduo.toLowerCase();
    let cor = '#0b99eb'; // Verde (Recicláveis / Geral)
    let icone = 'bi-recycle';

    if (tipo.includes('mistos') || tipo.includes('pilha') || tipo.includes('bateria')) {
        cor = '#1468e7';
        icone = 'bi-cpu-fill';
    }

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-pin" style="background-color: ${cor};"><i class="bi ${icone}"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
    });
}


// 5. RENDERIZAÇÃO DO MAPA E LISTA
function renderizarNoMapa(locais, ajustarZoom = true) {
    markersGroup.clearLayers();
    listaEcopontos.innerHTML = '';

    if (!locais || locais.length === 0) {
        contadorLocais.textContent = '0';
        listaEcopontos.innerHTML = `
            <li class="list-group-item text-muted text-center py-4">
                Nenhum ponto de coleta encontrado.
            </li>
        `;
        map.setView(CURITIBA_COORDS, 12);
        return;
    }

    contadorLocais.textContent = locais.length;
    const coordenadasValidas = [];

    locais.forEach((local) => {
        let lat = parseFloat(local.latitude);
        let lng = parseFloat(local.longitude);

        // Corrige se latitude e longitude vierem invertidas do banco
        if (lat < -40 && lng > -30) {
            [lat, lng] = [lng, lat];
        }

        if (!isNaN(lat) && !isNaN(lng)) {
            coordenadasValidas.push([lat, lng]);

            const nome = corrigirTexto(local.nome);
            const endereco = corrigirTexto(local.endereco_completo);
            const tipoResiduo = corrigirTexto(local.tipo_residuo);
            const horario = corrigirTexto(local.horario_funcionamento);

            const marker = L.marker([lat, lng], {
                icon: criarIconePersonalizado(tipoResiduo)
            });

            const popupHtml = `
                <div style="min-width: 220px;">
                    <h6 class="fw-bold text-dark mb-1">${nome}</h6>
                    <p class="small text-muted mb-1"><i class="bi bi-geo-alt-fill text-success"></i> ${endereco}</p>
                    ${horario ? `<p class="small text-muted mb-2"><i class="bi bi-clock"></i> ${horario}</p>` : ''}
                    <div class="mb-2">
                        <span class="badge bg-success-subtle text-success border border-success-subtle">
                            Aceita: ${tipoResiduo}
                        </span>
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                       target="_blank" 
                       class="btn btn-sm btn-outline-success w-100">
                       <i class="bi bi-sign-turn-right-fill"></i> Traçar Rota
                    </a>
                </div>
            `;

            marker.bindPopup(popupHtml);
            markersGroup.addLayer(marker);

            // Item na lista lateral
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2';
            li.style.cursor = 'pointer';
            li.innerHTML = `
                <div class="me-2">
                    <div class="fw-semibold text-dark small">${nome}</div>
                    <div class="text-muted" style="font-size: 0.78rem;">Aceita: ${tipoResiduo}</div>
                    ${horario ? `<div class="text-secondary" style="font-size: 0.72rem;"><i class="bi bi-clock"></i> ${horario}</div>` : ''}
                </div>
                <button class="btn btn-sm btn-light text-success border">
                    <i class="bi bi-crosshair"></i>
                </button>
            `;

            li.addEventListener('click', () => {
                map.flyTo([lat, lng], 15, { duration: 0.8 });
                marker.openPopup();
            });

            listaEcopontos.appendChild(li);
        }
    });

    if (ajustarZoom && coordenadasValidas.length > 0) {
        const bounds = L.latLngBounds(coordenadasValidas);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
}


// 6. FILTROS MANUAIS (CATEGORIAS E BUSCA)

function gerarBotoesDeCategorias(locais) {
    const categoriasSet = new Set();

    locais.forEach(local => {
        const tipos = corrigirTexto(local.tipo_residuo);
        if (tipos) {
            tipos.split(',').forEach(item => {
                const limpo = item.trim().toLowerCase();
                if (limpo) categoriasSet.add(limpo);
            });
        }
    });

    botoesCategorias.innerHTML = `
        <button class="btn btn-sm btn-success active text-nowrap" data-categoria="todos">
            <i class="bi bi-globe-americas me-1"></i>Todos (${locais.length})
        </button>
    `;

    categoriasSet.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-success text-nowrap text-capitalize';
        btn.textContent = categoria;

        btn.addEventListener('click', () => {
            botoesCategorias.querySelectorAll('button').forEach(b => {
                b.classList.remove('btn-success', 'active');
                b.classList.add('btn-outline-success');
            });
            btn.classList.replace('btn-outline-success', 'btn-success');
            btn.classList.add('active');

            buscaManualInput.value = '';
            const filtrados = todosOsLocaisCache.filter(local =>
                corrigirTexto(local.tipo_residuo).toLowerCase().includes(categoria)
            );

            atualizarStatusTopo(`Filtro: ${categoria}`, true);
            renderizarNoMapa(filtrados);
        });

        botoesCategorias.appendChild(btn);
    });

    botoesCategorias.querySelector('[data-categoria="todos"]').addEventListener('click', () => {
        resetarParaTodosOsLocais();
    });
}

buscaManualInput.addEventListener('input', (e) => {
    const termo = e.target.value.trim().toLowerCase();
    if (!termo) {
        resetarParaTodosOsLocais();
        return;
    }

    const filtrados = todosOsLocaisCache.filter(local =>
        corrigirTexto(local.nome).toLowerCase().includes(termo) ||
        corrigirTexto(local.tipo_residuo).toLowerCase().includes(termo) ||
        corrigirTexto(local.endereco_completo).toLowerCase().includes(termo)
    );

    atualizarStatusTopo(`Buscando: "${termo}"`, true);
    renderizarNoMapa(filtrados, false);
});

function resetarParaTodosOsLocais() {
    buscaManualInput.value = '';
    botoesCategorias.querySelectorAll('button').forEach(b => {
        b.classList.remove('btn-success', 'active');
        b.classList.add('btn-outline-success');
    });

    const btnTodos = botoesCategorias.querySelector('[data-categoria="todos"]');
    if (btnTodos) {
        btnTodos.classList.replace('btn-outline-success', 'btn-success');
        btnTodos.classList.add('active');
    }

    atualizarStatusTopo('Exibindo todos os locais', false);
    renderizarNoMapa(todosOsLocaisCache);
}

function atualizarStatusTopo(texto, mostrarBotaoReset) {
    statusModo.innerHTML = `<i class="bi bi-funnel-fill me-1"></i> ${texto}`;
    btnResetarMapa.classList.toggle('d-none', !mostrarBotaoReset);
}

btnResetarMapa.addEventListener('click', resetarParaTodosOsLocais);


// 7. CARREGAMENTO INICIAL (GET /api/ecopontos)

async function carregarEcopontosIniciais() {
    try {
        const response = await fetch(`${API_BASE_URL}/ecopontos`);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        todosOsLocaisCache = Array.isArray(data) ? data : (data.locais || data.ecopontos || []);

        gerarBotoesDeCategorias(todosOsLocaisCache);
        renderizarNoMapa(todosOsLocaisCache);
    } catch (error) {
        console.error('Erro ao carregar pontos:', error);
    }
}


// 8. CHAT COM ASSISTENTE IA (POST /api/assistente)

function adicionarMensagemChat(texto, remetente, categoria = null) {
    const div = document.createElement('div');
    div.className = remetente === 'user' ? 'msg-user' : 'msg-ai';

    let conteudoHtml = `<div>${corrigirTexto(texto)}</div>`;
    if (categoria) {
        const catTexto = Array.isArray(categoria) ? categoria.join(', ') : categoria;
        conteudoHtml += `
            <div class="mt-2 pt-1 border-top border-secondary-subtle small text-success fw-semibold">
                <i class="bi bi-check2-circle me-1"></i>Filtro aplicado: ${corrigirTexto(String(catTexto))}
            </div>
        `;
    }

    div.innerHTML = conteudoHtml;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pergunta = perguntaInput.value.trim();
    if (!pergunta) return;

    adicionarMensagemChat(pergunta, 'user');
    perguntaInput.value = '';

    perguntaInput.disabled = true;
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    try {
        const response = await fetch(`${API_BASE_URL}/assistente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pergunta: pergunta })
        });

        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

        const data = await response.json();

        const msgIA = data.mensagem || (data.ia && data.ia.mensagem) || 'Confira no mapa os pontos indicados:';
        const categoriaIA = data.categorias_chave || (data.ia && data.ia.categorias_chave) || null;
        const locaisDaIA = data.locais || data.ecopontos || data.pontos_coleta || [];

        adicionarMensagemChat(msgIA, 'ai', categoriaIA);
        atualizarStatusTopo(`Recomendação da IA (${locaisDaIA.length} locais)`, true);
        renderizarNoMapa(locaisDaIA);

    } catch (error) {
        console.error('Erro no assistente:', error);
        adicionarMensagemChat(' Não foi possível consultar a IA agora. Use os filtros do mapa ao lado.', 'ai');
    } finally {
        perguntaInput.disabled = false;
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<i class="bi bi-send-fill"></i>';
        perguntaInput.focus();
    }
});

document.addEventListener('DOMContentLoaded', carregarEcopontosIniciais);