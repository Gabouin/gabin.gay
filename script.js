// Wait until images are loaded so their sizes are known
window.addEventListener('load', () => {
  const MIN_SPEED = 10;   // pixels per second
  const MAX_SPEED = 50;
  const MAX_THROW = 9000;  // max speed when you throw a flower

  const flowers = [...document.querySelectorAll('.flower')].map(el => {
    // Read the starting position from your CSS
    const r = el.getBoundingClientRect();

    // Switch to fixed positioning, moved with transform
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.right = 'auto';
    el.draggable = false;

    // Random direction and speed
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
      spin: (Math.random() - 0.5) * 60, // degrees per second
      dragging: false
    };
  });

  // ---------- Animation loop ----------
  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // seconds since last frame
    last = now;
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (const f of flowers) {
      // Sizes change with the screen width, so re-read them every frame
      f.w = f.el.offsetWidth;
      f.h = f.el.offsetHeight;

      if (!f.dragging) {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.angle += f.spin * dt;

        // Bounce on left / right edges
        if (f.x < 0)       { f.x = 0;       f.vx =  Math.abs(f.vx); f.spin = -f.spin; }
        if (f.x + f.w > W) { f.x = W - f.w; f.vx = -Math.abs(f.vx); f.spin = -f.spin; }

        // Bounce on top / bottom edges
        if (f.y < 0)       { f.y = 0;       f.vy =  Math.abs(f.vy); f.spin = -f.spin; }
        if (f.y + f.h > H) { f.y = H - f.h; f.vy = -Math.abs(f.vy); f.spin = -f.spin; }

        // After a throw, slowly calm back down to normal speed
        const speed = Math.hypot(f.vx, f.vy);
        if (speed > MAX_SPEED) {
          const slow = Math.pow(0.4, dt); // friction
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

  // ---------- Dragging and throwing ----------
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

        // Track mouse speed so we can throw the flower
        f.vx = (ev.clientX - lastX) / dtMove;
        f.vy = (ev.clientY - lastY) / dtMove;
        lastX = ev.clientX; lastY = ev.clientY; lastT = t;

        f.x = ev.clientX - offsetX;
        f.y = ev.clientY - offsetY;
      }

      function onUp() {
        f.dragging = false;
        f.el.classList.remove('dragging');

        // Limit throw speed, and give a gentle push if it was just dropped
        let speed = Math.hypot(f.vx, f.vy);
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
      }

      f.el.addEventListener('pointermove', onMove);
      f.el.addEventListener('pointerup', onUp);
    });
  }
});