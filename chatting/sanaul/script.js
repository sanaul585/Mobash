const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const body = document.body;
const menuToggle = $("#menuToggle");
const nav = $("#nav");
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
const themeBtn = $("#themeBtn");
const cursorGlow = $(".cursor-glow");

// Mobile menu
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.textContent = "☰";
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Cursor glow
window.addEventListener("pointermove", e => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

// 3D card tilt
$$(".tilt-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (window.innerWidth < 850) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${y * -14}deg) translateZ(8px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

// Open My Heart
const loveMoment = $("#loveMoment");
function openLoveMoment() {
  loveMoment.classList.add("open");
  loveMoment.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
  heartBurst(55);
}
function closeLoveMoment(scrollToStory = false) {
  loveMoment.classList.remove("open");
  loveMoment.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
  if (scrollToStory) setTimeout(() => document.querySelector("#story").scrollIntoView({behavior:"smooth", block:"start"}), 120);
}
$("#openHeartBtn").addEventListener("click", openLoveMoment);
$("#closeMoment").addEventListener("click", closeLoveMoment);
$("#closeMomentBtn").addEventListener("click", () => closeLoveMoment(true));
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLoveMoment();
});

// Love letter typing
const letter = `Mobashshera ❤️

Kabhi kabhi kisi special insaan ke liye words kam pad jaate hain. Isliye socha, words ko ek chhoti si duniya bana doon.

Main chahta hoon jab bhi tum is website ko dekho, tumhare face par ek chhoti si smile aa jaye. 😊

Aaj se lekar future ke un saare simple moments tak — chai, hasi, celebrations, thodi nok-jhok aur bahut saari mohabbat — main un sabko imagine karke hi khush ho jata hoon.

Sabse beautiful thought?
Hum dono milkar apni story ke naye chapters likhenge — apne pace par, ek dusre ki respect ke saath.

— Tumhara Sanaul`;

const letterText = $("#letterText");
let letterStarted = false;
let letterTimer;
function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;
  let i = 0;
  letterTimer = setInterval(() => {
    letterText.textContent += letter[i++] || "";
    if (i >= letter.length) clearInterval(letterTimer);
  }, 18);
}
const letterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    typeLetter();
    letterObserver.disconnect();
  }
}, { threshold: .25 });
letterObserver.observe(letterText);
$("#letterPlay").addEventListener("click", typeLetter);

// Surprise
// Final
$("#finalBtn").addEventListener("click", () => {
  $("#finalNote").classList.add("show");
  heartBurst(35);
});


// Special interactions
const proposalBtn = $("#proposalBtn");
const secretModal = $("#secretModal");
const secretClose = $("#secretClose");
const secretHeartBtn = $("#secretHeartBtn");
const secretSaved = $("#secretSaved");

// The proposal question has its own behavior. It does NOT reuse the final surprise screen.
proposalBtn.addEventListener("click", () => {
  heartBurst(70);
  proposalBtn.textContent = "My answer is waiting in my heart ♥";
  proposalBtn.disabled = true;
  setTimeout(() => {
    proposalBtn.textContent = "Will you marry me? 💍";
    proposalBtn.disabled = false;
  }, 2600);
});

// YES, SHOW ME opens a completely different secret-gift screen.
function openSecretGift(){
  secretModal.classList.add("open");
  secretModal.setAttribute("aria-hidden","false");
  body.style.overflow="hidden";
  secretSaved.classList.remove("show");
  heartBurst(80);
}
function closeSecretGift(){
  secretModal.classList.remove("open");
  secretModal.setAttribute("aria-hidden","true");
  body.style.overflow="";
}
$("#surpriseBtn").addEventListener("click", openSecretGift);
secretClose.addEventListener("click", closeSecretGift);
secretHeartBtn.addEventListener("click", () => {
  secretSaved.classList.add("show");
  secretHeartBtn.textContent = "♥ Moment saved";
  heartBurst(120);
});
document.addEventListener("keydown", e => { if(e.key === "Escape") closeSecretGift(); });

// Theme
const savedTheme = localStorage.getItem("loveTheme");
if (savedTheme === "light") body.classList.add("light");
function updateThemeIcon() {
  themeBtn.textContent = body.classList.contains("light") ? "☀" : "☾";
}
updateThemeIcon();
themeBtn.addEventListener("click", () => {
  body.classList.toggle("light");
  localStorage.setItem("loveTheme", body.classList.contains("light") ? "light" : "dark");
  updateThemeIcon();
});

// Music — browser-safe: never autoplay
let musicPlaying = false;
musicBtn.addEventListener("click", async () => {
  try {
    if (musicPlaying) {
      music.pause();
      musicPlaying = false;
      musicBtn.textContent = "🔇";
    } else {
      await music.play();
      musicPlaying = true;
      musicBtn.textContent = "🎵";
    }
  } catch (err) {
    musicBtn.textContent = "⚠️";
    setTimeout(() => musicBtn.textContent = "🔇", 1400);
  }
});

