/* =========================================
   🔥 CORE FIREBASE INITIALIZATION (FIXED)
========================================= */

const ALLOWED_EMAILS = [
    "sanaulislam77@gmail.com",
    "islamsanaul77@gmail.com"
];

const firebaseConfig = {
    apiKey: "AIzaSyBMC6zSRFjmxMUYToC04nGyy2wR1iHgDgc",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://firebaseio.com",
    projectId: "proposalchat-2f314",
    storageBucket: "proposalchat-2f314.firebasestorage.app",
    messagingSenderId: "806178842142",
    appId: "1:806178842142:web:0ae6cb22478a085a1300f"
};

// 1. फ़ायरबेस को रियल मोड में चालू करना
let firebaseMode = true;

// 2. ऐप्स और डेटाबेस को सही तरीके से ग्लोबली कनेक्ट करना
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// 3. डोम एलिमेंट्स को आसानी से ढूंढने का शॉर्टकट
const $ = id => document.getElementById(id);
let currentUser = null;
let messagesRef = null;
let unsubscribeMessages = null;

// 4. ईमेल वैलिडेशन फ़ंक्शन (सुधरा हुआ)
function allowed(email) { 
    if (!email) return false;
    return ALLOWED_EMAILS.includes(email.trim().toLowerCase()); 
}

