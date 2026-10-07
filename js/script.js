window.addEventListener('load', () => {
  const MIN_SPEED = 2;
  const MAX_SPEED = 10;
  const MAX_THROW = 5000;

  const flowers = [...document.querySelectorAll('.flower')].map(el => {
    const r = el.getBoundingClientRect();

    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.right = 'auto';
    el.draggable = false;

    const angle = Math.random() * Math.PI * 2;
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);

    return {
      el,
      x: r.left,
      y: r.top,
      w: r.width,
      h: r.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      angle: 0,
      spin: (Math.random() - 0.5) * 60,
      dragging: false
    };
  });

  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (const f of flowers) {
      f.w = f.el.offsetWidth;
      f.h = f.el.offsetHeight;

      if (!f.dragging) {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.angle += f.spin * dt;

        if (f.x < 0)       { f.x = 0;       f.vx =  Math.abs(f.vx); f.spin = -f.spin; }
        if (f.x + f.w > W) { f.x = W - f.w; f.vx = -Math.abs(f.vx); f.spin = -f.spin; }
        if (f.y < 0)       { f.y = 0;       f.vy =  Math.abs(f.vy); f.spin = -f.spin; }
        if (f.y + f.h > H) { f.y = H - f.h; f.vy = -Math.abs(f.vy); f.spin = -f.spin; }

        const speed = Math.hypot(f.vx, f.vy);
        if (speed > MAX_SPEED) {
          const slow = Math.pow(0.4, dt);
          f.vx *= slow;
          f.vy *= slow;
        }
      }

      f.el.style.transform =
        `translate(${f.x}px, ${f.y}px) rotate(${f.angle}deg)`;
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  for (const f of flowers) {
    f.el.addEventListener('pointerdown', e => {
      f.dragging = true;
      f.el.classList.add('dragging');
      f.el.setPointerCapture(e.pointerId);

      const offsetX = e.clientX - f.x;
      const offsetY = e.clientY - f.y;
      let lastX = e.clientX, lastY = e.clientY, lastT = performance.now();

      function onMove(ev) {
        const t = performance.now();
        const dtMove = Math.max((t - lastT) / 1000, 0.001);

        f.vx = (ev.clientX - lastX) / dtMove;
        f.vy = (ev.clientY - lastY) / dtMove;
        lastX = ev.clientX; lastY = ev.clientY; lastT = t;

        f.x = ev.clientX - offsetX;
        f.y = ev.clientY - offsetY;
      }

      function onUp() {
        f.dragging = false;
        f.el.classList.remove('dragging');

        const speed = Math.hypot(f.vx, f.vy);
        if (speed > MAX_THROW) {
          f.vx *= MAX_THROW / speed;
          f.vy *= MAX_THROW / speed;
        } else if (speed < MIN_SPEED) {
          const a = Math.random() * Math.PI * 2;
          f.vx = Math.cos(a) * MIN_SPEED;
          f.vy = Math.sin(a) * MIN_SPEED;
        }

        f.el.removeEventListener('pointermove', onMove);
        f.el.removeEventListener('pointerup', onUp);
        f.el.removeEventListener('pointercancel', onUp);
      }

      f.el.addEventListener('pointermove', onMove);
      f.el.addEventListener('pointerup', onUp);
      f.el.addEventListener('pointercancel', onUp);
    });
  }
});

let isCardAnimating = false;

async function swapCard(renderNewContent, direction = 1) {
  const cardEl = document.getElementById('project-card');
  if (!cardEl || isCardAnimating) return;
  isCardAnimating = true;

  const d = direction < 0 ? -1 : 1;

  await cardEl.animate([
    { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
    { opacity: 0, transform: `translateX(${-30 * d}px) scale(0.98)`, filter: 'blur(4px)' }
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    fill: 'forwards'
  }).finished;

  renderNewContent(cardEl);

  await cardEl.animate([
    { opacity: 0, transform: `translateX(${30 * d}px) scale(0.98)`, filter: 'blur(4px)' },
    { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' }
  ], {
    duration: 650,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards'
  }).finished;

  cardEl.getAnimations().forEach(a => a.cancel());
  isCardAnimating = false;
}