"use strict";

/* =========================
   Settings
========================= */
const WHATSAPP_NUMBER = "31613481358";
const WA_BASE = "https://wa.me/";

/* =========================
   Header shadow (safe)
========================= */
(() => {
  const header = document.querySelector("[data-elevate]");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =========================
   Mobile nav
========================= */
(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("nav-list");
  if (!navToggle || !navList) return;
  navToggle.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

/* =========================
   Reveal animations
========================= */
(() => {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".animate-in").forEach((el) => io.observe(el));
})();

/* =========================
   WhatsApp helpers
========================= */
function openWhatsApp(text = "") {
  window.open(`${WA_BASE}${WHATSAPP_NUMBER}${text ? `?text=${text}` : ""}`, "_blank");
}
(() => {
  ["whatsappNav", "whatsappHero", "whatsappContact", "whatsappBlank", "dockWA"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", (e) => { e.preventDefault(); openWhatsApp(); });
  });
})();

/* =========================
   Offerteformulier -> WhatsApp
========================= */
(() => {
  const form = document.getElementById("quoteForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const req = ["name", "address", "jobtype"];
    const miss = req.filter((k) => !String(d[k] || "").trim());
    if (miss.length) {
      alert("Vul a.u.b. de verplichte velden in: naam, adres/plaats en type klus.");
      return;
    }
    const msg = encodeURIComponent(
      [
        "Hallo John, ik wil graag een gratis offerte:",
        `• Naam: ${d.name}`,
        `• Adres/Plaats: ${d.address}`,
        `• Type klus: ${d.jobtype}`,
        `• Budget: ${d.budget || "-"}`,
        d.message ? `• Info: ${d.message}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
    openWhatsApp(msg);
  });
})();

/* =========================
   Footer year
========================= */
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* =========================
   Lightbox (simple)
========================= */
let lb;
function openLightbox(src, caption = "") {
  closeLightbox();
  lb = document.createElement("div");
  lb.className = "lb-backdrop";
  const img = new Image();
  img.src = src;
  img.alt = caption || "Projectfoto";
  const cap = document.createElement("div");
  cap.className = "lb-caption";
  cap.textContent = caption;
  lb.appendChild(img);
  if (caption) lb.appendChild(cap);
  lb.addEventListener("click", closeLightbox);
  document.body.appendChild(lb);
}
function closeLightbox() {
  if (lb) {
    lb.remove();
    lb = null;
  }
}
(() => {
  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.getAttribute("data-caption") || ""));
  });
})();

/* =========================
   Before/After slider (inline component)
========================= */
(() => {
  document.querySelectorAll("[data-ba]").forEach((card) => {
    const after = card.querySelector(".ba-after");
    const handle = card.querySelector(".ba-handle");
    const range = card.querySelector(".ba-range");
    if (!after || !range || !handle) return;
    function setSplit(p) {
      const v = Math.max(0, Math.min(100, parseInt(p, 10) || 50));
      after.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
      handle.style.left = `${v}%`;
    }
    setSplit(range.value);
    range.addEventListener("input", () => setSplit(range.value));
  });
})();

/* =========================
   Counters (start meteen)
========================= */
(() => {
  function animateCounter(el) {
    const to = parseInt(el.getAttribute("data-count-to"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    theCounter(el, to, suffix);
  }
  function theCounter(el, to, suffix) {
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const val = Math.floor(to * (t * (2 - t))); // easeOut
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".counter-number").forEach(animateCounter);
  });
})();

/* =========================
   Hero parallax (motion-safe)
========================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  const heroImg = document.querySelector(".hero-media img");
  const glow = document.querySelector(".hero-glow");
  if (!heroImg && !glow) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = Math.min(60, window.scrollY * 0.06);
      if (heroImg) heroImg.style.transform = `translateY(${y}px)`;
      if (glow) glow.style.transform = `translateY(${y * 0.6}px)`;
    },
    { passive: true }
  );
})();

/* =========================
   Open-nu status chip
   (ma–vr 08:30–17:30, za 09:00–13:00, zo gesloten)
========================= */
(() => {
  const el = document.getElementById("openState");
  if (!el) return;
  const now = new Date();
  const day = now.getDay(); // 0=zo..6=za
  const time = now.getHours() * 60 + now.getMinutes();
  const inRange = (start, end) => time >= start && time <= end;
  let open = false;
  if (day >= 1 && day <= 5) {
    open = inRange(8 * 60 + 30, 17 * 60 + 30);
    el.textContent = open ? "Nu geopend · tot 17:30" : "Nu gesloten · WhatsApp kan altijd";
  } else if (day === 6) {
    open = inRange(9 * 60, 13 * 60);
    el.textContent = open ? "Nu geopend · tot 13:00" : "Nu gesloten · WhatsApp kan altijd";
  } else {
    el.textContent = "Nu gesloten · WhatsApp kan altijd";
  }
})();

/* =========================
   Quick prefill chips -> WhatsApp
========================= */
(() => {
  const chips = document.querySelectorAll(".quickchips .chip");
  if (!chips.length) return;
  const num = "31613481358";
  chips.forEach((ch) =>
    ch.addEventListener("click", () => {
      const t = encodeURIComponent(
        `Hallo John, ik wil graag een offerte voor: ${ch.dataset.wa}. Foto's stuur ik mee in WhatsApp.`
      );
      window.open(`https://wa.me/${num}?text=${t}`, "_blank");
    })
  );
})();

