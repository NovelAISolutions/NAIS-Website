/* =================== MOBILE MENU =================== */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

/* =================== SMOOTH SCROLL =================== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      navMenu?.classList.remove("open");
    }
  });
});

/* =================== INTERSECTION REVEAL =================== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* =================== 3D-ish TILT CARDS =================== */
const tiltEls = document.querySelectorAll(".tilt");
tiltEls.forEach((card) => {
  const damp = 12;
  let px = 0,
    py = 0;

  function handleMove(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * damp; // rotateX
    const ry = (x - 0.5) * damp; // rotateY
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }

  function reset() {
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  }

  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", reset);
});

/* =================== HERO CANVAS STARFIELD =================== */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

let w, h, cx, cy, stars;
const STAR_COUNT = 160; // adjust for density
const Z_MIN = 0.1;
const Z_MAX = 1.0;
const SPEED = 0.006;

function resize() {
  w = canvas.width = canvas.offsetWidth;
  h = canvas.height = canvas.offsetHeight;
  cx = w / 2;
  cy = h / 2;
  stars = Array.from({ length: STAR_COUNT }, () => newStar());
}
function newStar() {
  // pseudo-3D: x,y in plane, z for scale
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * Math.max(w, h) * 0.6 + 20;
  const z = Math.random() * (Z_MAX - Z_MIN) + Z_MIN;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z,
  };
}
function step() {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(cx, cy);

  for (let s of stars) {
    // move star toward viewer
    s.z -= SPEED;
    if (s.z <= Z_MIN) {
      Object.assign(s, newStar(), { z: Z_MAX });
    }

    const scale = 1 / s.z;
    const x = s.x * scale * 0.3;
    const y = s.y * scale * 0.3;

    // gradient color between primary and accent
    const t = Math.min(1, Math.max(0, (1 - s.z) / (1 - Z_MIN)));
    const r = Math.floor(0 + (142 - 0) * t); // 0 -> 142
    const g = Math.floor(191 + (45 - 191) * t); // 191 -> 45 approximation
    const b = Math.floor(255 + (226 - 255) * t); // 255 -> 226

    ctx.beginPath();
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.85 * (1.2 - s.z)})`;
    ctx.arc(x, y, Math.max(0.7, 2.6 * (1 - s.z)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  requestAnimationFrame(step);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(step);
