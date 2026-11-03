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

  document.querySelectorAll('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener noreferrer'));
});
