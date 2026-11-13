'use strict';
// Interactive reference only. No device endpoints, credentials, or physical commands.
const $ = id => document.getElementById(id);
const profiles = {
  vmc: {name:'VMC',host:'vmc-casa',hardware:'M5Stack StamPLC',rtc:'RTC RX8130CE',rtcState:'Disponível',rtcDetail:'Relógio em UTC',config:'Ventilação',description:'Horários, velocidades e condições de funcionamento mantêm as regras atuais.',facts:[['Relógio','RX8130CE · UTC'],['Histórico','microSD'],['Saídas','Mapa atual preservado']],sensors:[['Ar novo','18,6','62','#91b6f5'],['Insuflação','22,4','48','#61d5b0'],['Extração','23,1','51','#f0b374'],['Rejeição','19,8','59','#d99baa']]},
  lusol: {name:'LusoSol',host:'lusol-casa',hardware:'ESP32 DevKit',rtc:'Relógio',rtcState:'Software',rtcDetail:'Sincronização por NTP',config:'Gestão solar',description:'Gestão solar, relés independentes e cartões de energia conservam o funcionamento e a composição atuais.',facts:[['Controlador','ESP32 DevKit'],['Indicador circular','Memória utilizada'],['Display','Modelo e pinos por confirmar']],sensors:[['Energia','1 280','W','#61d5b0'],['Temperatura','54,2','°C','#f0b374']]},
  sensor: {name:'Sensores',host:'sensores-casa',hardware:'ESP32 · perfil instalado',rtc:'Relógio',rtcState:'Software',rtcDetail:'Sincronização por NTP',config:'Sensores e aquecimento',description:'O modo configurado, os coletores e os termóstatos existentes são preservados.',facts:[['Modo','Perfil instalado'],['Saídas','Mapa atual preservado'],['Regulação','Regras atuais preservadas']],sensors:[['Interior','22,4','48','#61d5b0'],['Exterior','18,6','62','#91b6f5']]},
  moxa: {name:'Moxa',host:'moxa-gateway',hardware:'Gateway Moxa · Linux',rtc:'Gestão do relógio',rtcState:'Linux',rtcDetail:'Manutenção existente',config:'Medidores e MQTT',description:'Mantêm-se as funções do painel de medidores. Rede, NTP, knxd e serviços Linux continuam na manutenção existente.',facts:[['Rede','Ethernet'],['Sistema','Industrial Linux'],['Atualização','Aplicação · sem substituir o sistema']],sensors:[['Medidor 01','1 280','W','#61d5b0'],['Medidor 02','742','W','#91b6f5']]}
};
let profile='vmc', scenario='ok', powerEnabled=true, range=24, dirty=false, busy=false;
const drafts={};
let saved={ntp:'pool.ntp.org',fallback:'time.cloudflare.com',timezone:'Europe/Lisbon'};
const notify=(message,warning=false)=>{ $('notice').textContent=message; $('notice').classList.toggle('warning',warning); $('notice').hidden=false; };
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const power=createOrbitPower(async target=>{
  busy=true; refreshAvailability();
  notify('Pedido enviado. A aguardar confirmação…');
  await delay(700);
  if(scenario==='failure'||scenario==='offline'){
    busy=false; refreshAvailability(); notify('Comando recusado. O estado confirmado foi mantido.',true); return false;
  }
  powerEnabled=target; busy=false; renderPower(); refreshAvailability();
  notify(target?'Ligação confirmada · simulação.':'Saídas desligadas · confirmação simulada.');
  return true;
});
initOrbitTheme('orbit-reference-theme');
function renderPower(){
  const offline=scenario==='offline';
  power.update({powerEnabled:offline?null:powerEnabled,level:scenario==='stale'?'warning':'ok',label:scenario==='stale'?'Dados antigos':'',cpuMHz:profile==='lusol'?null:240,heapUsePct:39,showCpu:profile!=='lusol',canToggle:!offline&&scenario!=='stale'&&!busy});
  $('overviewPower').textContent=profile==='moxa'?'Não aplicável':offline?'Desconhecido':powerEnabled?'Ligado':'Saídas desligadas';
  $('powerLabel').textContent=offline?'Sem ligação':scenario==='stale'?'Dados antigos':powerEnabled?'Ligado':'Saídas desligadas';
  $('powerHint').textContent=offline||scenario==='stale'?'Comando indisponível':`Manter 1,5 s para ${powerEnabled?'desligar':'ligar'}`;
}
function refreshAvailability(){
  $('sync').disabled=dirty||busy||scenario==='offline'||profile==='moxa';
  $('syncHelp').textContent=dirty?'Guarda ou descarta as alterações antes de sincronizar.':'Usa os servidores guardados.';
  $('scenario').disabled=busy; $('profile').disabled=busy;
  for(const input of $('ntpForm').querySelectorAll('input,select,button[type="submit"],#discard')) input.disabled=profile==='moxa'||busy;
}
function setDirty(value){dirty=value;$('saveBar').hidden=!value;refreshAvailability();}
function readForm(){return {ntp:$('ntp').value.trim(),fallback:$('fallback').value.trim(),timezone:$('timezone').value};}
function restoreForm(){for(const [key,value] of Object.entries(saved))$(key).value=value;setDirty(false);}
$('ntpForm').addEventListener('input',()=>setDirty(JSON.stringify(readForm())!==JSON.stringify(saved)));
$('discard').addEventListener('click',()=>{restoreForm();notify('Alterações descartadas.');});
$('ntpForm').addEventListener('submit',event=>{
  event.preventDefault(); if(profile==='moxa'||busy)return;
  const next=readForm();
  if(![next.ntp,next.fallback].every(host=>/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(host))){notify('Indica um nome de servidor ou endereço válido, sem espaços.',true);return;}
  saved=next; setDirty(false); notify('Configuração guardada nesta demonstração. Podes sincronizar agora.');
});
$('sync').addEventListener('click',async()=>{
  if(dirty||busy||profile==='moxa'||scenario==='offline')return;
  busy=true;refreshAvailability();$('sync').setAttribute('aria-busy','true');notify('A pedir a sincronização…');
  await delay(800);busy=false;$('sync').removeAttribute('aria-busy');refreshAvailability();
  if(scenario==='failure'){notify('O servidor não respondeu. A hora anterior foi preservada.',true);return;}
  $('clockValue').textContent='14:32:09';$('lastSync').textContent='Agora';$('clockSource').textContent=saved.ntp;
  notify('Sincronização confirmada · resultado simulado.');
});
function renderProfile(){
  const p=profiles[profile];document.body.dataset.profile=profile;
  $('deviceName').textContent=p.name;$('deviceAddress').textContent=p.host+'.local';$('networkName').textContent=p.host;
  $('storageLabel').textContent=p.rtc;$('storageValue').textContent=p.rtcState;$('storageDetail').textContent=p.rtcDetail;
  $('hardwareName').textContent=p.hardware;$('hardwareFacts').replaceChildren();
  for(const [label,value] of p.facts){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);$('hardwareFacts').append(row);}
  $('deviceConfigTitle').textContent=p.config;$('deviceConfigDescription').textContent=p.description;
  const isMoxa=profile==='moxa';
  $('railPower').hidden=isMoxa;document.querySelector('.power-caption').hidden=isMoxa;$('gatewayState').hidden=!isMoxa;
  $('railPowerNotice').hidden=isMoxa;
  $('maintenance').hidden=!isMoxa;document.querySelector('.inline-actions').hidden=isMoxa;
  $('networkSummary').textContent=isMoxa?'Ethernet · manutenção Linux':'Wi-Fi · DHCP';$('networkType').textContent=isMoxa?'Ethernet':'Wi-Fi';
  $('ntpDescription').textContent=isMoxa?'Estado consultado no sistema Linux.':'Sincronização automática pela Internet.';
  $('version').textContent=(isMoxa?'Aplicação':'Firmware')+' · versão de exemplo';
  document.querySelector('[data-section="knx"]').hidden=isMoxa;
  // No history capability is invented for the current Moxa panel.
  document.querySelector('[data-view="historico"]').hidden=isMoxa;
  document.querySelector('.rail nav').style.setProperty('--nav-count',isMoxa?'3':'4');
  renderPower();renderSensors();renderHistory();refreshAvailability();renderRoute();
}
$('profile').addEventListener('change',()=>{
  drafts[profile]={saved:{...saved},draft:readForm()};profile=$('profile').value;
  const previous=drafts[profile];saved=previous?previous.saved:{ntp:'pool.ntp.org',fallback:'time.cloudflare.com',timezone:'Europe/Lisbon'};
  for(const [key,value] of Object.entries(previous?previous.draft:saved))$(key).value=value;
  setDirty(JSON.stringify(readForm())!==JSON.stringify(saved));powerEnabled=true;$('notice').hidden=true;
  $('lastSync').textContent='Há 2 minutos';$('clockValue').textContent='14:32:08';$('clockSource').textContent=saved.ntp;
  renderProfile();renderScenario();
});
function renderScenario(){
  scenario=$('scenario').value;const offline=scenario==='offline',stale=scenario==='stale';
  $('overviewConnection').textContent=offline?'Sem ligação':stale?'Leituras antigas':'Ligação ativa';
  $('connectionText').textContent=offline?'Sem ligação':stale?'Leituras antigas':'Ligação ativa';
  document.querySelector('.connection').dataset.state=scenario;
  $('connectionNotice').hidden=!offline&&!stale;
  $('connectionNotice').textContent=offline?'Sem comunicação. Não é possível confirmar o estado das saídas ou enviar comandos.': 'Última leitura há 12 minutos. Os valores anteriores estão identificados; o comando geral está indisponível.';
  $('clockStatus').textContent=offline?'Sem confirmação':'Hora válida';$('clockStatus').classList.toggle('warning',offline);
  $('gatewayState').querySelector('strong').textContent=offline?'Sem ligação':'Gateway online';
  $('clockValue').textContent=offline?'—':'14:32:08';$('lastSync').textContent=offline?'Sem confirmação':stale?'Há 12 minutos':'Há 2 minutos';
  $('freshness').textContent=offline?'Sem dados disponíveis':stale?'Última leitura · há 12 min':'Atualizado agora';
  renderPower();renderSensors();refreshAvailability();
}
$('scenario').addEventListener('change',()=>{$('notice').hidden=true;$('railPowerNotice').textContent='';renderScenario();});
function renderSensors(){
  $('sensorGrid').replaceChildren();
  profiles[profile].sensors.forEach(([name,value,secondary,color])=>{
    const temperature=profile==='vmc'||profile==='sensor';
    const article=document.createElement('article');article.className='sensor';article.style.setProperty('--sensor-color',color);
    const offline=scenario==='offline';
    article.innerHTML=`<h3><i aria-hidden="true"></i>${name}</h3><div class="sensor-values"><div>${offline?'—':value} <span>${temperature?'°C':secondary}</span></div>${temperature?`<div>${offline?'—':secondary} <span>%</span></div>`:''}</div><small>${offline?'Sem ligação':scenario==='stale'?'Leitura antiga · há 12 min':'Atualizado agora · exemplo'}</small>${offline?'':`<svg class="sensor-trend" viewBox="0 0 400 44" preserveAspectRatio="none" aria-hidden="true"><path d="M0 29L25 27L50 30L80 24L110 28L140 19L170 21L200 17L230 22L260 12L290 17L320 9L350 14L380 8L400 10"/></svg>`}`;
    $('sensorGrid').append(article);
  });
}
$('refresh').addEventListener('click',()=>notify(scenario==='offline'?'Sem ligação. Não foi possível atualizar as leituras.':'Leituras atualizadas · simulação.',scenario==='offline'));
const historyData={
  24:{labels:['00:00','04:00','08:00','10:00','12:00','16:00','20:00','24:00'],values:[20.1,20.8,22.4,null,21.8,22.9,22.2,22.4],path:'M38 142L100 148L146 121L190 129L245 94L280 104L310 77 M410 98L465 75L510 86L560 64L610 93L650 74L700 84L745 67L785 73',axis:['00:00','08:00','16:00','24:00']},
  168:{labels:['6 nov.','7 nov.','8 nov.','9 nov.','10 nov.','11 nov.','12 nov.'],values:[19.4,20.8,null,21.4,22.3,21.8,22.4],path:'M38 163L95 150L160 120L220 142 M345 103L400 120L460 90L520 78L585 100L645 88L715 60L785 73',axis:['6 nov.','8 nov.','10 nov.','12 nov.']}
};
function renderHistory(){
  const data=historyData[range];
  let segmentStart=true;
  const path=data.values.map((value,index)=>{
    if(value===null){segmentStart=true;return '';}
    const fraction=range===24?Number(data.labels[index].split(':')[0])/24:index/(data.values.length-1);
    const point=(38+fraction*747).toFixed(1)+' '+(205-(value-18)*30).toFixed(1);
    const command=(segmentStart?'M':'L')+point;segmentStart=false;return command;
  }).join(' ');
  $('seriesLine').setAttribute('d',path);
  $('rangeCaption').textContent=range===24?'Últimas 24 horas':'Últimos 7 dias';
  $('chartSeries').textContent=profile==='vmc'?'Insuflação':profile==='lusol'?'Temperatura':'Interior';
  document.querySelectorAll('.axis-labels text').forEach((el,i)=>{if(i>=4)el.textContent=data.axis[i-4];});
  document.querySelector('.chart-note').innerHTML=`<span class="gap-dot"></span>${range===24?'Intervalo sem dados entre 10:00 e 12:00':'8 nov. · dados indisponíveis'} <span class="quiet">· não interpolado</span>`;
  $('historyRows').innerHTML=data.labels.map((label,i)=>`<tr><td>${label}</td><td>${data.values[i]===null?'—':data.values[i].toFixed(1).replace('.',',')+' °C'}</td><td>${data.values[i]===null?'Sem dados':'Exemplo válido'}</td></tr>`).join('');
  document.querySelectorAll('[data-range]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.range)===range)));
}
document.querySelectorAll('[data-range]').forEach(button=>button.addEventListener('click',()=>{range=Number(button.dataset.range);renderHistory();}));
function renderRoute(){
  $('notice').hidden=true;
  const [requestedView,requestedSection]=(location.hash.slice(1)||'configuracao/tecnico').split('/');
  const view=['painel','sensores','historico','configuracao'].includes(requestedView)&&!(profile==='moxa'&&requestedView==='historico')?requestedView:'configuracao';
  const sections=['tecnico','diagnostico','hardware','knx','equipamento'];
  const section=sections.includes(requestedSection)&&!(profile==='moxa'&&requestedSection==='knx')?requestedSection:'tecnico';
  if(location.hash!==`#${view}${view==='configuracao'?'/'+section:''}`)history.replaceState(null,'',`#${view}${view==='configuracao'?'/'+section:''}`);
  document.querySelectorAll('[id^="view-"]').forEach(el=>el.hidden=el.id!=='view-'+view);
  document.querySelectorAll('.config-section').forEach(el=>el.hidden=el.id!=='section-'+section);
  document.querySelectorAll('[data-view]').forEach(a=>a.toggleAttribute('aria-current',false));
  document.querySelector(`[data-view="${view}"]`).setAttribute('aria-current','page');
  document.querySelectorAll('[data-section]').forEach(a=>{a.removeAttribute('aria-current');if(a.dataset.section===section)a.setAttribute('aria-current','page');});
  $('pageTitle').textContent={painel:'Painel',sensores:'Sensores',historico:'Histórico',configuracao:'Configuração'}[view];
  document.title=$('pageTitle').textContent+' · Orbit';
  if(view==='configuracao'&&dirty)notify('Existem alterações por guardar no separador Técnico.');
}
window.addEventListener('hashchange',()=>{renderRoute();window.scrollTo(0,0);$('main').focus({preventScroll:true});});
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();$('main').focus();$('main').scrollIntoView();});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
const details={
  ajuda:['Ajuda','A ajuda mantém acesso público. Na integração, este acesso abre a documentação do próprio equipamento. Os cartões operacionais atuais não são redesenhados por este padrão.'],
  backup:['Backup e restauro','Padrão: apresentar a data e a versão do backup, validar o ficheiro e mostrar um resumo antes do restauro. Os formatos atuais e a confirmação existente ficam preservados.'],
  firmware:['Atualização','Padrão: um resumo único com equipamento, versão instalada e versão do ficheiro antes de aplicar. A validação de compatibilidade deve continuar no dispositivo, mesmo quando a página já validou o ficheiro. Este exemplo não instala firmware.'],
  auditoria:['Auditoria','Padrão: uma lista com instante, utilizador, ação e resultado, incluindo espera e falha. Mostrar apenas os eventos que cada firmware realmente disponibiliza.']
};
document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{const [title,body]=details[button.dataset.detail];$('detailTitle').textContent=title;$('detailBody').textContent=body;$('detailDialog').showModal();}));
$('closeDialog').addEventListener('click',()=>$('detailDialog').close());
$('knxTest').addEventListener('click',()=>notify('Teste simulado: ligação disponível. Nenhum telegrama foi enviado.'));
renderProfile();renderScenario();
