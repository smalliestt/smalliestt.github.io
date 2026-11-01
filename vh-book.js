(() => {
  const book = document.querySelector('[data-menu-book]');
  if (!book) return;
  const stage = book.querySelector('[data-book-stage]');
  const left = book.querySelector('[data-book-left]');
  const right = book.querySelector('[data-book-right]');
  const leaf = book.querySelector('[data-book-leaf]');
  const front = book.querySelector('[data-book-front]');
  const back = book.querySelector('[data-book-back]');
  const count = book.querySelector('[data-book-count]');
  const previous = [...book.querySelectorAll('[data-book-prev]')];
  const next = [...book.querySelectorAll('[data-book-next]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const spreads = [[0,1],[2,3],[4,5],[6,7],[8,0]];
  const names = ['','Cover','Starters and soups','Dishes with rice','Prawns, grill and vegetarian','Curry, noodles and fried rice','Sets, lunch, children and dessert','Drinks','Beer and wine'];
  const cache = new Map();
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-io').trim() || 'cubic-bezier(0.77,0,0.175,1)';
  let index = Math.max(0,Math.min(spreads.length-1,Number(book.dataset.start)||0)), target = index, animation = null, stageMotion = null, ticket = 0, touch = null;
  // closed covers sit centred on a phone; on a desktop they lean right, towards the page edge
  const desk = matchMedia('(min-width: 1000px)');
  const position = value => value === 0 ? `translateX(${desk.matches ? -15 : -25}%)` : value === spreads.length-1 ? `translateX(${desk.matches ? 35 : 25}%)` : 'translateX(0%)';
  // while the book is closed on a desktop, the arrows and hint stay under the cover
  const under = [book.querySelector('.menu-book__bar'), book.querySelector('.menu-book__hint')].filter(Boolean);
  function follow(value) {
    const closed = value === 0 || value === spreads.length-1;
    const dx = desk.matches && closed ? stage.offsetWidth * .10 : 0;
    // a closed cover is drawn larger and tilted (see vh-book.css): drop the controls by what it grows below its box
    const cs = getComputedStyle(book), s = parseFloat(cs.getPropertyValue('--cover-scale')) || 1;
    const a = Math.abs(parseFloat(cs.getPropertyValue('--cover-tilt')) || 0) * Math.PI / 180;
    const h = stage.offsetHeight, w = stage.offsetWidth / 2;
    const grow = Math.max(0, s * (h / 2 * Math.cos(a) + w / 2 * Math.sin(a)) - h / 2);
    // room above the book for the grown cover (used where the menu sits under the title)
    book.style.setProperty('--cover-room', grow.toFixed(1) + 'px');
    const dy = closed ? grow : 0;
    under.forEach(el => { el.style.transform = dx || dy ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : ''; });
  }
  function content(host, page) {
    host.replaceChildren();
    host.hidden = !page;
    if (!page) return;
    const img = new Image(900,1600);
    img.src = `img/vh-figma-${String(page).padStart(2,'0')}.png`;
    img.alt = `Menu page ${page}: ${names[page]}`;
    img.draggable = false;
    host.append(img);
  }
  function preload(page) {
    if (!page) return Promise.resolve();
    if (!cache.has(page)) {
      const img = new Image();
      img.src = `img/vh-figma-${String(page).padStart(2,'0')}.png`;
      cache.set(page, img.decode().catch(() => {}));
    }
    return cache.get(page);
  }
  function render() {
    content(left,spreads[index][0]);content(right,spreads[index][1]);
    book.dataset.state = index === 0 ? 'cover' : index === spreads.length-1 ? 'back' : 'open';
    stage.style.transform = position(index);
    follow(index);
    previous.forEach(button => button.disabled = index === 0);
    next.forEach(button => button.disabled = index === spreads.length-1);
    count.textContent = spreads[index].filter(Boolean).map(page => String(page).padStart(2,'0')).join('—') + ' / 08';
    next.forEach(button => button.setAttribute('aria-label',index === 0 ? 'Open the menu' : 'Next menu pages'));
    book.querySelector('.menu-book__hint').textContent = index === 0 ? 'Open the cover to explore the menu' : 'Turn a page · swipe or use the arrows';
  }
  function finish() {
    if (animation) { animation.onfinish = null;animation.cancel();animation = null; }
    if (stageMotion) { stageMotion.cancel();stageMotion = null; }
    index = target;leaf.hidden = true;render();
  }
  async function turn(direction, immediate = false) {
    const token = ++ticket;
    if (animation) finish();
    const from = index;
    const to = Math.max(0,Math.min(spreads.length-1,from+direction));
    if (to === from) return;
    await Promise.all([...spreads[from],...spreads[to]].map(preload));
    if (token !== ticket) return;
    target = to;
    if (immediate || reduce.matches || !leaf.animate) { finish();return; }
    // The right-hand leaf becomes the next left page as it crosses the spine.
    if (direction > 0) {
      content(left,spreads[from][0]);content(right,spreads[to][1]);
      content(front,spreads[from][1]);content(back,spreads[to][0]);
    } else {
      content(left,spreads[to][0]);content(right,spreads[from][1]);
      content(front,spreads[to][1]);content(back,spreads[from][0]);
    }
    leaf.hidden = false;
    book.dataset.state = 'turning';
    follow(to);
    stageMotion = stage.animate([{transform:position(from)},{transform:position(to)}],{duration:600,easing:ease,fill:'both'});
    animation = leaf.animate([
      {transform:`rotateY(${direction > 0 ? 0 : -180}deg)`},
      {transform:`rotateY(${direction > 0 ? -180 : 0}deg)`}
    ], {duration:600,easing:ease,fill:'both'});
    animation.onfinish = finish;
  }
  previous.forEach(button => button.addEventListener('click',event => turn(-1,event.detail===0)));
  next.forEach(button => button.addEventListener('click',event => turn(1,event.detail===0)));
  stage.addEventListener('pointerdown',event => {
    if (event.pointerType !== 'mouse') touch={x:event.clientX,y:event.clientY};
  },{passive:true});
  stage.addEventListener('pointerup',event => {
    if (!touch) return;
    const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;
    if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)*1.4) {
      suppressClick=true;turn(dx<0?1:-1);
    }
  });
  let suppressClick=false;
  stage.addEventListener('click',event => {
    if (suppressClick) {event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}
  },true);
  stage.addEventListener('pointercancel',()=>{touch=null;suppressClick=false;});
  reduce.addEventListener('change',()=>{if(reduce.matches && animation)finish();});
  desk.addEventListener('change',()=>{if(!animation)stage.style.transform=position(index);follow(index);});
  addEventListener('resize',()=>follow(animation?target:index));
  document.addEventListener('visibilitychange',()=>{if(document.hidden && animation)finish();});
  render();
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){[1,2,3].forEach(preload);observer.disconnect();}
  },{rootMargin:'400px'});
  observer.observe(book);
})();
