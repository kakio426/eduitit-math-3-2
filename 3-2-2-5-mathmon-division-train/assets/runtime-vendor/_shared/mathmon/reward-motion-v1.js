/* Generated raster actors move independently of their fixed presentation panel. */
(() => {
 const style=document.createElement('style');
 style.textContent=`
 .reward-motion-scene{position:absolute;inset:0;z-index:30;overflow:hidden;background:#0b1e2c;display:grid;grid-template-rows:20% 60% 20%;place-items:center;padding:12px;color:#fff3cc;isolation:isolate}
 .reward-motion-scene[hidden]{display:none!important}
 .reward-motion-scene p{margin:0;text-align:center;font-size:clamp(16px,1.6vw,24px);font-weight:900;line-height:1.25}
 .reward-motion-theatre{position:relative;width:100%;height:100%;perspective:700px;display:grid;place-items:center}
 .reward-motion-vault{position:relative;width:94%;aspect-ratio:1/1}
 .reward-motion-body{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
 .reward-motion-door{position:absolute;left:8%;top:7%;width:84%;height:86%;object-fit:fill;transform-origin:0% 50%;backface-visibility:hidden}
 .reward-motion-track{position:absolute;left:5%;right:5%;top:76%;height:3px;background:#698595}
 .reward-motion-train{position:absolute;width:96%;height:auto;left:0;bottom:24%;object-fit:contain}
 .reward-motion-stations{position:absolute;inset:80% 3% 0;display:flex;justify-content:space-between;gap:10px;font-size:14px;font-weight:800;color:#c1eaff}
 .reward-motion-stations span{max-width:48%;text-align:center}
 .reward-motion-scene[data-kind=loss] .reward-motion-status{color:#a9dafa}
 `;
 document.head.append(style);
 async function play({panel,kind,assets,from,to,delta=1,special=false}){
  panel.querySelector('.reward-motion-scene')?.remove();
  const scene=document.createElement('section');scene.className='reward-motion-scene';scene.dataset.kind=kind;scene.setAttribute('aria-label',kind==='vault'?'금고 열기':'열차 이동');
  const title=document.createElement('p');title.className='reward-motion-title';title.textContent=kind==='vault'?'금고를 열어요':delta<0?'열차가 잠시 멈춰요':'열차 출발!';
  const theatre=document.createElement('div');theatre.className='reward-motion-theatre';
  const status=document.createElement('p');status.className='reward-motion-status';status.textContent=from;
  scene.append(title,theatre,status);scene.hidden=true;panel.append(scene);
  const img=(name,cls)=>{const e=new Image();e.src=assets[name];e.className=cls;e.alt='';theatre.append(e);return e;};
  let actor,body,frames;
  if(kind==='vault'){
   const cabinet=document.createElement('div');cabinet.className='reward-motion-vault';theatre.append(cabinet);
   body=img('vault','reward-motion-body');actor=img('door','reward-motion-door');cabinet.append(body,actor);
   frames=[{transform:'rotateY(0deg)',offset:0},{transform:'rotateY(0deg)',offset:.23},{transform:'rotateY(-108deg)',offset:.66},{transform:'rotateY(-108deg)',offset:1}];
  }else{
   const track=document.createElement('div');track.className='reward-motion-track';theatre.append(track);
   const stations=document.createElement('div');stations.className='reward-motion-stations';for(const name of [from,to]){const span=document.createElement('span');span.textContent=name;stations.append(span);}theatre.append(stations);
   actor=img('train','reward-motion-train');
   frames=delta<0?[{transform:'translateX(0)'},{transform:'translateX(-12%)',offset:.35},{transform:'translateX(0)'}]:[{transform:'translateX(-115%)',offset:0},{transform:'translateX(-115%)',offset:.10},{transform:'translateX(3%)',offset:.72},{transform:'translateX(3%)',offset:1}];
  }
  await Promise.all([...scene.querySelectorAll('img')].map(i=>i.decode()));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  scene.hidden=false;scene.dataset.phase='start';scene.dataset.startedAt=String(performance.now());
  const duration=3000;
  const animation=actor.animate(reduced?[{...frames.at(-1),offset:0},{...frames.at(-1),offset:1}]:frames,{duration,fill:'forwards',easing:'linear'});
  const arrival=setTimeout(()=>{scene.dataset.phase='settled';title.textContent=kind==='vault'?'보물을 찾았어요':delta<0?'다시 출발할 준비!':'도착!';status.textContent=to;},2200);
  try{await animation.finished;}finally{clearTimeout(arrival);scene.remove();}
 }
 window.MathmonRewardMotion={play};
})();
