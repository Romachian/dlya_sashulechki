// ====== НАСТРОЙКИ ======
const GIRL_NAME = "Саша";

// Причины — можешь поменять тексты на свои
const REASONS = [
{ title: "Твоя преданность", text: "Ты всегда рядом и умеешь поддержать." },
{ title: "Твоя нежность", text: "С тобой спокойно и тепло." },
{ title: "Твой юмор", text: "Ты умеешь рассмешить даже в самый тяжёлый день." },
{ title: "Твоя красота", text: "Ты прекрасна — каждый раз, когда я тебя вижу." },
{ title: "Твоё сердце", text: "Ты добрая, настоящая и очень заботливая." },
{ title: "Наше будущее", text: "Я хочу провести его с тобой 💗" },
];

// Фото в галерее: положи файлы в assets/memories/
const MEMORIES = [
{ src: "assets/memories/1.jpg", caption: "Воспоминание 1" },
{ src: "assets/memories/2.jpg", caption: "Воспоминание 2" },
{ src: "assets/memories/3.jpg", caption: "Воспоминание 3" },
{ src: "assets/memories/4.jpg", caption: "Воспоминание 4" },
{ src: "assets/memories/5.jpg", caption: "Воспоминание 5" },
{ src: "assets/memories/6.jpg", caption: "Воспоминание 6" },
];

// Пары для игры (6 пар = 12 карточек)
const PAIRS = ["💝","🎀","🧸","🌷","🍫","💗"];

// ====== НАВИГАЦИЯ ======
const steps = [...document.querySelectorAll(".step")];
const startBtn = document.getElementById("startBtn");
const toMemoryBtn = document.getElementById("toMemoryBtn");
const toGalleryBtn = document.getElementById("toGalleryBtn");
const toFinalBtn = document.getElementById("toFinalBtn");
const restartBtn = document.getElementById("restartBtn");

function showStep(n){
steps.forEach(s => s.classList.remove("active"));
document.querySelector(`.step[data-step="${n}"]`)?.classList.add("active");
window.scrollTo({top:0, behavior:"smooth"});
}

startBtn?.addEventListener("click", () => showStep(2));
toGalleryBtn?.addEventListener("click", () => showStep(4));
toFinalBtn?.addEventListener("click", () => showStep(5));
restartBtn?.addEventListener("click", () => window.location.reload());

// ====== ЭКРАН 2: ПРИЧИНЫ ======
const reasonsWrap = document.getElementById("reasons");
let openedCount = 0;

function renderReasons(){
reasonsWrap.innerHTML = "";
openedCount = 0;
toMemoryBtn.disabled = true;

REASONS.forEach((r) => {
const item = document.createElement("div");
item.className = "reason";
item.innerHTML = `
<div class="heart" role="button" aria-label="Открыть">❤</div>
<div class="text">
<p class="label">${r.title}</p>
<p class="hidden">${r.text}</p>
</div>
`;

const heart = item.querySelector(".heart");
heart.addEventListener("click", () => {
if (item.classList.contains("open")) return;
item.classList.add("open");
openedCount++;
if (openedCount >= REASONS.length) toMemoryBtn.disabled = false;
});

reasonsWrap.appendChild(item);
});
}

toMemoryBtn?.addEventListener("click", () => {
showStep(3);
initGame();
});

renderReasons();

// ====== ЭКРАН 3: ИГРА "НАЙДИ ПАРЫ" ======
const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");

let deck = [];
let revealed = [];
let moves = 0;
let matched = 0;
let lock = false;

function shuffle(arr){
for (let i = arr.length - 1; i > 0; i--){
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}

function initGame(){
deck = shuffle([...PAIRS, ...PAIRS]).map((v, idx) => ({ id: idx, v, matched:false }));
revealed = [];
moves = 0;
matched = 0;
lock = false;
movesEl.textContent = "0";
toGalleryBtn.disabled = true;

grid.innerHTML = "";
deck.forEach(card => {
const btn = document.createElement("button");
btn.className = "tile";
btn.type = "button";
btn.setAttribute("aria-label", "карточка");
btn.textContent = "?";
btn.addEventListener("click", () => flip(card.id, btn));
grid.appendChild(btn);
});
}

function flip(id, el){
if (lock) return;
const card = deck.find(c => c.id === id);
if (!card || card.matched) return;
if (revealed.some(r => r.id === id)) return;

el.textContent = card.v;
el.classList.add("revealed");
revealed.push({ id, v: card.v, el });

if (revealed.length === 2){
moves++;
movesEl.textContent = String(moves);
const [a,b] = revealed;
lock = true;

if (a.v === b.v){
deck.find(c => c.id === a.id).matched = true;
deck.find(c => c.id === b.id).matched = true;
a.el.classList.add("matched");
b.el.classList.add("matched");
matched += 2;

revealed = [];
lock = false;

if (matched === deck.length){
toGalleryBtn.disabled = false;
}
} else {
setTimeout(() => {
a.el.textContent = "?";
b.el.textContent = "?";
a.el.classList.remove("revealed");
b.el.classList.remove("revealed");
revealed = [];
lock = false;
}, 650);
}
}
}

// ====== ЭКРАН 4: ГАЛЕРЕЯ ======
const gallery = document.getElementById("gallery");
function renderGallery(){
gallery.innerHTML = "";
MEMORIES.forEach((m) => {
const card = document.createElement("div");
card.className = "photo";
card.innerHTML = `
<img src="${m.src}" alt="${m.caption}" loading="lazy" />
<div class="cap">${m.caption}</div>
`;
gallery.appendChild(card);
});
}
renderGallery();

// ====== ФИНАЛЬНЫЙ ТЕКСТ ======
const finalText = document.getElementById("finalText");
if (finalText){
finalText.textContent = `С 8 Марта, ${GIRL_NAME}! Я хочу провести с тобой наше будущее.`;
}

// ====== ФОНОВЫЕ СЕРДЕЧКИ ======
const heartsRoot = document.querySelector(".hearts");
function spawnHeart(){
const el = document.createElement("div");
el.className = "heart-float";
el.textContent = Math.random() > 0.2 ? "💗" : "💝";
const left = Math.random() * 100;
const size = 14 + Math.random() * 18;
const duration = 6 + Math.random() * 6;
const drift = (Math.random() * 160 - 80).toFixed(0);

el.style.left = `${left}vw`;
el.style.fontSize = `${size}px`;
el.style.animationDuration = `${duration}s`;
el.style.setProperty("--drift", `${drift}px`);

heartsRoot.appendChild(el);
setTimeout(() => el.remove(), duration * 1000);
}
setInterval(spawnHeart, 500);