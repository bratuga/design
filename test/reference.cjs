const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'http://orbit.test/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};
w.eval(fs.readFileSync(path.join(root,'orbit-controls.js'),'utf8'));
w.eval(fs.readFileSync(path.join(root,'examples/web-demo.js'),'utf8'));
const change=(id,value,type='change')=>{d.getElementById(id).value=value;d.getElementById(id).dispatchEvent(new w.Event(type,{bubbles:true}));};
const route=hash=>{w.location.hash=hash;w.dispatchEvent(new w.HashChangeEvent('hashchange'));};
try{
 route('#painel');assert.equal(d.getElementById('view-painel').hidden,false);assert.equal(d.getElementById('pageTitle').textContent,'Painel');
 route('#configuracao/tecnico');change('ntp','time.example.net','input');assert(d.getElementById('sync').disabled);assert(!d.getElementById('saveBar').hidden);
 route('#configuracao/diagnostico');route('#configuracao/tecnico');assert.equal(d.getElementById('ntp').value,'time.example.net');
 d.getElementById('discard').click();assert.equal(d.getElementById('ntp').value,'pool.ntp.org');assert(!d.getElementById('sync').disabled);
 change('profile','lusol');assert(d.getElementById('railCpu').parentElement.hidden);assert.doesNotMatch(d.getElementById('railPower').getAttribute('aria-label'),/CPU|MHz/);
 change('scenario','offline');assert.equal(d.getElementById('railPower').getAttribute('aria-disabled'),'true');assert.equal(d.getElementById('clockValue').textContent,'—');
 change('scenario','ok');change('profile','moxa');assert(d.getElementById('railPower').hidden);assert(d.getElementById('ntp').disabled);assert(!d.getElementById('maintenance').hidden);route('#historico');assert.equal(w.location.hash,'#configuracao/tecnico');
 change('profile','vmc');route('#historico');const first=d.getElementById('seriesLine').getAttribute('d');d.querySelector('[data-range="168"]').click();assert.notEqual(d.getElementById('seriesLine').getAttribute('d'),first);assert.match(d.getElementById('historyRows').textContent,/Sem dados/);
 assert.equal((d.getElementById('seriesLine').getAttribute('d').match(/M/g)||[]).length,2);
 console.log('PASS reference navigation/drafts/capabilities/offline/history');
}finally{w.close();}
