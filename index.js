// =============================================
// INTERSECTION OBSERVER - Scroll Animations
// =============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".anim, .table-row-anim, .letter-circle-anim")
  .forEach((el) => {
    observer.observe(el);
  });

// =============================================
// SCROLL PROGRESS BAR
// =============================================
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";
});

// =============================================
// CONFETTI BURST ON LOAD
// =============================================
function createConfetti() {
  const container = document.getElementById("confetti");
  const colors = [
    "#01AAE8",
    "#FEDF21",
    "#FF9800",
    "#ef5350",
    "#66bb6a",
    "#ab47bc",
    "#ec407a",
  ];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-10px";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = Math.random() * 10 + 5 + "px";
    confetti.style.animationDelay = Math.random() * 1.5 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    container.appendChild(confetti);
  }

  // Remove confetti after animation
  setTimeout(() => {
    container.innerHTML = "";
  }, 5000);
}

window.addEventListener("load", createConfetti);

// =============================================
// FLOATING PARTICLES BACKGROUND
// =============================================
function createParticles() {
  const container = document.getElementById("particles");
  const colors = ["#01AAE8", "#FEDF21", "#FF9800"];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    const size = Math.random() * 20 + 5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = Math.random() * 15 + 10 + "s";
    particle.style.animationDelay = Math.random() * 10 + "s";
    container.appendChild(particle);
  }
}

createParticles();

// =============================================
// CURSOR SPARKLE TRAIL
// =============================================
let sparkleThrottle = 0;

document.addEventListener("mousemove", (e) => {
  sparkleThrottle++;
  if (sparkleThrottle % 3 !== 0) return;

  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  const colors = ["#01AAE8", "#FEDF21", "#FF9800", "#ef5350", "#66bb6a"];
  sparkle.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  const size = Math.random() * 6 + 4;
  sparkle.style.width = size + "px";
  sparkle.style.height = size + "px";
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 800);
});

// =============================================
// BALL CLICK INTERACTION
// =============================================
document.querySelectorAll(".t-ball").forEach((ball) => {
  ball.addEventListener("click", function () {
    this.style.animation = "none";
    this.offsetHeight; // Trigger reflow
    this.style.animation = "ballSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";

    // Mini confetti burst from ball
    for (let i = 0; i < 8; i++) {
      const mini = document.createElement("div");
      mini.style.position = "fixed";
      mini.style.width = "6px";
      mini.style.height = "6px";
      mini.style.borderRadius = "50%";
      mini.style.backgroundColor = ["#FEDF21", "#01AAE8", "#FF9800", "#ef5350"][
        Math.floor(Math.random() * 4)
      ];
      mini.style.pointerEvents = "none";
      mini.style.zIndex = "9999";

      const rect = this.getBoundingClientRect();
      mini.style.left = rect.left + rect.width / 2 + "px";
      mini.style.top = rect.top + rect.height / 2 + "px";

      const angle = ((Math.PI * 2) / 8) * i;
      const dist = 40 + Math.random() * 30;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      mini.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
      document.body.appendChild(mini);

      requestAnimationFrame(() => {
        mini.style.left = rect.left + rect.width / 2 + dx + "px";
        mini.style.top = rect.top + rect.height / 2 + dy + "px";
        mini.style.opacity = "0";
        mini.style.transform = "scale(0)";
      });

      setTimeout(() => mini.remove(), 700);
    }
  });
});

// Add ballSpin keyframes dynamically
const spinStyle = document.createElement("style");
spinStyle.textContent = `
    @keyframes ballSpin {
        0%   { transform: scale(1) rotate(0deg); }
        50%  { transform: scale(1.3) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// =============================================
// VARIANT CARD TILT EFFECT ON MOUSE MOVE
// =============================================
document.querySelectorAll(".variant-card").forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    this.style.transform = `translateY(-12px) scale(1.03) perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "";
  });
});

// =============================================
// JACKPOT ROW GLOW PULSE
// =============================================
const jackpotRows = document.querySelectorAll(".jackpot-row");

jackpotRows.forEach((row) => {
  const pulseObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          row.style.animation = "jackpotGlow 2s ease-in-out infinite alternate";
        }
      });
    },
    { threshold: 0.5 },
  );
  pulseObserver.observe(row);
});

const jackpotStyle = document.createElement("style");
jackpotStyle.textContent = `
    @keyframes jackpotGlow {
        0%   { background-color: #fffbeb; box-shadow: none; }
        100% { background-color: #fef3c7; box-shadow: inset 0 0 20px rgba(217, 119, 6, 0.15); }
    }
`;
document.head.appendChild(jackpotStyle);

// =============================================
// NUMBER COUNT-UP ANIMATION FOR GAIN VALUES
// =============================================
function animateCountUp(element, target, prefix = "x") {
  let current = 0;
  const increment = target / 30;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = prefix + Math.round(current);
  }, 30);
}

// Observe gain-big elements for count-up
const gainObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = "true";
        const text = entry.target.textContent;
        const num = parseInt(text.replace(/[^0-9]/g, ""));
        if (num) {
          animateCountUp(entry.target, num, "x");
        }
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".gain-big").forEach((el) => {
  gainObserver.observe(el);
});

// =============================================
// CTA BOX PULSE ATTENTION
// =============================================
const ctaObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation =
            "ctaPulse 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
        }, 800);
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".cta-box").forEach((el) => ctaObserver.observe(el));

const ctaStyle = document.createElement("style");
ctaStyle.textContent = `
    @keyframes ctaPulse {
        0%   { transform: scale(1); }
        30%  { transform: scale(1.05); }
        60%  { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(ctaStyle);
