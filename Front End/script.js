/* =================== MOBILE MENU =================== */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

/* =================== HERO STARFIELD =================== */
const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, stars;
  const STAR_COUNT = 150;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * w,
    }));
  }

  function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      s.z -= 2;
      if (s.z <= 0) s.z = w;
      const k = 128.0 / s.z;
      const px = s.x * k + w / 2;
      const py = s.y * k + h / 2;
      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        const size = (1 - s.z / w) * 2;
        ctx.fillStyle = "#8e2de2";
        ctx.fillRect(px, py, size, size);
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener("resize", resize);
}

/* =================== CONTACT FORM =================== */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending...";
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      const res = await fetch("https://nais-backend.onrender.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        statusEl.textContent = "✅ Message sent successfully!";
        form.reset();
      } else {
        statusEl.textContent = `❌ ${data.error || "Something went wrong."}`;
      }
    } catch (err) {
      statusEl.textContent = "⚠️ Failed to send message. Try again later.";
      console.error(err);
    }
  });
}