// Canvas particles — hearts + stars
const canvas = $("#particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);

function resizeCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function newParticle(x = Math.random() * W, y = H + 20, burst = false) {
  return {
    x, y,
    size: burst ? 8 + Math.random() * 13 : 5 + Math.random() * 9,
    speed: burst ? 1.5 + Math.random() * 3 : .25 + Math.random() * .7,
    drift: (Math.random() - .5) * (burst ? 2.5 : .7),
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - .5) * .035,
    alpha: burst ? 1 : .18 + Math.random() * .38,
    color: Math.random() > .72 ? "#f5ca79" : (Math.random() > .5 ? "#ff8fba" : "#ff4f91"),
    burst
  };
}
for (let i = 0; i < 55; i++) particles.push(newParticle());

function drawHeart(x, y, size, color, alpha, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, size * .35);
  ctx.bezierCurveTo(-size * .95, -size * .2, -size * .55, -size, 0, -size * .35);
  ctx.bezierCurveTo(size * .55, -size, size * .95, -size * .2, 0, size * .35);
  ctx.fill();
  ctx.restore();
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, idx) => {
    p.y -= p.speed;
    p.x += Math.sin(p.y * .012) * .15 + p.drift;
    p.rotation += p.rotationSpeed;
    p.alpha *= p.burst ? .995 : 1;
    drawHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
    if (p.y < -40 || p.x < -80 || p.x > W + 80 || p.alpha < .03) particles[idx] = newParticle();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

function heartBurst(count = 25) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = newParticle(W * (.25 + Math.random() * .5), H * (.45 + Math.random() * .2), true);
      p.speed = 2 + Math.random() * 4;
      p.drift = (Math.random() - .5) * 5;
      particles.push(p);
    }, i * 22);
  }
}

// Tiny ambient burst on hero load
setTimeout(() => heartBurst(16), 800);


/* =====================================================
   💌 A LETTER FOR YOU — INTEGRATED INTERACTION
   ===================================================== */
const futureLetterEnvelope = document.querySelector("#futureLetterEnvelope");
const openFutureLetterBtn = document.querySelector("#openFutureLetter");
const futureLetterBox = document.querySelector("#futureLetterBox");
const futureLetterTextBox = document.querySelector("#futureLetterText");
const futureSurpriseBtn = document.querySelector("#futureSurpriseBtn");
const futureSurpriseMessage = document.querySelector("#futureSurpriseMessage");

const futureLetterCopy = `Shayad humari kahani abhi bilkul shuru bhi nahi hui...

Shayad humne abhi ek-doosre ke saath bahut si baatein bhi nahi ki hain.

Lekin main ek cheez chahta hoon — jab humari kahani sach mein shuru ho, toh usmein sirf mohabbat nahi, balki respect, trust, hasi aur sukoon bhi ho. ❤️

Main perfect husband hone ka promise nahi karta... 😄
Lekin tumhe samajhne ki koshish karne ka promise zaroor karta hoon.

Aur haan... agar kabhi tum mujhse naraz ho jao, toh main logic se nahi... pyaar se manaunga. 😂❤️

— Tumhara future husband, Sanaul ❤️`;

let futureLetterTyped = false;
let futureLetterTimer = null;

function typeFutureLetter() {
  if (futureLetterTyped || !futureLetterTextBox) return;
  futureLetterTyped = true;
  let i = 0;
  futureLetterTimer = setInterval(() => {
    futureLetterTextBox.textContent += futureLetterCopy[i++] || "";
    if (i >= futureLetterCopy.length) clearInterval(futureLetterTimer);
  }, 20);
}

if (openFutureLetterBtn && futureLetterEnvelope && futureLetterBox) {
  openFutureLetterBtn.addEventListener("click", () => {
    futureLetterEnvelope.style.display = "none";
    futureLetterBox.classList.add("show");
    futureLetterBox.setAttribute("aria-hidden", "false");
    typeFutureLetter();
    if (typeof heartBurst === "function") heartBurst(28);
    setTimeout(() => futureLetterBox.scrollIntoView({behavior:"smooth", block:"center"}), 180);
  });
}

if (futureSurpriseBtn && futureSurpriseMessage) {
  futureSurpriseBtn.addEventListener("click", () => {
    futureSurpriseMessage.classList.add("show");
    if (typeof heartBurst === "function") heartBurst(40);
  });
}



/* ==========================================
   💖 3D COUPLE CARD MOUSE TILT
========================================== */

document.querySelectorAll(".love3d-card").forEach(card => {

    card.addEventListener("mousemove", function(e) {

        const rect = card.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateY =
            ((x - centerX) / centerX) * 8;

        const rotateX =
            ((centerY - y) / centerY) * 8;

        card.style.animation = "none";

        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)
             scale(1.03)`;
    });


    card.addEventListener("mouseleave", function() {

        card.style.transform = "";

        card.style.animation =
            "loveCardFloat 4s ease-in-out infinite";

    });

});