// ==============================================================================
// 1. SAFE LAZY-LOADING FIREBASE ENGINE SETUP (100% SOLUTIONS FOR NULL REF)
// ==============================================================================
const firebaseConfig = {
    databaseURL: "https://firebaseio.com"
};

// Global System Variables Tracking Setup
let myNumber = "";
let partnerNumber = "8090300720"; 
let chatRoomId = "";
let dbRef = null;

// ─── 🌟 MASTER TIMING FIX: BROWSER KO COMPEL KARNA KI SCRIPTS LOAD HONE KA WAIT KARE ───
window.addEventListener('load', () => {
    console.log("All scripts and assets fully loaded by browser.");
    
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    if (typeof firebase !== 'undefined') {
        dbRef = firebase.database();
        console.log("Database connection initialized perfectly! Unlocked.");
    } else {
        console.error("Firebase Core Engine missing. Re-verify HTML sequence.");
    }
});

// Global Core UI Layout Settings
const herName = "My Special Person"; 
const myName = "SANAUL ISLAM";

if(document.getElementById("herName")) document.getElementById("herName").textContent = herName;
if(document.getElementById("myName")) document.getElementById("myName").textContent = "— " + myName + " ❤️";

const typingText = document.getElementById("typingText");
const message = "Kuch baatein lafzon se kehna mushkil hoti hain... isliye socha aaj ek chhoti si website bana kar dil ki baat keh doon. ❤️";
let charIndex = 0;

function typeMessage() {
    if (typingText && charIndex < message.length) {
        typingText.textContent += message.charAt(charIndex);
        charIndex++;
        setTimeout(typeMessage, 45);
    }
}
typeMessage();


// ==============================================================================
// 3. WEDDING COUNTDOWN TIMER CLOCK LOGIC (Target: 1 March 2027)
// ==============================================================================
const weddingDate = new Date("March 1, 2027 00:00:00").getTime();

const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(document.getElementById("days")) document.getElementById("days").textContent = days < 10 ? "0" + days : days;
    if(document.getElementById("hours")) document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
    if(document.getElementById("minutes")) document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
    if(document.getElementById("seconds")) document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        const wrapper = document.querySelector(".countdown-wrapper");
        if(wrapper) wrapper.innerHTML = "<h5>Mubarak Ho! The Big Day Is Here! 💍❤️</h5>";
    }
}, 1000);

// ==============================================================================
// 4. INTERACTIVE QUIZ SUBMISSION ENGINE
// ==============================================================================
let currentStepNum = 1;

function submitQuizAnswer(questionKey, selectedValue) {
    const currentSenderNode = myNumber || "Visitor_Anonymous";

    if (dbRef) {
        dbRef.ref("quiz_responses/" + currentSenderNode).update({
            [questionKey]: selectedValue,
            submittedAt: firebase.database.ServerValue.TIMESTAMP
        });
    }

    const currentStepView = document.getElementById("qStep" + currentStepNum);
    if(currentStepView) currentStepView.classList.remove("active-step");

    currentStepNum++;

    const nextStepView = document.getElementById("qStep" + currentStepNum) || document.getElementById("quizSuccess");
    if(nextStepView) nextStepView.classList.add("active-step");
}


