document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  /* Barra de progresso de leitura */
  const bar = document.getElementById('progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* Revelação suave dos blocos ao rolar */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Vídeo leve: o player só carrega ao clicar */
  const facade = document.getElementById('facade');
  facade.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${facade.dataset.id}?autoplay=1&rel=0`;
    f.title = 'Vídeo de apresentação da IPB Alvorada';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    facade.replaceWith(f);
  });

  /* Mapa leve: o Google Maps só carrega ao clicar */
  const mapBtn = document.getElementById('mapFacade');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(mapBtn.dataset.q) + '&z=17&output=embed';
      f.title = 'Mapa com a localização da IPB Alvorada';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      mapBtn.replaceWith(f);
    });
  }

  /* Horário de funcionamento: destaca hoje e mostra se está aberto agora */
  const hours = document.getElementById('hours');
  if (hours) {
    const rows = [...hours.querySelectorAll('[data-dia]')];
    const now = document.getElementById('hoursNow');
    const nowTitle = document.getElementById('nowTitle');
    const nowSub = document.getElementById('nowSub');
    const nowBar = document.getElementById('nowBar');
    const nomes = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
    const faixas = row => row.dataset.h.split(',').map(f => f.split('-').map(toMin));

    const atualizar = () => {
      const d = new Date();
      const dia = d.getDay();
      const min = d.getHours() * 60 + d.getMinutes();
      rows.forEach(r => r.classList.toggle('hoje', Number(r.dataset.dia) === dia));

      const hoje = rows.find(r => Number(r.dataset.dia) === dia);
      const faixasHoje = hoje ? faixas(hoje) : [];
      const aberta = faixasHoje.find(([a, b]) => min >= a && min < b);

      if (aberta) {
        const [a, b] = aberta;
        now.className = 'now open';
        nowTitle.textContent = 'Aberto agora';
        nowSub.textContent = 'Hoje, até as ' + fmt(b);
        nowBar.style.setProperty('--p', ((min - a) / (b - a)).toFixed(3));
      } else {
        const proxima = faixasHoje.find(([a]) => a > min);
        now.className = 'now';
        nowTitle.textContent = 'Fechado agora';
        if (proxima) {
          nowSub.textContent = 'Abre hoje às ' + fmt(proxima[0]);
        } else {
          let achou = false;
          for (let i = 1; i <= 7 && !achou; i++) {
            const alvo = rows.find(r => Number(r.dataset.dia) === (dia + i) % 7);
            if (alvo) {
              nowSub.textContent = 'Abre ' + (i === 1 ? 'amanhã' : nomes[(dia + i) % 7]) + ' às ' + fmt(faixas(alvo)[0][0]);
              achou = true;
            }
          }
        }
      }
      now.hidden = false;
    };

    atualizar();
    setInterval(atualizar, 30000);
  }

  /* Menu do celular: abre e fecha o painel de links */
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menuBtn');
  if (header && menuBtn) {
    const icon = menuBtn.querySelector('i');
    const setMenu = (aberto) => {
      header.classList.toggle('menu-open', aberto);
      menuBtn.setAttribute('aria-expanded', String(aberto));
      menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      icon.className = aberto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };
    menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    addEventListener('resize', () => { if (innerWidth > 720) setMenu(false); });
  }

  document.querySelectorAll('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener noreferrer'));
});
