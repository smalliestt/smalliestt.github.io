(() => {
  'use strict';
  const root = document.querySelector('[data-chance]');
  const dialog = document.querySelector('[data-wish]');
  if (!root || !dialog) return;
  // Native modal dialogs sit above every page layer, including the custom cursor.
  const cursor = document.querySelector('.cursor');
  const cursorHome = cursor?.parentNode;
  const cursorSibling = cursor?.nextSibling;
  const button = root.querySelector('[data-chance-pull]');
  const label = root.querySelector('[data-chance-label]');
  const status = root.querySelector('[role="status"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const result = dialog.querySelector('[data-wish-result]');
  const art = dialog.querySelector('[data-wish-art]');
  const copy = dialog.querySelector('[data-wish-copy]');
  const envelope = dialog.querySelector('[data-wish-envelope]');
  const intro = dialog.querySelector('[data-wish-intro]');
  const skip = dialog.querySelector('[data-wish-skip]');
  const keep = dialog.querySelector('[data-wish-keep]');
  const name = dialog.querySelector('[data-wish-heading]');
  const portrait = dialog.querySelector('[data-wish-portrait]');
  const rays = dialog.querySelector('.wish__rays');
  const light = dialog.querySelector('[data-wish-light]');
  const sheen = dialog.querySelector('[data-wish-sheen]');
  name.tabIndex = -1;
  const out = getComputedStyle(root).getPropertyValue('--ease-out').trim() || 'cubic-bezier(0.23,1,0.32,1)';
  const people = [
    {name:'Yuna Aoki',image:'img/cc-yuna-character.png',stars:5,interests:'Art · Fashion · Late-night conversations',message:'“I had a feeling we’d meet.”'},
    {name:'Jade Morgan',image:'img/cc-jade-character.png',stars:4,interests:'Fashion · Drawing · Music',message:'“So, what’s on your playlist?”'}
  ];
  let current = -1, count = 0, person = null, busy = false, run = 0;
  let returnFocus = button, timers = [], animations = [], charge = null;
  function cancelMotion() {
    timers.forEach(clearTimeout); timers = [];
    animations.forEach(animation => animation.cancel()); animations = [];
    charge=null;
  }
  function later(fn, ms, token = run) {
    timers.push(setTimeout(() => { if(token===run && dialog.open && busy) fn(); }, ms));
  }
  function motion(element, frames, duration, delay = 0, easing = out) {
    const animation = element.animate(frames,{duration,delay,easing,fill:'both'});
    animations.push(animation);
    return animation;
  }
  function stars(element) {
    const image=document.createElement('img');
    image.src=person.stars===5?'img/cc-stars-five.svg':'img/cc-stars-four.svg';
    image.width=person.stars===5?164:58;
    image.height=person.stars===5?28:10;
    image.alt='';
    element.dataset.rarity=String(person.stars);
    element.replaceChildren(image);
  }
  function updateCard() {
    const portrait = root.querySelector('[data-chance-portrait]');
    portrait.style.backgroundImage = 'url("' + person.image + '")';
    portrait.style.backgroundSize = 'auto 108%';
    portrait.style.backgroundPosition = 'center top';
    portrait.style.backgroundColor = '#333';
    root.dataset.rarity=String(person.stars);
    stars(root.querySelector('.chance__stars'));
    root.querySelector('[data-chance-name]').textContent = person.name;
    root.querySelector('[data-chance-interest]').textContent = person.interests;
    root.querySelector('[data-chance-quote]').textContent = person.message;
    const number = root.querySelector('[data-chance-number]');
    if (number) number.textContent = 'NO. ' + String(count).padStart(3,'0');
    root.classList.add('is-revealed');
    status.textContent = 'You met ' + person.name + '. ' + person.message;
    label.textContent = 'Meet someone else';
  }
  function populate() {
    dialog.querySelector('[data-wish-name]').textContent = person.name.split(' ')[0];
    dialog.querySelector('[data-wish-fullname]').textContent = person.name;
    dialog.dataset.rarity = String(person.stars);
    dialog.querySelector('[data-wish-rarity]').textContent = person.stars + '-star friend.';
    dialog.querySelector('[data-wish-quote]').textContent = person.message;
    dialog.querySelector('[data-wish-interests]').replaceChildren(...person.interests.split(' · ').map(interest=>{
      const chip=document.createElement('span');chip.textContent=interest;return chip;
    }));
    const wishNumber = dialog.querySelector('[data-wish-number]'), wishEdition = dialog.querySelector('[data-wish-edition]');
    if (wishNumber) wishNumber.textContent = String(count).padStart(3,'0');
    if (wishEdition) wishEdition.textContent = String(count).padStart(2,'0') + ' / CHARACTER DISCOVERY';
    dialog.querySelector('[data-wish-portrait]').src = person.image;
    stars(dialog.querySelector('[data-wish-stars]'));
    result.scrollTop=0;
  }
  function reveal(gentle = false) {
    if(!dialog.open || !person)return;
    run+=1;
    dialog.dataset.phase='revealed';
    cancelMotion();
    result.inert=false;
    dialog.removeAttribute('aria-busy');
    dialog.querySelector('[data-wish-announcement]').textContent = person.name + '. ' + person.stars + '-star connection. ' + person.message;
    busy=false;
    updateCard();
    if(gentle && art.animate){
      motion(art,[{opacity:0},{opacity:1}],180);
      motion(copy,[{opacity:0},{opacity:1}],180);
    }
    if(document.activeElement===skip || document.activeElement===dialog) {
      const bounds=keep.getBoundingClientRect();
      (bounds.bottom<=innerHeight && bounds.top>=0 ? keep : name).focus({preventScroll:true});
    }
    skip.hidden=true;
  }
  function openEnvelope() {
    // Restore the capsule's resting geometry before measuring the hand-off.
    if(charge){charge.cancel();charge=null;}
    dialog.dataset.phase='opening';
    const target=art.getBoundingClientRect();
    const source=envelope.getBoundingClientRect();
    const x=source.left+source.width/2-target.left-target.width/2;
    const y=source.top+source.height*.45-target.top-target.height/2;
    const scale=Math.min(envelope.offsetWidth/target.width,envelope.offsetHeight*.88/target.height)*.86;
    const origin='translate('+x+'px,'+y+'px) scale('+scale+')';
    motion(dialog.querySelector('[data-wish-envelope-copy]'),[{opacity:1},{opacity:0}],140);
    motion(dialog.querySelector('[data-wish-waiting]'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(6px)'}],180);
    motion(light,[{opacity:0},{opacity:1,offset:.3},{opacity:0}],850,0,'linear');
    motion(dialog.querySelector('[data-wish-door="top"]'),[
      {transform:'translate(0,0) rotate(0deg)',opacity:1},
      {transform:'translate(-52%,-50%) rotate(-19deg) scale(.94)',opacity:0}
    ],650,60);
    motion(dialog.querySelector('[data-wish-door="bottom"]'),[
      {transform:'translate(0,0) rotate(0deg)',opacity:1},
      {transform:'translate(54%,58%) rotate(17deg) scale(.94)',opacity:0}
    ],650,60);
    motion(art,[{opacity:1},{opacity:1}],1100);
    motion(art,[{transform:origin},{transform:'translate(0,0) scale(1)'}],760,100);
    motion(rays,[{opacity:0},{opacity:1}],320,20);
    motion(rays,[
      {transform:'rotate(-8deg) scale(.86)',easing:out},
      {transform:'rotate(1.2deg) scale(1.035)',offset:.76,easing:out},
      {transform:'rotate(0deg) scale(1)'}
    ],800,20,'linear');
    motion(portrait,[{opacity:0},{opacity:1}],260,150);
    motion(portrait,[
      {transform:'translateY(12px) scale(.97)',easing:out},
      {transform:'translateY(-3px) scale(1.008)',offset:.76,easing:out},
      {transform:'translateY(0) scale(1)'}
    ],650,150,'linear');
    motion(dialog.querySelector('[data-wish-fullname]'),[{opacity:0},{opacity:1}],200,650);
    motion(intro,[{opacity:1},{opacity:0}],250,550);
    motion(copy,[{opacity:0},{opacity:1}],200,410);
    [...copy.children].forEach((child,i)=>{
      if(child===name){
        [...name.children].forEach((line,j)=>motion(line,[
          {opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}
        ],400,490+j*70));
      }else{
        motion(child,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],300,420+i*50);
      }
    });
    later(()=>reveal(),1250);
  }
  function begin() {
    if(busy)return;
    const token=++run;
    cancelMotion();
    current=current<0?Math.floor(Math.random()*people.length):(current+1)%people.length;
    person=people[current];count+=1;busy=true;
    dialog.dataset.phase='waiting';
    dialog.setAttribute('aria-busy','true');
    dialog.querySelector('[data-wish-announcement]').textContent='';
    result.inert=true;skip.hidden=false;
    populate();
    if(!dialog.open){
      returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:button;
      document.documentElement.classList.add('wish-open');
      dialog.showModal();
      if(cursor && document.documentElement.classList.contains('has-cursor')){
        dialog.appendChild(cursor);
        cursor.dataset.state='dot';
      }
    }
    skip.focus({preventScroll:true});
    if(reduced.matches || !envelope.animate){reveal(reduced.matches);return;}
    motion(envelope,[
      {transform:'translateY(18px) rotate(-9deg) scale(.95)',opacity:0},
      {transform:'translateY(0) rotate(-6deg) scale(1)',opacity:1}
    ],350);
    motion(sheen,[{opacity:0},{opacity:.75,offset:.28},{opacity:0}],600,300,'linear');
    motion(sheen.firstElementChild,[
      {transform:'translateX(-180%) rotate(18deg)'},
      {transform:'translateX(440%) rotate(18deg)'}
    ],600,300,'linear');
    later(()=>{
      charge=motion(envelope,[
        {transform:'translateY(0) rotate(-6deg) scale(1)'},
        {transform:'translateY(2px) rotate(-4deg) scale(.965,1.015)',offset:.62},
        {transform:'translateY(0) rotate(-6deg) scale(1)'}
      ],300);
    },740,token);
    motion(dialog.querySelector('[data-wish-waiting]'),[
      {opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}
    ],250,80);
    dialog.querySelectorAll('.wish__typing i').forEach((dot,i)=>{
      motion(dot,[
        {opacity:.35,transform:'translateY(0)'},
        {opacity:1,transform:'translateY(-7px)',offset:.45},
        {opacity:.65,transform:'translateY(0)'}
      ],550,200+i*110);
    });
    later(openEnvelope,1040,token);
  }
  button.addEventListener('click',begin);
  dialog.querySelector('[data-wish-again]').addEventListener('click',begin);
  skip.addEventListener('click',()=>reveal());
  dialog.querySelectorAll('[data-wish-close],[data-wish-keep]').forEach(control=>control.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('close',()=>{
    run+=1;cancelMotion();busy=false;result.inert=true;
    dialog.removeAttribute('aria-busy');
    document.documentElement.classList.remove('wish-open');
    if(cursor && cursorHome && cursor.parentNode===dialog){
      cursorHome.insertBefore(cursor,cursorSibling?.parentNode===cursorHome?cursorSibling:null);
    }
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  });
  reduced.addEventListener('change',()=>{if(reduced.matches && dialog.open && busy)reveal(true);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden && dialog.open && busy)reveal();});
  window.addEventListener('resize',()=>{if(dialog.open && busy)reveal();});
  function warm(){people.forEach(p=>{const image=new Image();image.src=p.image;});}
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){warm();observer.disconnect();}
    },{rootMargin:'500px'});
    observer.observe(root);
  }else warm();
  button.setAttribute('aria-haspopup','dialog');
  button.setAttribute('aria-controls','chit-wish');
  button.disabled=false;
})();