// ==============================================================================
// 7. SECTIONS TABS ROUTING UTILITY
// ==============================================================================
function navigateTo(sectionId) {
    const sections = document.querySelectorAll(".section, hero");
    sections.forEach(section => {

        section.classList.remove("active");
        section.style.setProperty("display", "none", "important"); 
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add("active");
        target.style.setProperty("display", "flex", "important"); 
    }

    document.querySelectorAll('.menu-list li a').forEach(navLink => {
        navLink.classList.remove('active-nav');
    });
    
    const currentNav = document.getElementById('nav-' + sectionId);
    if (currentNav) {
        currentNav.classList.add('active-nav');
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextSection(sectionId) { navigateTo(sectionId); }

// ==============================================================================
// 8. FINAL BUTTONS ONCLICK COMMAND ENGINE
// ==============================================================================
// =====================================================
// FINAL BUTTONS - WORKING CLICK HANDLER
// =====================================================

function yesClicked() {
    console.log("Haa button clicked");

    if (typeof createHeartExplosion === "function") {
        createHeartExplosion();
    }

    setTimeout(function () {
        if (typeof navigateTo === "function") {
            navigateTo("final");
        }
    }, 300);
}

function talkClicked() {
	
	const heart = String.fromCodePoint(0x2764, 0xFE0F);
    console.log("Pehle baat karte hain clicked");

    if (typeof createHeartExplosion === "function") {
        createHeartExplosion();
    }

    const message = "I LOVE YOU " + heart;
    const whatsappURL =
        "https://wa.me/918090703870?text=" +
        encodeURIComponent(message);

    setTimeout(function () {
        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    }, 300);
}


// =====================================================
// BUTTON CONNECTION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const yesButton = document.getElementById("yesButton");
    const talkButton = document.getElementById("talkButton");

    if (yesButton) {
        yesButton.addEventListener("click", function (event) {
            event.preventDefault();
            yesClicked();
        });
    }

    if (talkButton) {
        talkButton.addEventListener("click", function (event) {
            event.preventDefault();
            talkClicked();
        });
    }

});
function openEnvelope() {
    const letter = document.getElementById("letter");
    if(letter) letter.classList.add("show");

    if(document.getElementById("finalTitle")) document.getElementById("finalTitle").textContent = "For You ❤️";
    if(document.getElementById("finalMessage")) document.getElementById("finalMessage").textContent = "Ye kuch alfaaz sirf aapke liye...";

    createHeartExplosion();
}
const heartsContainer = document.querySelector(".hearts-container");

function createFloatingHeart() {
    const heart = document.createElement("div");

    heart.className = "floating-heart";

    const hearts = ["❤️", "💕", "💗", "💖", "💘"];
    heart.textContent =
        hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 25) + "px";
    heart.style.animationDuration = (5 + Math.random() * 5) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

setInterval(createFloatingHeart, 500);

// ==============================================================================
// 10. WHATSAPP API GATEWAY
// ==============================================================================
function sendWhatsAppNotification(userResponseText) {
    const myRealWhatsAppNumber = "918090703870"; 
    let customMessage = "Maine aapki surprise website dekhi... Bohot pyari mehnat ki hai aapne! Chaliye pehle WhatsApp par baat karte hain... 😊✨";
    const encodedText = encodeURIComponent(customMessage);
    const whatsappFinalUrl = "https://wa.me/" + myRealWhatsAppNumber + "?text=" + encodedText;
    
    setTimeout(() => { window.open(whatsappFinalUrl, '_blank'); }, 800);
}

// ==============================================================================
// 11. CLICK POP SOUND HANDLER
// ==============================================================================
function playClickSoundEffect(event) {
    if (event && event.target && event.target.tagName === 'A' && event.target.getAttribute('href') !== 'javascript:void(0)') {
        // Safe bypass
    }
    const snd = document.getElementById("clickSound");
    if (snd) {
        snd.currentTime = 0;
        snd.volume = 0.4;
        snd.play().catch(e => console.log("Audio block handled safely."));
    }
}

// ==============================================================================
// 12. GLITTER STARS BACKGROUND RUN
// ==============================================================================
function initGlitterDustSystem() {
    const glitterCount = 45; 
    const symbols = ['✨', '✦', '✧', '•'];
    for (let i = 0; i < glitterCount; i++) { createSingleGlitter(symbols); }
}

function createSingleGlitter(symbols) {
    const particle = document.createElement("div");
    particle.classList.add("glitter-particle");
    if (Math.random() > 0.4) {
        particle.classList.add("star");
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    } else {
        const size = Math.random() * 6 + 3;
        particle.style.width = size + "px";
        particle.style.height = size + "px";
    }
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = (Math.random() * 6 + 6) + "s"; 
    particle.style.animationDelay = (Math.random() * -12) + "s"; 
    document.body.appendChild(particle);
}
document.addEventListener("DOMContentLoaded", initGlitterDustSystem);

// ==============================================================================
// 13. LIGHT/DARK THEME SWITCH LOGIC
// ==============================================================================
function toggleThemeSystem() {
    const body = document.body;
    const btn = document.getElementById("themeToggleBtn");
    if(!btn) return;

    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
        btn.setAttribute("title", "Switch to Light Mode");
        localStorage.setItem("selectedTheme", "dark");
    } else {
        btn.setAttribute("title", "Switch to Dark Mode");
        localStorage.setItem("selectedTheme", "light");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    const body = document.body;
    const btn = document.getElementById("themeToggleBtn");
    if (savedTheme === "dark" && body && btn) {
        body.classList.add("dark-theme");
        btn.setAttribute("title", "Switch to Light Mode");
    }
});

