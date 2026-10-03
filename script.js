document.querySelectorAll('.flower').forEach(flower => {
  flower.draggable = false;

  flower.addEventListener('pointerdown', e => {
    const startLeft = flower.offsetLeft;
    const startTop  = flower.offsetTop;
    flower.style.left  = startLeft + 'px';
    flower.style.top   = startTop + 'px';
    flower.style.right = 'auto';

    const startX = e.clientX;
    const startY = e.clientY;

    flower.setPointerCapture(e.pointerId);
    flower.classList.add('dragging');

    function onMove(ev) {
      flower.style.left = startLeft + (ev.clientX - startX) + 'px';
      flower.style.top  = startTop  + (ev.clientY - startY) + 'px';
    }

    function onUp() {
      flower.classList.remove('dragging');
      flower.removeEventListener('pointermove', onMove);
      flower.removeEventListener('pointerup', onUp);
    }

    flower.addEventListener('pointermove', onMove);
    flower.addEventListener('pointerup', onUp);
  });
});

// this javascript is ai generated and will be redone by me soon