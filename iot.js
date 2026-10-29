const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const shell=$("#deviceShell"),meta=$("#simMeta"),mode=$("#deviceMode");
const screens=["home","climate","relay","status"];let current=0;
function setScreen(name){$$(".screen").forEach(s=>s.classList.toggle("active",s.dataset.screen===name));$$("[data-screen]").forEach(b=>b.classList.toggle("active",b.dataset.screen===name));current=screens.indexOf(name)}
$$("[data-screen]").forEach(b=>b.addEventListener("click",()=>setScreen(b.dataset.screen)));
$("#prevBtn").addEventListener("click",()=>setScreen(screens[(current-1+screens.length)%screens.length]));
$("#nextBtn").addEventListener("click",()=>setScreen(screens[(current+1)%screens.length]));
$("#selectBtn").addEventListener("click",()=>{if(screens[current]==="relay"){const first=$(".relay-list button");first.classList.toggle("on");first.querySelector("b").textContent=first.classList.contains("on")?"ON":"OFF"}});
$$(".relay-list button").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("on");b.querySelector("b").textContent=b.classList.contains("on")?"ON":"OFF"}));
mode.addEventListener("change",()=>{shell.className="device-shell "+mode.value;meta.textContent={oled:"128×64 · 1-bit OLED",epaper:"296×128 · e-paper",tft:"320×240 · TFT color",touch:"480×320 · touch panel"}[mode.value]});
$("#themeBtn").addEventListener("click",()=>document.body.classList.toggle("dark"));
function bind(id,out,suffix){const el=$(id),o=$(out);el.addEventListener("input",()=>o.textContent=el.value+suffix)}
bind("#tempRange","#tempOut"," °C");bind("#humRange","#humOut"," %");bind("#rssiRange","#rssiOut"," dBm");
$("#wifiToggle").addEventListener("change",e=>{$(".screen[data-screen=status] .status-lines span:first-child b").textContent=e.target.checked?"-62 dBm":"OFF"});
$("#knxToggle").addEventListener("change",e=>{$(".screen[data-screen=status] .status-lines span:nth-child(3) b").textContent=e.target.checked?"1284":"OFF"});
$("#alarmToggle").addEventListener("change",e=>{shell.style.boxShadow=e.target.checked?"0 0 0 4px #e56f69,0 28px 60px rgba(20,35,50,.18)":""});
function telemetry(){
 const data=[
 ["Temperatura",(18+Math.random()*8).toFixed(1)+" °C"],
 ["Humidade",Math.round(38+Math.random()*28)+" %"],
 ["CO₂",Math.round(450+Math.random()*500)+" ppm"],
 ["RSSI","-"+Math.round(48+Math.random()*28)+" dBm"],
 ["Heap",Math.round(150+Math.random()*60)+" KB"],
 ["Uptime",Math.round(3+Math.random()*28)+" dias"],
 ["KNX RX",Math.round(900+Math.random()*800)],
 ["Tensão",(4.8+Math.random()*.4).toFixed(2)+" V"]
 ];
 $("#telemetryGrid").innerHTML=data.map(x=>'<div class="metric"><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join("")
}
$("#randomizeBtn").addEventListener("click",telemetry);telemetry();