function status(text) { $('statusText').textContent = text; }
function message(text) { $('authMessage').textContent = text; }
function esc(v) { const d=document.createElement('div'); d.textContent=v ?? ''; return d.innerHTML; }
function time(v) { return new Date(v || Date.now()).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

function renderEmpty() {
  $('messages').innerHTML = '<div class="empty-chat"><div><div style="font-size:38px">💗</div><div>Start your little conversation...</div></div></div>';
}

function renderMessage(data) {
  const empty = $('messages').querySelector('.empty-chat');
  if (empty) empty.remove();
  const me = data.senderUid === (currentUser?.uid || 'demo-you');
  const row = document.createElement('div');
  row.className = 'msg ' + (me ? 'me' : 'them');
  row.innerHTML = `<div class="bubble"><div class="meta">${esc(me ? 'You' : (data.senderName || 'Fiancée'))}</div><div>${esc(data.text)}</div><span class="time">${time(data.createdAt)}</span></div>`;
  $('messages').appendChild(row);
  $('messages').scrollTop = $('messages').scrollHeight;
}

function showChat(user) {
  currentUser = user;
  $('loginPanel').hidden = true;
  $('chatPanel').hidden = false;
  $('logoutBtn').hidden = !firebaseMode;
  status(firebaseMode ? `Private chat • ${user.email}` : 'Demo mode • This browser only');
  renderEmpty();
}

const DEMO_KEY = 'couple_chat_demo_messages_v2';
function demoLogin() {
  const email = $('emailInput').value.trim().toLowerCase();
  const password = $('passwordInput').value;
  if (!allowed(email)) return message('Sirf approved 2 Gmail IDs allowed hain.');
  if (!password) return message('Password enter kijiye.');
  const users = JSON.parse(localStorage.getItem('couple_demo_users') || '{}');
  if (!users[email]) {
    users[email] = password;
    localStorage.setItem('couple_demo_users', JSON.stringify(users));
  } else if (users[email] !== password) {
    return message('Demo password incorrect hai.');
  }
  const uid = 'demo-' + email;
  showChat({uid, email});
  JSON.parse(localStorage.getItem(DEMO_KEY) || '[]').forEach(renderMessage);
  message('');
}

function demoRegister() {
  const email = $('emailInput').value.trim().toLowerCase();
  const password = $('passwordInput').value;
  if (!allowed(email)) return message('Sirf approved 2 Gmail IDs allowed hain.');
  if (password.length < 6) return message('Password kam se kam 6 characters ka ho.');
  const users = JSON.parse(localStorage.getItem('couple_demo_users') || '{}');
  if (users[email]) return message('Account already exists. Login karein.');
  users[email] = password;
  localStorage.setItem('couple_demo_users', JSON.stringify(users));
  message('Demo account created. Ab Login karein.');
}

function demoSend(text) {
  const list = JSON.parse(localStorage.getItem(DEMO_KEY) || '[]');
  const msg = {senderUid: currentUser.uid, senderName: currentUser.email === ALLOWED_EMAILS[1] ? 'Fiancée' : 'You', text, createdAt: Date.now()};
  list.push(msg); localStorage.setItem(DEMO_KEY, JSON.stringify(list)); renderMessage(msg);
}

async function firebaseLogin() {
  const email = $('emailInput').value.trim().toLowerCase();
  const password = $('passwordInput').value;
  if (!allowed(email)) return message('This private chat is only for the two approved Gmail IDs.');
  if (!password) return message('Please enter your password.');
  try {
    await window.__fb.signInWithEmailAndPassword(auth, email, password);
    message('');
  } catch (e) {
    const map = {'auth/invalid-credential':'Email ya password incorrect hai.','auth/user-not-found':'Account pehle Create account se banaiye.','auth/wrong-password':'Password incorrect hai.','auth/too-many-requests':'Bahut attempts ho gaye. Thodi der baad try karein.'};
    message(map[e.code] || e.message);
  }
}

async function firebaseRegister() {
  const email = $('emailInput').value.trim().toLowerCase();
  const password = $('passwordInput').value;
  if (!allowed(email)) return message('Only the two approved Gmail IDs can create an account.');
  if (password.length < 6) return message('Firebase password must be at least 6 characters.');
  try {
    await window.__fb.createUserWithEmailAndPassword(auth, email, password);
    message('Account created successfully.');
  } catch (e) {
    const map = {'auth/email-already-in-use':'Ye Gmail already registered hai. Login karein.','auth/weak-password':'Password stronger rakhein.','auth/invalid-email':'Valid Gmail address enter karein.'};
    message(map[e.code] || e.message);
  }
}

async function initFirebase() {
  try {
    if (location.protocol === 'file:') throw new Error('file protocol');
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');
    const dbMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js');
    const app = appMod.initializeApp(firebaseConfig);
    auth = authMod.getAuth(app); db = dbMod.getDatabase(app);
    window.__fb = authMod; window.__db = dbMod;
    firebaseMode = true;
    authMod.onAuthStateChanged(auth, user => {
      currentUser = user;
      if (!user) {
        $('loginPanel').hidden = false; $('chatPanel').hidden = true; $('logoutBtn').hidden = true;
        status('Login required • Private chat');
        if (unsubscribeMessages) unsubscribeMessages();
        return;
      }
      if (!allowed(user.email)) { authMod.signOut(auth); return; }
      showChat(user);
      messagesRef = dbMod.ref(db, 'coupleChat/messages');
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = dbMod.onChildAdded(messagesRef, s => renderMessage(s.val()));
    });
  } catch (e) {
    firebaseMode = false;
    status('Demo mode • Firebase not connected');
  }
}

$('loginBtn').onclick = () => firebaseMode ? firebaseLogin() : demoLogin();
$('registerBtn').onclick = () => firebaseMode ? firebaseRegister() : demoRegister();
$('passwordInput').onkeydown = e => { if (e.key === 'Enter') (firebaseMode ? firebaseLogin() : demoLogin()); };
$('messageForm').onsubmit = async e => {
  e.preventDefault();
  const text = $('messageInput').value.trim(); if (!text || !currentUser) return;
  if (!firebaseMode) { demoSend(text); $('messageInput').value=''; return; }
  try {
    await window.__db.push(messagesRef, {senderUid:currentUser.uid, senderName:currentUser.email===ALLOWED_EMAILS[1]?'Fiancée':'You', senderEmail:currentUser.email, text, createdAt:Date.now(), serverTime:window.__db.serverTimestamp()});
    $('messageInput').value='';
  } catch(e) { message('Message send nahi hua. Firebase Database Rules check karein.'); }
};
$('emojiBtn').onclick = () => { $('messageInput').value += ' ❤️'; $('messageInput').focus(); };
$('logoutBtn').onclick = () => { if (auth) window.__fb.signOut(auth); };

status('Loading chat...');
initFirebase();

/* =========================================
   💌 DAILY LOVE NOTE
========================================= */
const loveNotes = [
    "Zindagi ka har naya din ek nayi umeed aur behtareen seekh lekar aata hai. ✨",
    "Ek saccha rishta wahi hai jahan dono ek doosre ki izzat aur khayalat ki qadar karein. 🙏",
    "Umeed hai humari aane wali baatein hum dono ke liye bohot sahi aur sahaj rahengi. 😊",
    "Zindagi me sabse badi khushi aapsi samajh aur sukoon se aati hai. 🤲",
    "Har naye safar ki neev agar dosti aur aitemad se rakhi jaye, toh wo bohot mazboot hoti hai. 🤝",
    "Main chahta hoon ki hum bina kisi jhijhak ke ek doosre ke vicharon ko samajh sakein.",
    "Aapki muskaan bohot pyaari aur saaf hai, Khuda ise hamesha yuhi salamat rakhe. 🌸",
    "Ek acchi aur lambi dosti ke liye poori honesty aur respect ka hona behad zaroori hai. ❤️"
];


function showNewLoveNote() {
    const noteElement = document.getElementById("dailyLoveNote");
    if (!noteElement) return;

    const randomIndex = Math.floor(Math.random() * loveNotes.length);
    const newNote = loveNotes[randomIndex];

    // Card internal smooth text transition
    noteElement.style.opacity = "0";
    noteElement.style.transform = "translateY(8px)";

    setTimeout(() => {
        noteElement.textContent = newNote;
        noteElement.style.opacity = "1";
        noteElement.style.transform = "translateY(0)";
    }, 250);
}

/* =========================================
   🎯 PERFECT UNIFIED SECTION SWITCHER WITH FADE ANIMATION
========================================= */
function switchSection(targetSection) {
  const chatCard = document.getElementById('chatCardSection');
  const loveNoteSection = document.getElementById('loveNoteSection');
  const loveStorySection = document.getElementById('loveStory');

  const sections = [
    { name: 'chat', element: chatCard, btnId: 'menu-chat' },
    { name: 'love-note', element: loveNoteSection, btnId: 'menu-love-note' },
    { name: 'love-story', element: loveStorySection, btnId: 'love-note-card' }
  ];

  // 1. Manage Active Class on Nav Links
  sections.forEach(sec => {
    const btn = document.getElementById(sec.btnId);
    if (btn) btn.classList.remove('active');
  });

  const activeSec = sections.find(sec => sec.name === targetSection);
  if (activeSec && document.getElementById(activeSec.btnId)) {
    document.getElementById(activeSec.btnId).classList.add('active');
  }

  // 2. Hide all sections immediately, reset animation classes
  sections.forEach(sec => {
    if (sec.element) {
      sec.element.style.display = 'none';
      sec.element.classList.remove('show-active');
    }
  });

  // 3. Display target section with smooth CSS fade transition
  if (activeSec && activeSec.element) {
    // For proper flex styling on love note
    if (targetSection === 'love-note') {
      activeSec.element.style.display = 'flex';
      showNewLoveNote(); // automatically pick a cute note
    } else if (targetSection === 'love-story') {
      activeSec.element.style.display = 'block';
    } else {
      activeSec.element.style.display = 'block';
    }

    // Trigger visual animation reflow
    setTimeout(() => {
      activeSec.element.classList.add('show-active');
    }, 20);
  }
}


/* =========================================
   🌐 FILE:// PROTOCOL FORCED FIREBASE FIX
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // अगर ब्राउज़र इसे लोकल फाइल की तरह चला रहा है, तो भी फ़ायरबेस मोड को ज़बरदस्ती एक्टिव रखना
    if (window.location.protocol === 'file:') {
        console.log("Local file system detected. Forcing Firebase initialized servers...");
        
        // सुनिश्चित करना कि लोडिंग स्टेटस अटकने पर वह खुद-ब-खुद फ़ायरबेस लिसनर्स को जगा दे
        if (typeof listenToCoupleStatus === "function") {
            setTimeout(listenToCoupleStatus, 1000);
        }
        
        // अगर चैट का कोई पुराना लोडिंग टेक्स्ट अटका है तो उसे हटाना
        const subTitle = document.querySelector('.chat-card p, .brand + span');
        if (subTitle && subTitle.textContent.includes('Loading')) {
            subTitle.textContent = 'Ready to connect ❤';
        }
    }
});


// Interactive alert helper for love dashboard features
function openLoveFeature(featureName) {
  alert("Coming Soon: " + featureName + " feature setup is ready to be linked! ❤️");
}

// Initial setup on page load
document.addEventListener("DOMContentLoaded", () => {
  const chatCard = document.getElementById('chatCardSection');
  if (chatCard) {
    chatCard.classList.add('show-active');
  }
});



/* =========================================
   OUR LITTLE LOVE WORLD
========================================= */

function openLoveFeature(feature) {

    const modal = document.getElementById("loveFeatureModal");
    const content = document.getElementById("loveFeatureContent");

    if (!modal || !content) return;

    modal.classList.add("show");

    let html = "";

    /* ================================
       LOVE NOTES
    ================================= */

    if (feature === "loveNotes") {

        html = `
            <h2 class="feature-title">💌 Love Notes</h2>

            <div class="love-note-card" id="loveNoteText">
                Tum meri favourite notification ho ❤️
            </div>

            <button class="love-action-btn"
                    onclick="newLoveNote()">
                💕 Another Note
            </button>
        `;
    }


    /* ================================
       WHY I LOVE YOU
    ================================= */

    else if (feature === "whyLove") {

        html = `
            <h2 class="feature-title">
                💖 Why I Love You
            </h2>

            <div class="reason-box" id="reasonText">
                Tumhari smile mera mood instantly change kar deti hai ❤️
            </div>

            <button class="love-action-btn"
                    onclick="newLoveReason()">
                💕 Tell Me Another Reason
            </button>
        `;
    }


    /* ================================
       QUIZ
    ================================= */

    else if (feature === "quiz") {

        html = `
            <h2 class="feature-title">
                🎮 Our Love Quiz
            </h2>

            <div id="quizBox"></div>
        `;

        setTimeout(loadLoveQuiz, 50);
    }


    /* ================================
       OPEN WHEN
    ================================= */

    else if (feature === "openWhen") {

        html = `
            <h2 class="feature-title">
                🌙 Open When...
            </h2>

            <div class="open-when-grid">

                <button class="open-when-card"
                    onclick="openWhenMessage(0)">
                    💕 When you miss me
                </button>

                <button class="open-when-card"
                    onclick="openWhenMessage(1)">
                    🥺 When you're sad
                </button>

                <button class="open-when-card"
                    onclick="openWhenMessage(2)">
                    😡 When you're angry
                </button>

                <button class="open-when-card"
                    onclick="openWhenMessage(3)">
                    🌙 When you can't sleep
                </button>

                <button class="open-when-card"
                    onclick="openWhenMessage(4)">
                    💍 When you think about our future
                </button>

                <button class="open-when-card"
                    onclick="openWhenMessage(5)">
                    🤗 When you need a hug
                </button>

            </div>

            <div id="openWhenResult"
                 class="love-note-card"
                 style="margin-top:20px;">
            </div>
        `;
    }


    /* ================================
       MEMORIES
    ================================= */

    else if (feature === "memories") {

        html = `
            <h2 class="feature-title">
                📸 Our Memories
            </h2>

            <label class="memory-upload">

                📷 Add A Beautiful Memory

                <input
                    type="file"
                    accept="image/*"
                    onchange="addMemory(event)"
                >

            </label>

            <div
                id="memoryPreview"
                class="memory-preview">
            </div>
        `;

        setTimeout(loadMemories, 50);
    }


    /* ================================
       VOICE
    ================================= */

    else if (feature === "voice") {

        html = `
            <h2 class="feature-title">
                🎧 My Voice
            </h2>

            <p class="feature-subtitle">
                Record something special for each other ❤️
            </p>

            <button
                class="love-action-btn"
                onclick="startVoiceRecording()">

                🎙️ Start Recording

            </button>

            <div id="voiceStatus"
                 style="text-align:center;margin-top:15px;color:#d81b60;">
            </div>

            <div id="voicePlayer"
                 style="margin-top:20px;">
            </div>
        `;
    }


    /* ================================
       DREAMS
    ================================= */

    else if (feature === "dreams") {

        html = `
            <h2 class="feature-title">
                ✈️ Our Dreams
            </h2>

            <div class="dream-input">

                <input
                    id="dreamInput"
                    placeholder="Add a dream...">

                <button
                    class="love-action-btn"
                    onclick="addDream()">

                    +

                </button>

            </div>

            <div
                id="dreamList"
                class="dream-list">
            </div>
        `;

        setTimeout(loadDreams, 50);
    }


    /* ================================
       DAILY QUESTION
    ================================= */

    else if (feature === "question") {

        html = `
            <h2 class="feature-title">
                💭 Today's Question
            </h2>

            <div class="love-note-card">

                <p id="dailyQuestion">
                    Agar hum abhi saath hote,
                    toh sabse pehle kya karte? ❤️
                </p>

            </div>

            <button
                class="love-action-btn"
                onclick="newDailyQuestion()">

                💕 Another Question

            </button>
        `;
    }


    /* ================================
       FUTURE
    ================================= */

    else if (feature === "future") {

        html = `
            <h2 class="feature-title">
                💍 Our Future
            </h2>

            <p class="feature-subtitle">
                Every second brings us closer ❤️
            </p>

            <div class="future-countdown">

                <div
                    id="futureCountdown"
                    class="countdown-number">
                    Loading...
                </div>

                <div class="countdown-label">
                    Until Our Special Day 💕
                </div>

            </div>
        `;

        setTimeout(startFutureCountdown, 50);
    }


    /* ================================
       SECRET
    ================================= */

    else if (feature === "secret") {

        html = `
            <h2 class="feature-title">
                🔐 Only For You
            </h2>

            <div class="secret-letter">

                ❤️ My Love,

                <br><br>

                Agar tum yahan tak aa gayi ho,
                toh ek baat aur kehni hai...

                <br><br>

                Tum sirf meri fiancée nahi ho.

                <br>

                Tum meri favourite person,
                meri happiness,
                aur meri future ho. ❤️

                <br><br>

                Main promise karta hoon,
                tumhare saath har beautiful
                moment create karunga.

                <br><br>

                Forever yours,

                <br>

                <strong>— Sanaul ❤️</strong>

            </div>
        `;
    }


    content.innerHTML = html;
}


/* =========================================
   CLOSE MODAL
========================================= */

function closeLoveFeature() {

    const modal =
        document.getElementById("loveFeatureModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


/* =========================================
   LOVE NOTES
========================================= */

const loveNotesData = [
    "Ek naye safar ki shuruaat hamesha ek sacchi dosti se honi chahiye. ✨",
	
    "Main chahta hoon ki hum pehle ek doosre ke khayalat aur pasand ko samjhein. 🙏",
	
    "Aapki har baat, aapki pasand aur aapki izzat mere liye sabse pehle priority hogi.",
	
    "Zindagi me rishtey umeed aur bharose par tikte hain, aur main wahi bharosa banana chahta hoon. 🤲",
	
    "Umeed hai jab humari baat-cheet shuru hogi, toh ye safar behad khoobsurat rahega.",
	
    "Main nahi chahta koi jaldbaazi ho, hum aaram se ek doosre ko jaantey aur samajhtey hain. 😊",
	
    "Aapki saadgi hi aapki sabse badi khoobsurati hai, Khuda is muskaan ko salamat rakhe.",
	
    "Ek acche humsafar se pehle, main aapka ek sabse accha aur saccha dost banna chahta hoon. ❤️"
];

function newLoveNote() {

    const box =
        document.getElementById("loveNoteText");

    if (!box) return;

    const index =
        Math.floor(Math.random() * loveNotesData.length);

    box.textContent = loveNotesData[index];
}


/* =========================================
   WHY I LOVE YOU
========================================= */

const loveReasons = [

    "Aapki saadgi aur khayalat jo is rishte ko sabse alag banate hain. ✨",
	
    "Humare beech ka aapsi aitemad aur ek doosre ke liye respect. 🙏",
	
    "Zindagi ke is naye safar ko dosti ke sath aage badhane ki umeed.",
	
    "Aapki har khushi aur sukoon ka hamesha khayal rakhne ka jazba. 🤲",
	
    "Ek doosre ke parivaar aur khayalat ki hamesha izzat karna.",
	
    "Har mushkil mod par ek mazboot bharosa ban kar sath khade rehna. 🤝",
	
    "Rishte ki shuruaat ek sacchi dosti aur poori honesty ke sath karna. 😊",
	
    "Khuda se is pakiza rishte me barkat aur hamesha khushiyan mangna."
];


function newLoveReason() {

    const box =
        document.getElementById("reasonText");

    if (!box) return;

    const index =
        Math.floor(Math.random() * loveReasons.length);

    box.textContent =
        loveReasons[index];
}


/* =========================================
   QUIZ
========================================= */

const loveQuiz = [

    {
        question:
            "Meri favourite person kaun hai? ❤️",

        options: [
            "Tum",
            "Tum hi",
            "Obviously Tum",
            "Sabhi answers"
        ],

        answer: 3
    },

    {
        question:
            "Hum future mein kya karna chahte hain? 💍",

        options: [
            "Saath travel",
            "Saath memories banana",
            "Saath life spend karna",
            "All of these ❤️"
        ],

        answer: 3
    },

    {
        question:
            "Tumhari smile mere liye kya hai? 😘",

        options: [
            "Normal",
            "Cute",
            "Beautiful",
            "Dangerously Beautiful ❤️"
        ],

        answer: 3
    }

];

let currentQuiz = 0;

function loadLoveQuiz() {

    currentQuiz = 0;

    showQuizQuestion();
}

function showQuizQuestion() {

    const box =
        document.getElementById("quizBox");

    if (!box) return;

    const q = loveQuiz[currentQuiz];

    box.innerHTML = `

        <div class="quiz-question">
            ${q.question}
        </div>

        ${q.options.map((option, index) => `

            <button
                class="quiz-option"
                onclick="answerQuiz(${index})">

                ${option}

            </button>

        `).join("")}

        <div
            id="quizResult"
            class="quiz-result">
        </div>
    `;
}

function answerQuiz(index) {

    const q = loveQuiz[currentQuiz];

    const result =
        document.getElementById("quizResult");

    if (!result) return;

    if (index === q.answer) {

        result.textContent =
            "Awww! You know us so well ❤️";

        setTimeout(() => {

            currentQuiz++;

            if (currentQuiz >= loveQuiz.length) {

                result.textContent =
                    "Quiz complete! You know my heart ❤️";

            } else {

                showQuizQuestion();

            }

        }, 1000);

    } else {

        result.textContent =
            "Wrong answer 😘 Try again, jaan ❤️";
    }
}


/* =========================================
   OPEN WHEN
========================================= */

const openWhenMessages = [
    "Jab aap thoda pareshan hon: 'Bilkut aaram se rahiye, main hamesha aapki baat sunne aur samajhne ke liye ek saccha dost ban kar sath hoon.' 😊",
	
    "Jab aap thoda udas hon: 'Khuda aapki muskaan ko salamat rakhe. Aapki khushi mere liye zindagi me sabse zyada qeemti hogi.' 🤲✨",
	
    "Jab aapko koi baat share karni ho: 'Bina kisi jhijhak ke aap apni har baat share kar sakti hain, main hamesha ek accha listener banunga.' 🙏",
	
    "Jab aapko hausla chahiye ho: 'Aap bohot samajhdar hain. Mujhe poora yakeen hai ki hum dono milkar har fikr ko aasan bana denge.' 🤝",
	
    "Jab aapko aitemad (Trust) chahiye hon: 'Main waada karta hoon ki is rishte me izzat, honesty aur aitbaar hamesha sabse upar rahega.' 💍",
	
    "Jab aap muskura rahi hon: 'Aapki ye pyari si saadgi aur muskaan is naye safar ki sabse khoobsurat shuruaat hai. Hamesha haste rahiye.' ✨❤️"
];


function openWhenMessage(index) {

    const box =
        document.getElementById("openWhenResult");

    if (!box) return;

    box.textContent =
        openWhenMessages[index];

    box.style.animation = "none";

    void box.offsetWidth;

    box.style.animation =
        "modalOpen .4s ease";
}


/* =========================================
   DAILY QUESTION
========================================= */

const dailyQuestions = [
    "Aapko life me sabse zyada sukoon kis cheez me milta hai? ✨",
    "Agar aapko kahin ghoomne jana ho, toh aapki dream destination kaun si hai? 🏔️",
    "Aapka favorite food kaun sa hai, aur kya aapko cooking karna pasand hai? 🍲",
    "Aapko hamesha haste rehna pasand hai ya aap thoda shaant rehna pasand karti hain? 😊",
    "Koi aisi hobby ya cheez jo aapko khali waqt me karna behad accha lagta hai? 🎨",
    "Aapki life ka sabse khoobsurat ya yaadgaar lamha kaun sa raha hai? 🌸",
    "Aapko barish ka mausam zyada pasand hai ya thand ka mausam? 🌧️❄️",
    "Aapko gusse me hamesha chup rehna pasand hai ya aap bol kar gussa saaf karti hain? 🤫"
];


function newDailyQuestion() {

    const box =
        document.getElementById("dailyQuestion");

    if (!box) return;

    const index =
        Math.floor(
            Math.random() * dailyQuestions.length
        );

    box.textContent =
        dailyQuestions[index];
}


/* =========================================
   OUR DREAMS
========================================= */

function addDream() {

    const input =
        document.getElementById("dreamInput");

    if (!input) return;

    const dream =
        input.value.trim();

    if (!dream) return;

    const dreams =
        JSON.parse(
            localStorage.getItem("ourDreams") || "[]"
        );

    dreams.push(dream);

    localStorage.setItem(
        "ourDreams",
        JSON.stringify(dreams)
    );

    input.value = "";

    loadDreams();
}

function loadDreams() {

    const list =
        document.getElementById("dreamList");

    if (!list) return;

    const dreams =
        JSON.parse(
            localStorage.getItem("ourDreams") || "[]"
        );

    if (!dreams.length) {

        list.innerHTML = `
            <p style="text-align:center;color:#a66a82;">
                Our dreams will live here ✈️❤️
            </p>
        `;

        return;
    }

    list.innerHTML =
        dreams.map((dream, index) => `

            <div class="dream-item">
                ✨ ${escapeLoveText(dream)}
            </div>

        `).join("");
}


/* =========================================
   MEMORIES
========================================= */

function addMemory(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e) {

        const memories =
            JSON.parse(
                localStorage.getItem("ourMemories") || "[]"
            );

        memories.push(e.target.result);

        localStorage.setItem(
            "ourMemories",
            JSON.stringify(memories)
        );

        loadMemories();
    };

    reader.readAsDataURL(file);
}

function loadMemories() {

    const box =
        document.getElementById("memoryPreview");

    if (!box) return;

    const memories =
        JSON.parse(
            localStorage.getItem("ourMemories") || "[]"
        );

    box.innerHTML =
        memories.map(image => `

            <div class="memory-item">

                <img src="${image}"
                     alt="Our memory">

            </div>

        `).join("");
}


/* =========================================
   VOICE RECORDING
========================================= */

let mediaRecorder;
let voiceChunks = [];

async function startVoiceRecording() {

    const status =
        document.getElementById("voiceStatus");

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        voiceChunks = [];

        mediaRecorder =
            new MediaRecorder(stream);

        mediaRecorder.ondataavailable =
            event => {

                voiceChunks.push(event.data);
            };

        mediaRecorder.onstop =
            () => {

                const blob =
                    new Blob(
                        voiceChunks,
                        { type: "audio/webm" }
                    );

                const url =
                    URL.createObjectURL(blob);

                document.getElementById("voicePlayer").innerHTML = `

                    <audio
                        controls
                        style="width:100%;">

                        <source src="${url}"
                                type="audio/webm">

                    </audio>
                `;

                stream
                    .getTracks()
                    .forEach(track => track.stop());

                status.textContent =
                    "Recording complete ❤️";

            };

        mediaRecorder.start();

        status.textContent =
            "🎙️ Recording... click OK in console or use stop button.";

        setTimeout(() => {

            if (
                mediaRecorder &&
                mediaRecorder.state === "recording"
            ) {

                mediaRecorder.stop();
            }

        }, 10000);

    } catch (error) {

        status.textContent =
            "Microphone permission required ❤️";
    }
}


/* =========================================
   FUTURE COUNTDOWN
========================================= */

function startFutureCountdown() {

    const target =
        new Date("November 1, 2027 00:00:00").getTime();

    const box =
        document.getElementById("futureCountdown");

    if (!box) return;

    function update() {

        const now =
            Date.now();

        const distance =
            target - now;

        if (distance <= 0) {

            box.textContent =
                "Our Day Is Here ❤️";

            return;
        }

        const days =
            Math.floor(
                distance / (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (distance / (1000 * 60 * 60)) % 24
            );

        const minutes =
            Math.floor(
                (distance / (1000 * 60)) % 60
            );

        const seconds =
            Math.floor(
                (distance / 1000) % 60
            );

        box.innerHTML = `
            ${days} Days<br>
            ${hours} Hours
            ${minutes} Minutes
            ${seconds} Seconds
        `;
    }

    update();

    setInterval(update, 1000);
}


/* =========================================
   SAFE TEXT
========================================= */

function escapeLoveText(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   MODAL OUTSIDE CLICK
========================================= */

document.addEventListener("click", function(event) {

    const modal =
        document.getElementById("loveFeatureModal");

    if (
        modal &&
        event.target === modal
    ) {

        closeLoveFeature();
    }

});




/* =========================================
   👑 TWO-WAY COUPLE STATUS LOGIC (FIREBASE)
========================================= */

// 1. फ़ायरबेस से दोनों स्टेटस एक साथ सुनना (Read)
function listenToCoupleStatus() {
    if (firebaseMode && window.__db && db) {
        // सनाउल का स्टेटस सुनना
        window.__db.onValue(window.__db.ref(db, 'coupleChat/status/sanaul'), (snapshot) => {
            const data = snapshot.val();
            document.getElementById("sanaulStatusText").textContent = data ? data : "No status set ❤️";
        });
        
        // मंगेतर का स्टेटस सुनना
        window.__db.onValue(window.__db.ref(db, 'coupleChat/status/fiancee'), (snapshot) => {
            const data = snapshot.val();
            document.getElementById("fianceeStatusText").textContent = data ? data : "No status set 💕";
        });
    } else {
        // डेमो मोड बैकअप (लोकल स्टोरेज)
        document.getElementById("sanaulStatusText").textContent = localStorage.getItem("status_sanaul") || "Demo Mode active 👑";
        document.getElementById("fianceeStatusText").textContent = localStorage.getItem("status_fiancee") || "Demo Mode active 🎀";
    }
}

// 2. लॉगिन यूजर के हिसाब से सही जगह स्टेटस अपडेट करना (Write)
async function updateCoupleStatus() {
    const input = document.getElementById("loveStatusInput");
    if (!input || !input.value.trim()) return;
    
    const newText = input.value.trim();
    
    // आपके कोड के ALLOWED_EMAILS[1] के आधार पर मंगेतर की पहचान (islamsanaul77@gmail.com)
    const isFiancee = currentUser && currentUser.email === ALLOWED_EMAILS[1];
    
    if (firebaseMode && window.__db && db) {
        // यूजर के हिसाब से फ़ायरबेस का सही पाथ तय करना
        const path = isFiancee ? 'coupleChat/status/fiancee' : 'coupleChat/status/sanaul';
        try {
            await window.__db.set(window.__db.ref(db, path), newText);
            input.value = ""; // इनपुट बॉक्स साफ करें
        } catch (e) {
            alert("Status save nahi hua. Firebase rules check karein!");
        }
    } else {
        // डेमो मोड में लोकल स्टोरेज अपडेट
        if (isFiancee || currentUser?.uid.includes(ALLOWED_EMAILS[1])) {
            localStorage.setItem("status_fiancee", newText);
            document.getElementById("fianceeStatusText").textContent = newText;
        } else {
            localStorage.setItem("status_sanaul", newText);
            document.getElementById("sanaulStatusText").textContent = newText;
        }
        input.value = "";
    }
}

// फ़ायरबेस लोड होने के लिए थोड़े समय बाद लिसनर को चालू करना
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(listenToCoupleStatus, 1500);
});



/* =========================================
   🚀 ULTIMATE IMAGE POPUP (100% FIXED)
========================================= */

// 1. स्क्रीन पर एक सुपर-हाई-प्रायोरिटी पॉप-अप बॉक्स बनाना (HTML से पूरी तरह आज़ाद)
function createUltimateLightbox() {
    if (document.getElementById("magicLightboxContainer")) return;

    const lightboxDiv = document.createElement("div");
    lightboxDiv.id = "magicLightboxContainer";
    // इसे सबसे पावरफुल CSS दी गई है ताकि यह पेज के हर एलिमेंट के ऊपर दिखे
    lightboxDiv.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(30, 15, 22, 0.94);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999999999 !important;
        cursor: zoom-out;
        opacity: 0;
        transition: opacity 0.25s ease;
    `;

    lightboxDiv.innerHTML = `
        <div style="position: relative; max-width: 85%; max-height: 85vh; cursor: default;" onclick="event.stopPropagation()">
            <button onclick="closeUltimateLightbox()" style="position: absolute; top: -18px; right: -18px; background: #e94f8a; color: white; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 22px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10;">×</button>
            <img id="magicLightboxImg" src="" style="max-width: 100%; max-height: 85vh; border-radius: 20px; border: 5px solid white; box-shadow: 0 25px 60px rgba(0,0,0,0.4); display: block;">
        </div>
    `;

    document.body.appendChild(lightboxDiv);
    
    // बाहर कहीं भी क्लिक करने पर बंद होने के लिए
    lightboxDiv.addEventListener("click", closeUltimateLightbox);
}

// 2. पॉप-अप को बंद करने का फ़ंक्शन
function closeUltimateLightbox() {
    const container = document.getElementById("magicLightboxContainer");
    if (container) {
        container.style.opacity = "0";
        setTimeout(() => { container.style.display = "none"; }, 250);
    }
}

// 3. गैलरी एरिया की किसी भी फोटो पर सीधे क्लिक इवेंट लागू करना
document.addEventListener("click", function (event) {
    // यह चेक करेगा कि क्या क्लिक "#memoryPreview" (यानी आपकी गैलरी) के अंदर किसी भी इमेज (IMG) पर हुआ है
    const previewContainer = document.getElementById("memoryPreview");
    
    if (previewContainer && previewContainer.contains(event.target)) {
        // इमेज का पता लगाना (चाहे डायरेक्ट इमेज पर क्लिक हो या उसके बॉक्स पर)
        let imgTag = event.target.tagName === "IMG" ? event.target : event.target.querySelector("img");
        
        if (imgTag && imgTag.src) {
            event.preventDefault();
            event.stopPropagation();

            // पॉप-अप बॉक्स तैयार करना
            createUltimateLightbox();

            const container = document.getElementById("magicLightboxContainer");
            const bigImg = document.getElementById("magicLightboxImg");

            if (container && bigImg) {
                bigImg.src = imgTag.src;
                container.style.display = "flex";
                // एनीमेशन को स्मूथ बनाने के लिए छोटा सा डिले
                setTimeout(() => { container.style.opacity = "1"; }, 30);
            }
        }
    }
}, true); // 'true' लगाने से पुराना कोई भी कोड इस क्लिक को ब्लॉक नहीं कर पाएगा



