(() => {
  'use strict';
  const scene=document.querySelector('#emeditation');
  const fan=scene?.querySelector('[data-phones]');
  const phones=fan?[...fan.querySelectorAll('.phone')]:[];
  if(phones.length!==5 || !phones[0].animate)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const anchor=document.createElement('span');
  anchor.className='em-fan-anchor';
  anchor.setAttribute('aria-hidden','true');
  fan.append(anchor);
  const ease=getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'cubic-bezier(0.23,1,0.32,1)';
  const total=1360;
  const stages=[[.24,1],[.12,.82],[0,.62],[.12,.82],[.24,1]];
  let animations=[],raf=0,last=-1,warmed=false,layoutWidth=innerWidth;
  const clamp=n=>Math.max(0,Math.min(1,n));
  function clear(){
    animations.forEach(animation=>animation.cancel());
    animations=[];
    last=-1;
  }
  function build(){
    if(raf)cancelAnimationFrame(raf);
    raf=0;
    layoutWidth=innerWidth;
    clear();
    anchor.style.top=phones[2].offsetTop+'px';
    if(reduced.matches){
      scene.dataset.fanProgress='1';
      return;
    }
    const centre=phones[2].offsetLeft+phones[2].offsetWidth/2;
    phones.forEach((phone,index)=>{
      const [start,end]=stages[index];
      const angle=getComputedStyle(phone).getPropertyValue('--r').trim() || '0deg';
      const x=(centre-phone.offsetLeft-phone.offsetWidth/2)*.72;
      const y=Math.min(220,phone.offsetHeight*.56);
      const slide=phone.animate([
        {transform:'translate3d('+x+'px,'+y+'px,0) rotate(0deg) scale(.96)'},
        {transform:'translate3d(0,0,0) rotate('+angle+') scale(1)'}
      ],{duration:(end-start)*total,delay:start*total,easing:ease,fill:'both'});
      // Become solid before overlapping: translucent app screens would double the UI.
      const fade=phone.animate([{opacity:0},{opacity:1}],{duration:180,delay:start*total,easing:ease,fill:'both'});
      for(const animation of [slide,fade]){
        animation.pause();
        animation.currentTime=0;
        animations.push(animation);
      }
    });
    render();
  }
  function render(){
    raf=0;
    if(reduced.matches || !animations.length)return;
    // The anchor stays in the original fan layout, independent of phone transforms.
    const top=anchor.getBoundingClientRect().top;
    if(!warmed && top<innerHeight*2 && top>-innerHeight){
      warmed=true;
      fan.querySelectorAll('img').forEach(image=>{image.loading='eager';});
    }
    const desktop=innerWidth>=1000;
    const start=innerHeight*(desktop?.7:.42),end=innerHeight*(desktop?.16:.08);
    const progress=clamp((start-top)/(start-end));
    if(Math.abs(progress-last)<.0001)return;
    last=progress;
    animations.forEach(animation=>{animation.currentTime=progress*total;});
    scene.dataset.fanProgress=progress.toFixed(3);
  }
  function request(){if(!raf)raf=requestAnimationFrame(render);}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',()=>{if(innerWidth!==layoutWidth)build();else request();},{passive:true});
  reduced.addEventListener('change',build);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)request();});
  build();
})();