function triggerPremiumHeartExplosion(event) {
    const clickX = event.clientX || (event.touches && event.touches.clientX);
    const clickY = event.clientY || (event.touches && event.touches.clientY);
    if (!clickX || !clickY) return;
    const explosionHeartCount = 40; 
    const heartTypes = ["✨", "💖", "💗", "💕", "💘", "🌸"];
    for (let i = 0; i < explosionHeartCount; i++) {
        const heartEl = document.createElement("div");
        heartEl.classList.add("explosion-heart");
        heartEl.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        heartEl.style.left = clickX + "px";
        heartEl.style.top = clickY + "px";
        const angle = Math.random() * Math.PI * 2; 
        const radius = Math.random() * 160 + 60; 
        const targetX = Math.cos(angle) * radius + "px";
        const targetY = Math.sin(angle) * radius + "px";
        const randomRotation = (Math.random() * 720 - 360) + "deg"; 
        heartEl.style.setProperty('--x', targetX);
        heartEl.style.setProperty('--y', targetY);
        heartEl.style.setProperty('--r', randomRotation);
        document.body.appendChild(heartEl);
        setTimeout(() => { heartEl.remove(); }, 1200);
    }
}


// ==============================================================================
// 👑 INDIVIDUAL MENU RESPONSIVE LOCK ENGINE (100% ABSOLUTE SEPARATION)
// ==============================================================================
function lockIndividualMenuLayouts() {
    const w = window.innerWidth || document.documentElement.clientWidth;
    
    // ─── 1. SEPARATE JAVASCRIPT FOR "ABOUT" MENU PAGE ───
    const aboutCard = document.querySelector('.target-about-only');
    if (aboutCard) {
        if (w <= 768) {
            aboutCard.style.setProperty("margin-top", "750px", "important");
            aboutCard.style.setProperty("padding-top", "25px", "important");
        } else {
            aboutCard.style.setProperty("margin-top", "340px", "important");
            aboutCard.style.setProperty("padding-top", "20px", "important");
        }
    }

    // ─── 2. SEPARATE JAVASCRIPT FOR "TIMELINE" MENU PAGE ───
    const timelineCard = document.querySelector('.target-timeline-only');
    if (timelineCard) {
        if (w <= 768) {
            timelineCard.style.setProperty("margin-top", "850px", "important");
            timelineCard.style.setProperty("padding-top", "25px", "important");
        } else {
            timelineCard.style.setProperty("margin-top", "600px", "important");
            timelineCard.style.setProperty("padding-top", "20px", "important");
        }
    }

    // ─── 3. SEPARATE JAVASCRIPT FOR "FUTUREDREAMS" MENU PAGE ───
    const wishlistCard = document.querySelector('.target-wishlist-only');
    if (wishlistCard) {
        if (w <= 768) {
            wishlistCard.style.setProperty("margin-top", "650px", "important");
            wishlistCard.style.setProperty("padding-top", "25px", "important");
        } else {
            wishlistCard.style.setProperty("margin-top", "240px", "important");
            wishlistCard.style.setProperty("padding-top", "20px", "important");
        }
    }
}

// Global active loop sensors for seamless execution
window.addEventListener('load', lockIndividualMenuLayouts);
window.addEventListener('resize', lockIndividualMenuLayouts);
document.addEventListener('DOMContentLoaded', lockIndividualMenuLayouts);
setInterval(lockIndividualMenuLayouts, 1000); // 1-second dynamic screen monitor


// Bottom corner music button
function toggleCornerMusic() {
    const music = document.getElementById("romanticMusic");
    const btn = document.getElementById("cornerMusicBtn");
    if (!music || !btn) return;
    if (music.paused) {
        music.play().then(() => { btn.textContent = "🔇"; }).catch(() => {});
    } else {
        music.pause();
        btn.textContent = "♫";
    }
}


// Wedding countdown: 1 November 2027 (India time)
(function initWeddingCountdown() {
    const target = new Date("2027-11-01T00:00:00+05:30").getTime();
    const daysEl = document.getElementById("countdownDays");
    const hoursEl = document.getElementById("countdownHours");
    const minutesEl = document.getElementById("countdownMinutes");
    const secondsEl = document.getElementById("countdownSeconds");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateWeddingCountdown() {
        const distance = target - Date.now();
        if (distance <= 0) {
            daysEl.textContent = "000";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }
        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        daysEl.textContent = String(days).padStart(3, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateWeddingCountdown();
    setInterval(updateWeddingCountdown, 1000);
})();



window.yesClicked = yesClicked;
window.talkClicked = talkClicked;




