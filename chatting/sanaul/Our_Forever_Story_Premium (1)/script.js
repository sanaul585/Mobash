window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader").style.opacity="0",500));
setTimeout(()=>document.getElementById("loader").remove(),1500);
const body=document.body,theme=document.getElementById("theme");
if(localStorage.getItem("foreverTheme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
theme.onclick=()=>{body.classList.toggle("dark");let d=body.classList.contains("dark");localStorage.setItem("foreverTheme",d?"dark":"light");theme.textContent=d?"☀":"☾"};
// falling hearts
const particleBox=document.getElementById("particles");
function particle(){let p=document.createElement("i");p.className="particle";p.textContent=["♥","♡","✦","·"][Math.floor(Math.random()*4)];p.style.left=Math.random()*100+"vw";p.style.setProperty("--x",(Math.random()*240-120)+"px");p.style.fontSize=(8+Math.random()*13)+"px";p.style.animationDuration=(5+Math.random()*7)+"s";particleBox.appendChild(p);setTimeout(()=>p.remove(),13000)}
setInterval(particle,750);
// cursor heart
const ch=document.querySelector(".cursor-heart");document.addEventListener("mousemove",e=>{ch.style.left=e.clientX+"px";ch.style.top=e.clientY+"px";ch.style.opacity=.55});
// letter
const env=document.getElementById("envelope"), lm=document.getElementById("letterModal");
env.onclick=()=>{env.classList.add("open");setTimeout(()=>lm.classList.add("show"),500)};
document.querySelector("#letterModal .close").onclick=()=>lm.classList.remove("show");
// final
const fm=document.getElementById("foreverModal");document.getElementById("foreverBtn").onclick=()=>fm.classList.add("show");document.querySelector("#foreverModal .close").onclick=()=>fm.classList.remove("show");
document.getElementById("yes").onclick=()=>{fm.querySelector(".modal-box").innerHTML='<div class="big-heart">♥</div><span class="overline">FOREVER STARTS HERE</span><h2>Our story continues…</h2><p>InshaAllah, from this day to every tomorrow. ❤️</p>';for(let i=0;i<30;i++)setTimeout(particle,i*50)};
// gallery preview
document.querySelectorAll(".gallery input").forEach(input=>input.onchange=()=>{let f=input.files[0];if(!f)return;let reader=new FileReader();reader.onload=e=>{let box=input.nextElementSibling;box.style.backgroundImage=`url("${e.target.result}")`;box.querySelectorAll("span,b,small").forEach(x=>x.style.display="none")};reader.readAsDataURL(f)});
// close modal on outside
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal").forEach(m=>m.classList.remove("show"))});



