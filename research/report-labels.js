// Keep the numbered markers on coded images from landing on top of each other on small screens:
// a marker that would overlap an earlier one slides right along its own box.
(() => {
  const fix = () => {
    for (const img of document.querySelectorAll('.coded__img')) {
      const marks = [...img.querySelectorAll('.coded__box b')];
      marks.forEach(b => { b.style.transform = ''; });
      const placed = [];
      for (const b of marks) {
        let r = b.getBoundingClientRect(), dx = 0;
        for (let guard = 0; guard < marks.length; guard++) {
          const hit = placed.find(p => r.left + dx < p.right + 2 && r.right + dx > p.left - 2 && r.top < p.bottom + 1 && r.bottom > p.top - 1);
          if (!hit) break;
          dx = hit.right + 3 - r.left;
        }
        if (dx) b.style.transform = `translateX(${dx}px)`;
        placed.push({ left: r.left + dx, right: r.right + dx, top: r.top, bottom: r.bottom });
      }
    }
  };
  let raf = 0;
  const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fix); };
  addEventListener('resize', queue);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix); else fix();
  addEventListener('load', fix);
})();
