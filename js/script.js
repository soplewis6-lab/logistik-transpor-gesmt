document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (ham && menu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('active');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('active');
      menu.classList.remove('open');
    }));
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  let counted = false;
  const counters = document.querySelectorAll('.num[data-target]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(c => {
            const target = +c.dataset.target;
            const span = c.querySelector('span');
            if (!span) return;
            const step = target / (1800 / 16);
            let cur = 0;
            const tick = () => {
              cur += step;
              if (cur < target) { span.textContent = Math.floor(cur); requestAnimationFrame(tick); }
              else span.textContent = target;
            };
            tick();
          });
        }
      });
    }, { threshold: 0.4 });
    cObs.observe(counters[0].closest('.stat-box') || counters[0]);
  }

  const items = document.querySelectorAll('.port-item');
  const portImg = document.getElementById('portImg');
  if (items.length && portImg) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const src = item.dataset.img;
        if (src) {
          portImg.style.opacity = '0';
          setTimeout(() => { portImg.src = src; portImg.style.opacity = '1'; }, 200);
        }
      });
    });
  }

  const t = (k) => (window.LTG && window.LTG.t) ? window.LTG.t(k) : k;

  const trackForm = document.getElementById('trackForm');
  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const num = document.getElementById('trackNum').value.trim();
      const result = document.getElementById('trackResult');
      const title = document.getElementById('trackStatusTitle');
      const text = document.getElementById('trackStatusText');
      const tl = document.getElementById('trackTimeline');
      if (!num) return;
      title.textContent = t('ts_looking') + ' ' + num + '...';
      text.textContent = t('ts_wait');
      result.style.display = 'block';
      tl.innerHTML = '';
      setTimeout(() => {
        const modes = [
          { title: t('ts_transit'), desc: t('ts_transit_d') },
          { title: t('ts_hub'), desc: t('ts_hub_d') },
          { title: t('ts_out'), desc: t('ts_out_d') },
          { title: t('ts_done'), desc: t('ts_done_d') }
        ];
        const idx = Math.floor(Math.random() * modes.length);
        const m = modes[idx];
        title.textContent = m.title + ' — ' + num;
        text.textContent = m.desc;
        const steps = [
          { h: t('ts_placed'), p: t('ts_placed_d'), d: '18.07.2026' },
          { h: t('ts_pickup'), p: t('ts_pickup_d'), d: '19.07.2026' },
          { h: t('ts_transit_s'), p: t('ts_transit_sd'), d: '20.07.2026' },
          { h: t('ts_out_s'), p: t('ts_out_sd'), d: '22.07.2026' },
          { h: t('ts_del'), p: t('ts_del_d'), d: '23.07.2026' }
        ];
        const activeAt = Math.min(idx + 1, steps.length - 1);
        tl.innerHTML = steps.map((s, i) => {
          let cls = i < activeAt ? 'done' : '';
          if (i === activeAt) cls = 'active done';
          return `<div class="tl-item ${cls}"><h4>${s.h}</h4><p>${s.p}</p><span class="date">${i <= activeAt ? s.d : '—'}</span></div>`;
        }).join('');
      }, 1100);
    });
  }

  const cForm = document.getElementById('contactForm');
  if (cForm) {
    cForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const phone = (document.getElementById('cPhone') || {}).value || '';
      const service = (document.getElementById('cService') || {}).value || '';
      const message = document.getElementById('cMsg').value.trim();
      const msg = document.getElementById('formMsg');
      msg.className = 'form-msg';
      msg.textContent = t('form_sending');

      // Open Gmail compose with the message
      const subject = encodeURIComponent('Kontakt — ' + name + (service ? ' / ' + service : ''));
      const body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nService: ' + service + '\n\n' + message
      );
      const gmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=logistiktransportgesamt@gmail.com&su=' + subject + '&body=' + body;
      window.open(gmail, '_blank');

      setTimeout(() => {
        msg.className = 'form-msg ok';
        msg.textContent = t('form_thanks') + ' ' + name + '! ' + t('form_sent');
        cForm.reset();
      }, 800);
    });
  }

  const fn = document.getElementById('footerNews');
  if (fn) {
    fn.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = fn.querySelector('button');
      const email = fn.querySelector('input').value.trim();
      const subject = encodeURIComponent('Newsletter subscription');
      const body = encodeURIComponent('Please subscribe: ' + email);
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=logistiktransportgesamt@gmail.com&su=' + subject + '&body=' + body, '_blank');
      btn.textContent = 'OK';
      fn.reset();
      setTimeout(() => { btn.textContent = 'Go'; }, 2000);
    });
  }
});
