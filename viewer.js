'use strict';
const $=id=>document.getElementById(id),stage=$('stage'),number=$('number');
const config=JSON.parse(document.getElementById('manual-config').textContent);
let pdf=null,current=1,zoom=1,revision=0,renderTask=null;
function controls(){number.value=current;$('prev').disabled=!pdf||current===1;$('next').disabled=!pdf||current===pdf.numPages;number.disabled=!pdf;$('minus').disabled=!pdf||zoom<=1;$('plus').disabled=!pdf||zoom>=3;$('fit').disabled=!pdf;$('fit').textContent=`${Math.round(zoom*100)}%`;}
function failure(){ $('loading').hidden=true;$('error').hidden=false;stage.setAttribute('aria-busy','false');}
async function render(){
 if(!pdf)return;
 const own=++revision;
 if(renderTask){renderTask.cancel();renderTask=null;}
 $('error').hidden=true;$('loading').hidden=false;stage.setAttribute('aria-busy','true');
 try{
  const p=await pdf.getPage(current);if(own!==revision)return;
  const natural=p.getViewport({scale:1}),styles=getComputedStyle(stage);
  const w=stage.clientWidth-parseFloat(styles.paddingLeft)-parseFloat(styles.paddingRight),h=stage.clientHeight-parseFloat(styles.paddingTop)-parseFloat(styles.paddingBottom);
  const scale=Math.max(.05,Math.min(w/natural.width,h/natural.height))*zoom,view=p.getViewport({scale});
  const output=Math.min(window.devicePixelRatio||1,2,4096/Math.max(view.width,view.height));
  const canvas=document.createElement('canvas');canvas.id='page';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`${config.title}, página ${current} de ${pdf.numPages}`);
  canvas.width=Math.ceil(view.width*output);canvas.height=Math.ceil(view.height*output);canvas.style.width=`${view.width}px`;canvas.style.height=`${view.height}px`;
  renderTask=p.render({canvasContext:canvas.getContext('2d'),viewport:view,transform:[output,0,0,output,0,0]});await renderTask.promise;
  if(own!==revision)return;
  $('page').replaceWith(canvas);$('loading').hidden=true;stage.setAttribute('aria-busy','false');renderTask=null;
  $('announcement').textContent=`Página ${current} de ${pdf.numPages}`;
 }catch(e){if(own===revision&&e.name!=='RenderingCancelledException'){console.error(e);failure();}}
}
function show(n){if(!pdf)return;current=Math.max(1,Math.min(pdf.numPages,n));controls();stage.scrollTo(0,0);render();}
function changeZoom(delta){zoom=Math.max(1,Math.min(3,Math.round((zoom+delta)*100)/100));controls();render();}
$('prev').onclick=()=>show(current-1);$('next').onclick=()=>show(current+1);number.onchange=()=>show(Number(number.value));$('minus').onclick=()=>changeZoom(-.25);$('plus').onclick=()=>changeZoom(.25);$('fit').onclick=()=>{zoom=1;controls();stage.scrollTo(0,0);render();};
$('retry').onclick=()=>pdf?render():location.reload();
document.addEventListener('keydown',e=>{if(e.target.matches('select,input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}});
$('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.fullscreenEnabled)await $('viewer').requestFullscreen();else window.open(location.href,'_blank','noopener')}catch{window.open(location.href,'_blank','noopener')}};
document.addEventListener('fullscreenchange',()=>{$('full').setAttribute('aria-label',document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa');});
let resizeTimer;new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(render,120)}).observe(stage);
let touch=null;stage.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});stage.addEventListener('touchend',e=>{if(!touch||zoom!==1)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1));touch=null},{passive:true});
controls();
(async()=>{try{
 const base='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/';
 const lib=await import(base+'legacy/build/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=base+'legacy/build/pdf.worker.mjs';
 pdf=await lib.getDocument({url:new URL(config.file,location.href).href,cMapUrl:base+'cmaps/',cMapPacked:true,standardFontDataUrl:base+'standard_fonts/',wasmUrl:base+'wasm/'}).promise;
 for(let n=1;n<=pdf.numPages;n++){const o=document.createElement('option');o.value=n;o.textContent=n;number.append(o);}
 $('total').textContent=`de ${pdf.numPages}`;show(1);
}catch(e){console.error(e);failure();}})();
