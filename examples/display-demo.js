'use strict';
initOrbitTheme('orbit-reference-theme');
const el=id=>document.getElementById(id);
function write(ctx,text,x,y,size,color='#fff',weight='normal'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px monospace`;ctx.fillText(text,x,y);}
const mono=el('oled').getContext('2d');mono.fillStyle='#000';mono.fillRect(0,0,128,64);write(mono,'INTERIOR',3,11,10);write(mono,'22.4',3,39,27);write(mono,'C',100,29,13);write(mono,'HR 48%   REDE OK',3,58,9);
const paper=el('epaper').getContext('2d');let paperUpdates=0;
function drawPaper(){paper.fillStyle='#f5f5ed';paper.fillRect(0,0,296,128);write(paper,'INTERIOR',12,24,13,'#111','bold');write(paper,'22,4',12,79,43,'#111');write(paper,'C',128,63,18,'#111');write(paper,'HR 48%',180,62,17,'#111');paper.strokeStyle='#111';paper.beginPath();paper.moveTo(12,96);paper.lineTo(284,96);paper.stroke();write(paper,`Atualizado 14:${paperUpdates?'33':'32'}`,12,115,12,'#111');}
el('paperRefresh').addEventListener('click',()=>{paperUpdates++;drawPaper();el('epaper').setAttribute('aria-label','E-paper atualizado: interior 22,4 graus, humidade 48 por cento. Última leitura às 14:33.');});drawPaper();
const pages=['Estado','Modo','Setpoint','Bypass','Ar novo','Insuflação','Extração','Rejeição','% insuflação','% extração','Temp interna / tensão'];
const sensorValues={4:['18,6','62% HR','#244f76'],5:['22,4','48% HR','#185846'],6:['23,1','51% HR','#754719'],7:['19,8','59% HR','#713b53']};
let page=4,config=false,mode=0,setpoint=22,bypass=false,supply=40,extract=40;
const tft=el('tft').getContext('2d');
function drawTft(){
 const sensor=sensorValues[page];tft.fillStyle=!config&&sensor?sensor[2]:'#0b1119';tft.fillRect(0,0,240,135);
 const title=config?'Configuração':pages[page];let value='',unit='',detail='';
 if(config){value='Exemplo';detail='A 3 s: voltar';}
 else if(sensor){value=sensor[0];unit='C';detail=sensor[1];}
 else if(page===0){value='Ligado';detail='Rede e sensores OK';}
 else if(page===1){value=['Auto','Manual','Boost'][mode];detail=mode===0?'Noite: conforme horário':'B/C: mudar modo';}
 else if(page===2){value=setpoint.toFixed(1).replace('.',',');unit='C';detail='B/C: ajustar';}
 else if(page===3){value=bypass?'Aberto':'Fechado';detail='Estado de exemplo';}
 else if(page===8||page===9){value=String(page===8?supply:extract);unit='%';detail='B/C: ajustar em Manual';}
 else{value='38,1';unit='C';detail='24,1 V';}
 write(tft,title,10,20,14,'#fff');write(tft,value,10,82,value.length>6?31:44,'#fff','bold');if(unit)write(tft,unit,201,59,20,'#fff');write(tft,detail,10,119,14,'#fff');
 const description=`${config?'Configuração':pages[page]}: ${value} ${unit}. ${detail}. Simulação.`;el('tft').setAttribute('aria-label',description);el('displayDescription').textContent=description;
}
let holdTimer=null,longPressed=false,held=false;
function beginA(){if(held)return;held=true;longPressed=false;el('buttonA').classList.add('holding');holdTimer=setTimeout(()=>{config=!config;longPressed=true;drawTft();},3000);}
function endA(cancel=false){if(!held)return;clearTimeout(holdTimer);held=false;el('buttonA').classList.remove('holding');if(!cancel&&!longPressed&&!config){page=(page+1)%pages.length;drawTft();}}
el('buttonA').addEventListener('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;el('buttonA').setPointerCapture(event.pointerId);beginA();});
el('buttonA').addEventListener('pointerup',()=>endA());el('buttonA').addEventListener('pointercancel',()=>endA(true));el('buttonA').addEventListener('lostpointercapture',()=>endA(true));
el('buttonA').addEventListener('pointermove',event=>{const r=el('buttonA').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)endA(true);});
el('buttonA').addEventListener('keydown',event=>{if(event.key==='Escape')endA(true);if(event.key===' '||event.key==='Enter'){event.preventDefault();if(!event.repeat)beginA();}});
el('buttonA').addEventListener('keyup',event=>{if(event.key===' '||event.key==='Enter')endA();});el('buttonA').addEventListener('blur',()=>endA(true));window.addEventListener('blur',()=>endA(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)endA(true);});
function adjust(delta){if(config)return;if(page===1)mode=(mode+delta+3)%3;else if(page===2)setpoint=Math.max(16,Math.min(28,setpoint+delta*.5));else if(page===3)bypass=!bypass;else if(page===8){supply=Math.max(0,Math.min(100,supply+delta*5));mode=1;}else if(page===9){extract=Math.max(0,Math.min(100,extract+delta*5));mode=1;}drawTft();}
el('buttonB').addEventListener('click',()=>adjust(-1));el('buttonC').addEventListener('click',()=>adjust(1));
el('touchSetpoint').addEventListener('input',()=>{el('touchValue').value=Number(el('touchSetpoint').value).toLocaleString('pt-PT')+' °C';});drawTft();
