// PROPOSAL ONLY: showCpu capability added for the LusoSol memory-only indicator.
// Orbit control adapted from bratuga/iot-vmc-controler main 754e3b0.
function createOrbitPower(sendPower){
 const railPower=document.getElementById('railPower');
 railPower.innerHTML=`<span class="rail-power-track" aria-hidden="true"></span><span class="rail-power-ring" aria-hidden="true"></span><span class="rail-power-progress" aria-hidden="true"></span>
  <span class="rail-power-metrics" id="railPowerMetrics" aria-hidden="true" hidden>
   <span><svg class="rail-power-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M8 2v3m4-3v3m4-3v3M8 19v3m4-3v3m4-3v3M2 8h3m-3 4h3m-3 4h3m14-8h3m-3 4h3m-3 4h3"/></svg><span id="railCpu">—</span></span>
   <span><svg class="rail-power-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="7" width="20" height="9" rx="1.5"/><path d="M5 16v3m3-3v3m3-3v3m5-3v3m3-3v3M6 11h2m3 0h2m3 0h2"/></svg><span id="railHeap">—</span></span>
  </span>
  <span class="rail-power-centre" id="railPowerCentre" aria-hidden="true">—</span>`;
 railPower.insertAdjacentHTML('afterend', '<span class="rail-power-notice" id="railPowerNotice" role="status"></span>');
 const vmcEl=id=>document.getElementById(id);
 const vmcText=(id,text)=>{vmcEl(id).textContent=text};
 let deviceState=null,deviceBusy=false;
 let railHold=null,railPending=false,railFrame=0,railConfirmTarget=null;
 function railPowerState(state){
  if(typeof state?.powerEnabled!=='boolean')return ['offline','Sem ligação'];
  if(state.level==='critical')return ['critical',state.label||'Falha crítica'];
  if(state.level==='warning')return ['warning',state.label||'A aguardar'];
  if(!state.powerEnabled)return ['off','Saídas desligadas'];
  return ['ok','Ligada · OK'];
 }
 function renderRailPower(){
  const enabled=deviceState?.powerEnabled;
  if(railConfirmTarget!==null&&enabled===railConfirmTarget){railConfirmTarget=null;vmcText('railPowerNotice','')}
  if(railHold&&(deviceBusy||deviceState?.canToggle===false||railHold.enabled!==enabled))clearRailHold();
  const [state,label]=railPowerState(deviceState);
  const working=!!railHold||railPending;
  railPower.dataset.state=state;
  railPower.toggleAttribute('data-holding',!!railHold);
  railPower.toggleAttribute('data-pending',railPending);
  railPower.setAttribute('aria-disabled',String(state==='offline'||deviceBusy||railPending||deviceState?.canToggle===false));
  const metrics=state==='ok'&&!working;
  vmcEl('railPowerMetrics').hidden=!metrics;
  const cpu=Number.isFinite(deviceState?.cpuUsePct)?deviceState.cpuUsePct+'%':Number.isFinite(deviceState?.cpuMHz)?deviceState.cpuMHz+' MHz':'—';
  const heap=Number.isFinite(deviceState?.heapUsePct)?deviceState.heapUsePct+'%':'—';
  vmcText('railCpu',cpu);vmcText('railHeap',heap);vmcEl('railCpu').parentElement.hidden=deviceState?.showCpu===false;
  const centre=vmcEl('railPowerCentre');
  const powerSymbol=working||state==='off';
  centre.hidden=metrics;
  centre.toggleAttribute('data-symbol',powerSymbol);
  vmcText('railPowerCentre',powerSymbol?'⏻':state==='offline'?'—':label);
  const hint=state==='offline'?'':' · manter premido 1,5 s para '+(enabled?'desligar':'ligar');
  const accessible=label+(metrics?(deviceState?.showCpu===false?'':' · CPU '+cpu+(Number.isFinite(deviceState?.cpuUsePct)?' de utilização':' de frequência; utilização indisponível'))+' · memória utilizada '+heap:'')+hint;
  railPower.setAttribute('aria-label',accessible);
  railPower.title=accessible;
 }
 function clearRailHold(){
  railHold=null;
  cancelAnimationFrame(railFrame);
  railPower.style.setProperty('--rail-fill','0%');
 }
 function cancelRailHold(){
  if(!railHold)return;
  clearRailHold();
  renderRailPower();
 }
 function startRailHold(source){
  if(railHold||deviceBusy||railPending||typeof deviceState?.powerEnabled!=='boolean'||deviceState.canToggle===false)return;
  const hold={source,enabled:deviceState.powerEnabled,started:performance.now()};
  railHold=hold;
  railConfirmTarget=null;
  vmcText('railPowerNotice','');
  renderRailPower();
  const fill=async now=>{
   if(railHold!==hold)return;
   const progress=Math.min(1,(now-hold.started)/1500);
   railPower.style.setProperty('--rail-fill',progress*100+'%');
   if(progress<1){railFrame=requestAnimationFrame(fill);return}
   clearRailHold();
   if(deviceBusy||deviceState?.canToggle===false||deviceState?.powerEnabled!==hold.enabled){renderRailPower();return}
   const target=!hold.enabled;
   railPending=true;
   railPower.style.setProperty('--rail-fill','100%');
   let accepted=false;
   try{accepted=await sendPower(target)}catch(error){/* The last confirmed state stays visible. */}
   railPending=false;
   railPower.style.setProperty('--rail-fill','0%');
   if(accepted&&deviceState?.powerEnabled!==target)railConfirmTarget=target;
   vmcText('railPowerNotice',!accepted?'Comando falhou':railConfirmTarget!==null?'A aguardar confirmação':'');
   renderRailPower();
  };
  railFrame=requestAnimationFrame(fill);
 }
 railPower.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0||railPower.getAttribute('aria-disabled')==='true')return;
  railPower.setPointerCapture(event.pointerId);
  startRailHold(event.pointerId);
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture']){
  railPower.addEventListener(name,event=>{if(railHold?.source===event.pointerId)cancelRailHold()});
 }
 railPower.addEventListener('pointermove',event=>{
  if(railHold?.source!==event.pointerId)return;
  const bounds=railPower.getBoundingClientRect();
  if(event.clientX<bounds.left-8||event.clientX>bounds.right+8||event.clientY<bounds.top-8||event.clientY>bounds.bottom+8)cancelRailHold();
 });
 railPower.addEventListener('keydown',event=>{
  if(event.key==='Escape')cancelRailHold();
  if(event.key!==' '&&event.key!=='Enter')return;
  event.preventDefault();
  if(!event.repeat)startRailHold(event.key);
 });
 railPower.addEventListener('keyup',event=>{if(railHold?.source===event.key)cancelRailHold()});
 railPower.addEventListener('blur',cancelRailHold);
 railPower.addEventListener('contextmenu',event=>event.preventDefault());
 window.addEventListener('blur',cancelRailHold);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelRailHold()});
 return {update(state,busy=false){
  deviceState=state;
  deviceBusy=busy;
  renderRailPower();
 }};
}

function initOrbitTheme(key='orbit-theme'){
 const button=document.getElementById('orbitTheme');if(!button)return;
 const apply=light=>{document.body.classList.toggle('light',light);button.setAttribute('aria-checked',String(light));};
 try{apply(localStorage.getItem(key)==='light')}catch(e){apply(false)}
 button.addEventListener('click',()=>{const light=!document.body.classList.contains('light');apply(light);try{localStorage.setItem(key,light?'light':'dark')}catch(e){}});
}