/* =========================
   Reviews parallax background (robust)
========================= */
(() => {
  const s = document.querySelector(".section-reviews");
  if (!s) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let raf = null;
  function update() {
    const r = s.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (r.top + r.height / 2)) * 0.12;
    const y = Math.max(-120, Math.min(120, offset));
    s.style.setProperty("--rvx", y.toFixed(1) + "px");
    raf = null;
  }
  function onScroll() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          s.style.setProperty("--rvx", "0px");
        }
      });
    },
    { threshold: 0 }
  );
  io.observe(s);
})();

/* ======================================================
   Portfolio Viewer — px-based + image-fit + BA drag
====================================================== */
(() => {
  const section = document.querySelector(".section-portfolio.clean-mag");
  if (!section) return;

  const cards = section.querySelectorAll(".p-card");
  const modal = section.querySelector("[data-pv]");
  const backdrop = modal.querySelector(".pv-backdrop");
  const closeBtns = modal.querySelectorAll("[data-pv-close]");
  const prevBtn = modal.querySelector("[data-pv-prev]");
  const nextBtn = modal.querySelector("[data-pv-next]");
  const stageEl = modal.querySelector(".pv-stage");
  const track = modal.querySelector(".pv-track");
  const strip = modal.querySelector(".pv-strip");

  let index = 0, slides = [], thumbs = [];
  let slideW = 0;
  let resizeHandler = null;
  let baDragging = false;

  /* --- helpers --- */
  function applyTransform(px){ track.style.transform = `translate3d(${-px}px,0,0)`; }

  // Fit stage-hoogte aan de actieve foto (no-zoom)
  function fitStageToImage(idx){
    const slide = slides[idx];
    if (!slide) return;
    const img = slide.querySelector("img");
    if (!img) return;

    const apply = () => {
      const w = stageEl.clientWidth || 1;
      const ratio = (img.naturalHeight && img.naturalWidth) ? (img.naturalHeight / img.naturalWidth) : (3/4);
      const maxH = Math.min(window.innerHeight * 0.88, 1200);   // bijna fullscreen
      const targetH = Math.min(maxH, Math.round(w * ratio));
      stageEl.style.height = targetH + "px";

      // px-breedte per slide en exact uitlijnen
      slideW = stageEl.clientWidth;
      slides.forEach(s => s.style.width = slideW + "px");
      applyTransform(index * slideW);
    };

    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener("load", apply, { once: true });
  }

  function setActive(i){
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transition = "";
    applyTransform(index * slideW);

    slides.forEach((s, idx)=> s.setAttribute("aria-selected", idx===index ? "true" : "false"));
    thumbs.forEach((t, idx)=>{
      t.classList.toggle("is-active", idx===index);
      if (idx===index) t.scrollIntoView({ block:"nearest", inline:"center", behavior:"smooth" });
    });

    fitStageToImage(index);     // <— hoogte & breedtes op basis van foto
    initBA(slides[index]);      // (re)init BA indien nodig
  }
  const next = () => setActive(index + 1);
  const prev = () => setActive(index - 1);

  function open(id){
    track.innerHTML = "";
    strip.innerHTML = "";

    const tpl = section.querySelector(`#${id}`);
    if (!tpl){ console.warn("Template niet gevonden:", id); return; }
    track.appendChild(tpl.content.cloneNode(true));

    slides = Array.from(track.querySelectorAll(".pv-slide"));
    slides.forEach((s, i)=>{
      const img = s.querySelector("img");
      const th = document.createElement("li");
      th.className = "pv-thumb"; th.dataset.index = i;
      const ti = document.createElement("img");
      ti.src = img.src; ti.alt = img.alt || `Miniatuur ${i+1}`;
      th.appendChild(ti); strip.appendChild(th);
    });
    thumbs = Array.from(strip.querySelectorAll(".pv-thumb"));
    thumbs.forEach(th => th.addEventListener("click", ()=> setActive(+th.dataset.index)));

    // tonen -> daarna meten/fitten
    modal.hidden = false;
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(()=>{
      setActive(0);            // zet eerste slide
      fitStageToImage(0);      // fit op basis van eerste foto
      resizeHandler = () => fitStageToImage(index);
      window.addEventListener("resize", resizeHandler);
    });
  }

  function close(){
    modal.hidden = true;
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    window.removeEventListener("resize", resizeHandler);
    stageEl.style.height = "";
  }

  // Triggers
  cards.forEach(c=>{
    const id = c.getAttribute("data-gallery-id");
    c.addEventListener("click", ()=> open(id));
    c.addEventListener("keydown", e=>{
      if (e.key==="Enter" || e.key===" "){ e.preventDefault(); open(id); }
    });
  });
  backdrop.addEventListener("click", close);
  closeBtns.forEach(b => b.addEventListener("click", close));
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  window.addEventListener("keydown", e=>{
    if (modal.hidden) return;
    if (e.key==="Escape") close();
    if (e.key==="ArrowLeft") prev();
    if (e.key==="ArrowRight") next();
  });

  // Swipe (px-based) – buiten BA
  let downX=0, downY=0, curX=0, dragging=false, axis=null;
  const THRESH=60, LOCK=8;

  function onDown(e){
    if (modal.hidden) return;
    if (e.target.closest(".pv-ba")) return;  // BA heeft eigen drag
    if (e.target.closest(".ba-range")) return;
    dragging = true; axis = null;
    const p = e.touches ? e.touches[0] : e;
    downX = curX = p.clientX; downY = p.clientY;
    track.style.transition = "none";
  }
  function onMove(e){
    if (!dragging || baDragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - downX;
    const dy = p.clientY - downY;

    if (!axis){
      if (Math.abs(dx) > LOCK || Math.abs(dy) > LOCK){
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      } else return;
    }
    if (axis === "y") return;
    curX = p.clientX;
    applyTransform(index * slideW - dx);
    if (e.cancelable) e.preventDefault();
  }
  function onUp(){
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    const dx = curX - downX;
    if (axis === "x" && Math.abs(dx) > THRESH){ dx < 0 ? next() : prev(); }
    else { setActive(index); }
  }
  track.addEventListener("mousedown", onDown);
  track.addEventListener("mousemove", onMove);
  track.addEventListener("mouseup", onUp);
  track.addEventListener("mouseleave", onUp);
  track.addEventListener("touchstart", onDown, { passive:true });
  track.addEventListener("touchmove", onMove, { passive:false });
  track.addEventListener("touchend", onUp);

  // Before/After drag over gehele slide (in modal)
  function initBA(scope){
    const card = scope && scope.matches("[data-ba]") ? scope : null;
    if (!card || card.dataset.baInit) return;
    card.dataset.baInit = "1";

    const after  = card.querySelector(".ba-after");
    const handle = card.querySelector(".ba-handle");
    const range  = card.querySelector(".ba-range");
    if (!after || !handle || !range) return;

    const update = (v) => {
      const val = Math.max(0, Math.min(100, v));
      range.value = val;
      after.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      handle.style.left = `${val}%`;
    };
    update(parseInt(range.value,10) || 50);

    const setFromX = (clientX) => {
      const r = card.getBoundingClientRect();
      update(((clientX - r.left) / r.width) * 100);
    };

    function baStart(e){
      baDragging = true;
      if (e.cancelable) e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      setFromX(p.clientX);
      window.addEventListener("mousemove", baMove, { passive:false });
      window.addEventListener("touchmove", baMove, { passive:false });
      window.addEventListener("mouseup", baEnd);
      window.addEventListener("touchend", baEnd);
    }
    function baMove(e){
      if (!baDragging) return;
      const p = e.touches ? e.touches[0] : e;
      setFromX(p.clientX);
      if (e.cancelable) e.preventDefault();
    }
    function baEnd(){
      baDragging = false;
      window.removeEventListener("mousemove", baMove);
      window.removeEventListener("touchmove", baMove);
      window.removeEventListener("mouseup", baEnd);
      window.removeEventListener("touchend", baEnd);
    }

    card.addEventListener("mousedown", baStart);
    card.addEventListener("touchstart", baStart, { passive:false });
    range.addEventListener("input", () => update(parseInt(range.value,10) || 50));
  }
})();

/* =========================
   FAQ: accordion + hash open + WA CTA
========================= */
(() => {
  const faq = document.querySelector(".section-faq");
  if (!faq) return;

  // Eén tegelijk open
  const items = faq.querySelectorAll("details.faq-item");
  items.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
    });
  });

  // Hash -> open juiste vraag
  if (location.hash) {
    const target = faq.querySelector(location.hash);
    if (target && target.tagName.toLowerCase() === "details") {
      target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // WhatsApp CTA met prefill
  const btn = document.getElementById("whatsappFAQ");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const t = encodeURIComponent(
        "Hallo John, ik wil graag een gratis offerte.\n" +
          "• Naam: \n• Adres/Plaats: \n• Type klus: \n• M² (geschat): \n• Foto's stuur ik zo mee."
      );
      if (typeof openWhatsApp === "function") openWhatsApp(t);
      else window.open(`https://wa.me/31613481358?text=${t}`, "_blank");
    });
  }
})();
