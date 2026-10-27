// Loja ChaparralRJ — versão de demonstração estática (GitHub Pages).
// Produtos copiados da loja local (produtos.js). A compra e o pagamento acontecem na loja oficial (endereco-loja.js).
const DISCORD = 'https://discord.gg/Wx2dg5drwc';
const PRODUTOS = window.PRODUTOS || [];

const brl = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const foto = p => p.fotos && p.fotos.length ? 'fotos/' + p.fotos[0] : '../img/logo.png';
const CATEGORIAS = [...new Set(PRODUTOS.map(p => p.cat))];

const oficial = q => (window.ENDERECO_LOJA || 'https://discord.gg/Wx2dg5drwc') + (q && window.ENDERECO_LOJA ? '?' + q : '');
function card(p) {
  return `<a class="produto-card" href="produto.html?id=${p.id}">
    <div class="foto"><img src="${foto(p)}" alt="${esc(p.nome)}" loading="lazy"></div>
    <div class="info"><span class="tag">${esc(p.cat)}${p.sub ? ' · ' + esc(p.sub) : ''}</span><h3>${esc(p.nome)}</h3><span class="preco">${brl(p.preco)}</span></div>
  </a>`;
}

// Mesma regra dos links do site: ?busca= primeiro (nome do produto), ?categoria= como reserva.
function paginaLista() {
  const filtros = document.getElementById('filtros'), grade = document.getElementById('produtos'), busca = document.getElementById('busca');
  const q = new URLSearchParams(location.search);
  let atual = '', termo = '';
  const acharCat = c => { const n = norm(c); return CATEGORIAS.find(k => norm(k) === n) || CATEGORIAS.find(k => norm(k).includes(n) || n.includes(norm(k))) || ''; };
  if (q.get('busca') && PRODUTOS.some(p => norm(p.nome).includes(norm(q.get('busca'))))) termo = q.get('busca');
  else if (q.get('categoria')) atual = acharCat(q.get('categoria'));
  busca.value = termo;
  function render() {
    filtros.innerHTML = [['', 'Tudo'], ...CATEGORIAS.map(c => [c, c])]
      .map(([k, v]) => `<button type="button" data-cat="${esc(k)}" class="${k === atual ? 'ativo' : ''}">${esc(v)}</button>`).join('');
    const lista = PRODUTOS.filter(p => (!atual || p.cat === atual) && (!termo || norm(p.nome + ' ' + p.desc).includes(norm(termo))));
    grade.innerHTML = lista.length ? lista.map(card).join('') : '<div class="vazio">Nenhum produto encontrado.</div>';
  }
  filtros.addEventListener('click', e => { const b = e.target.closest('button[data-cat]'); if (!b) return; atual = b.dataset.cat; termo = ''; busca.value = ''; render(); });
  busca.addEventListener('input', () => { termo = busca.value; atual = ''; render(); });
  render();
}

function paginaProduto() {
  const p = PRODUTOS.find(x => x.id === Number(new URLSearchParams(location.search).get('id')));
  const box = document.getElementById('produto');
  if (!p) { box.innerHTML = '<div class="vazio">Produto não encontrado. <a href="index.html">Ver produtos →</a></div>'; return; }
  document.title = p.nome + ' — Loja ChaparralRJ';
  const voltar = document.getElementById('voltar');
  voltar.textContent = '← ' + p.cat; voltar.href = 'index.html?categoria=' + encodeURIComponent(p.cat);
  const fotos = p.fotos.length ? p.fotos.map(f => 'fotos/' + f) : ['../img/logo.png'];
  box.innerHTML = `
    <div><div class="foto-grande"><img id="foto-principal" src="${fotos[0]}" alt="${esc(p.nome)}"></div>
      ${fotos.length > 1 ? `<div class="miniaturas">${fotos.map((f, i) => `<button type="button" data-src="${f}" class="${i ? '' : 'ativo'}"><img src="${f}" alt=""></button>`).join('')}</div>` : ''}</div>
    <div>
      <span class="eyebrow">${esc(p.cat)}${p.sub ? ' // ' + esc(p.sub) : ''}</span>
      <h1>${esc(p.nome)}</h1>
      <div class="preco">${brl(p.preco)}</div>
      <div class="desc">${esc(p.desc).replace(/\n/g, '<br>')}</div>
      <div class="comprar">
        <a class="btn btn-loja btn-grande" href="${oficial('busca=' + encodeURIComponent(p.nome))}" target="_blank" rel="noopener">Comprar na loja oficial →</a>
      </div>
      <ul class="vantagens"><li><b>Pagamento seguro na loja oficial.</b> Depois de pago, o item cai direto no seu personagem.</li><li><b>Dúvidas?</b> Chame a staff no <a href="${DISCORD}" target="_blank" rel="noopener">Discord</a>.</li></ul>
    </div>`;
  box.querySelectorAll('.miniaturas button').forEach(b => b.addEventListener('click', () => {
    document.getElementById('foto-principal').src = b.dataset.src;
    box.querySelectorAll('.miniaturas button').forEach(x => x.classList.toggle('ativo', x === b));
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#link-oficial').forEach(a => a.href = oficial(''));
  const pg = document.body.dataset.page;
  if (pg === 'lista') paginaLista();
  if (pg === 'produto') paginaProduto();
});

// Foto que ainda não subiu para o repositório: mostra a logo no lugar.
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName === 'IMG' && !img.dataset.semFoto) { img.dataset.semFoto = '1'; img.src = '../img/logo.png'; }
}, true);
