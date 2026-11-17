// Organização do catálogo SÓ NA VITRINE (2026-11-17).
// O produtos.js continua sendo a cópia fiel da loja oficial e pode ser gerado de novo à vontade:
// este arquivo roda depois dele e só muda como os produtos aparecem aqui.
// O nome original fica em p.nomeOficial, que é o que o botão "Comprar" procura na loja oficial.
(function () {
  const P = window.PRODUTOS || [];
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  // Ordem das categorias nos filtros.
  window.ORDEM_CATEGORIAS = ['Vips', 'Salários VIP', 'Coins', 'Carros', 'Motos', 'Pesados', 'Aéreos e barcos', 'Imóveis', 'Favelas', 'Extras'];
  // Nomes usados nos links do site que não batem com a categoria daqui.
  window.APELIDOS_CATEGORIA = { vip: 'Vips', imobiliaria: 'Imóveis', veiculos: 'Carros', moto: 'Motos' };

  // Nomes corrigidos (só a exibição muda).
  const NOMES = {
    'gauntlet2': 'Gauntlet 2', 'fmj': 'FMJ', 'bjxl': 'BJXL', 'xa21': 'XA21', 'rapidgt gt2': 'Rapid GT2',
    'alpha romeu giulia': 'Alfa Romeo Giulia', 'mercedez bens e63 amg': 'Mercedes-Benz E63 AMG',
    'raptor 4 x 4': 'Raptor 4x4', 'mercedez benz amg gtr': 'Mercedes-Benz AMG GT R', 'mustang goku': 'Mustang Goku',
    'ford musrang fastback': 'Ford Mustang Fastback', 'subaro impreza': 'Subaru Impreza', 'ducatti gp': 'Ducati GP',
    'dodge charge srt': 'Dodge Charger SRT', 'mercedes-benz amg gt 63': 'Mercedes-Benz AMG GT 63', 'audi rs6': 'Audi RS6',
    'bmw m3 e36': 'BMW M3 E36', 'bmw m4 gts': 'BMW M4 GTS', 'bmw i8': 'BMW i8', 'bmw s1000 rr': 'BMW S1000 RR',
    'bmw r1250': 'BMW R1250', 'volvo vnl780': 'Volvo VNL 780', 'cuban800': 'Cuban 800', 'nissan silvia s15': 'Nissan Silvia S15',
    'blacklist': 'Blacklist', 'jbl boombox': 'JBL Boombox', 'removerban': 'Remover ban', 'vagas de garagens': 'Vaga de garagem extra',
    '3 coins': 'Pacote 3 Coins'
  };

  // Veículos que ficavam misturados em "Carros".
  const PESADOS = /caminh|kenworth|volvo vnl|actros|pounder|terbyte/;
  const AEREOS = /havok|buzzard|maverick|volatus|dodo|cuban|swift|luxor|jetmax/;

  // Descrições que na loja estão vazias ou só repetem o nome/um rótulo.
  const descRuim = p => { const d = norm(p.desc); return !d || d.length < 6 || ['vip', 'vips'].includes(d) || d === norm(p.nome) || d.startsWith('teste') || d.startsWith('mercedez bens'); };
  const capitalizar = s => s === s.toUpperCase() && /[A-Z]{4}/.test(s) ? s.charAt(0) + s.slice(1).toLowerCase() : s;

  P.forEach(p => {
    p.nomeOficial = p.nome;
    p.catOficial = p.cat;
    const n = norm(p.nome);
    p.nome = (NOMES[n] || p.nome).replace(/^Salario /, 'Salário ').replace(/^Pacote ([\d.]+) coins$/i, 'Pacote $1 Coins');

    // Categoria
    if (p.cat === 'Carros' || p.cat === 'Veiculos') {
      if (norm(p.sub) === 'moto') p.cat = 'Motos';
      else if (PESADOS.test(n)) p.cat = 'Pesados';
      else if (AEREOS.test(n)) p.cat = 'Aéreos e barcos';
      else p.cat = 'Carros';
      p.sub = '';
    } else if (p.cat === 'Extras') {
      const s = norm(p.sub);
      if (s === 'coins') { p.cat = 'Coins'; p.sub = ''; }
      else if (s === 'vipssalarios') { p.cat = 'Salários VIP'; p.sub = ''; }
      else if (s === 'ids') p.sub = 'IDs';
    }

    // Descrição
    if (descRuim(p)) {
      if (p.cat === 'Carros') p.desc = `${p.nome} para o seu personagem. Depois de pago, o veículo é liberado para você na cidade.`;
      else if (p.cat === 'Motos') p.desc = `Moto ${p.nome} para o seu personagem. Depois de pago, ela é liberada para você na cidade.`;
      else if (p.cat === 'Pesados') p.desc = `${p.nome}, veículo pesado para trabalho e transporte na cidade. Depois de pago, ele é liberado para você.`;
      else if (p.cat === 'Aéreos e barcos') p.desc = `${p.nome} para circular pela cidade por cima ou pela água. Depois de pago, é liberado para você.`;
      else if (p.cat === 'Coins') { const q = (p.nome.match(/[\d.]+/) || [''])[0]; p.desc = `Este pacote contém ${q} coins.`; }
      else if (p.cat === 'Favelas') p.desc = `${p.nome}. Fale com a staff no Discord para saber o que está incluído.`;
      else if (p.cat === 'Vips') p.desc = 'VIP válido por 30 dias.';
    } else {
      p.desc = capitalizar(p.desc);
    }

    // Selos que saem dos próprios dados (nada inventado).
    const bonus = p.cat === 'Coins' && (p.desc.match(/b[oô]nus de ([\d.]+) coins/i) || [])[1];
    if (bonus) p.selo = `+${bonus} de bônus`;
    else if ((p.cat === 'Vips' || p.cat === 'Salários VIP') && /30 dias/i.test(p.desc)) p.selo = '30 dias';
    if (Number(p.preco) === 0) p.sobConsulta = true;
  });
})();
