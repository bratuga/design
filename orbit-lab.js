initOrbitTheme('orbit-lab-theme');
const $=id=>document.getElementById(id);
let state={powerEnabled:true,cpuUsePct:16,heapUsePct:39};
const power=createOrbitPower(async enabled=>{await new Promise(r=>setTimeout(r,400));if($('scenario').value==='failure')return false;state={...state,powerEnabled:enabled};$('scenario').value=enabled?'ok':'off';power.update(state);return true;});power.update(state);
$('scenario').onchange=()=>{const choice=$('scenario').value;state=choice==='offline'?null:{powerEnabled:choice!=='off',cpuUsePct:choice==='unavailable'?null:16,cpuMHz:240,heapUsePct:39,level:['critical','warning'].includes(choice)?choice:'ok',label:choice==='critical'?'Falha crítica':'A aguardar feedback'};power.update(state)};
for(const button of document.querySelectorAll('[data-page]'))button.onclick=()=>{for(const p of ['panel','settings'])$(p).hidden=p!==button.dataset.page;document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b===button))};
const tabs=[...document.querySelectorAll('[data-tab]')];
for(const [index,button] of tabs.entries()){
 button.id='tab-'+button.dataset.tab;button.setAttribute('aria-controls',button.dataset.tab);button.tabIndex=index===0?0:-1;$(button.dataset.tab).setAttribute('aria-labelledby',button.id);
 button.onclick=()=>{tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;$(b.dataset.tab).hidden=b!==button})};
 button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();tabs[next].click()};
}
for(const button of document.querySelectorAll('[data-range]'))button.onclick=()=>{document.querySelectorAll('[data-range]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('rangeState').textContent=button.dataset.range==='24'?'Últimas 24 horas · simulado':'Últimos 7 dias · simulado'};
$('localSwitch').onclick=()=>{const on=$('localSwitch').getAttribute('aria-checked')!=='true';$('localSwitch').setAttribute('aria-checked',String(on));$('actionState').textContent='Saída '+(on?'ligada':'desligada')+' · simulação'};
$('refresh').onclick=()=>$('actionState').textContent='Leitura atualizada · simulação';
let saved=['ntp','fallback','timezone'].map(id=>$(id).value);
$('save').onclick=()=>{saved=['ntp','fallback','timezone'].map(id=>$(id).value);$('syncState').textContent='Valores guardados apenas nesta demonstração.'};
$('sync').onclick=async()=>{if(['ntp','fallback','timezone'].some((id,i)=>$(id).value!==saved[i])){$('syncState').textContent='Guarde primeiro as alterações.';return}$('sync').disabled=true;$('syncState').textContent='A aguardar resposta · simulação';await new Promise(r=>setTimeout(r,600));$('syncState').textContent='Sincronização simulada concluída.';$('sync').disabled=false};
