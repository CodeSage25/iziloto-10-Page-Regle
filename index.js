(() => {
  "use strict";

  /* ==========================================================
     UTILS
     ========================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = () => window.innerWidth < 768;
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     INTERSECTION OBSERVER — scroll reveal
     ========================================================== */
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      $$(".anim, .letter-anim").forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    $$(".anim, .letter-anim").forEach((el) => observer.observe(el));
  }

  /* ==========================================================
     SCROLL PROGRESS BAR
     ========================================================== */
  function initScrollProgress() {
    const bar = $("#scrollProgress");
    if (!bar) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      bar.style.inlineSize = (scrollTop / docHeight) * 100 + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ==========================================================
     CONFETTI BURST
     ========================================================== */
  function fireConfetti() {
    if (prefersReducedMotion()) return;

    const container = $("#confetti");
    if (!container) return;

    const colors = [
      "#01AAE8",
      "#FEDF21",
      "#FF9800",
      "#ef5350",
      "#66bb6a",
      "#ab47bc",
      "#ec407a",
    ];
    const count = isMobile() ? 35 : 70;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.cssText = `
        left:${Math.random() * 100}%;
        top:-10px;
        width:${Math.random() * 8 + 4}px;
        height:${Math.random() * 8 + 4}px;
        background:${colors[(Math.random() * colors.length) | 0]};
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        animation-delay:${Math.random() * 1.5}s;
        animation-duration:${Math.random() * 2 + 2}s;
      `;
      frag.appendChild(el);
    }

    container.appendChild(frag);
    setTimeout(() => (container.innerHTML = ""), 5500);
  }

  /* ==========================================================
     FLOATING PARTICLES
     ========================================================== */
  function initParticles() {
    if (prefersReducedMotion()) return;

    const container = $("#particles");
    if (!container) return;

    const colors = ["#01AAE8", "#FEDF21", "#FF9800"];
    const count = isMobile() ? 8 : 18;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "particle";
      const size = Math.random() * 14 + 4;
      el.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[(Math.random() * colors.length) | 0]};
        animation-duration:${Math.random() * 15 + 10}s;
        animation-delay:${Math.random() * 10}s;
      `;
      frag.appendChild(el);
    }

    container.appendChild(frag);
  }

  /* ==========================================================
     SPARKLE TRAIL (non-touch only)
     ========================================================== */
  function initSparkles() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    let tick = 0;
    const colors = ["#01AAE8", "#FEDF21", "#FF9800", "#ef5350", "#66bb6a"];

    document.addEventListener("mousemove", (e) => {
      if (++tick % 4 !== 0) return;

      const el = document.createElement("div");
      el.className = "sparkle";
      const size = Math.random() * 5 + 3;
      el.style.cssText = `
        left:${e.clientX}px;
        top:${e.clientY}px;
        width:${size}px;
        height:${size}px;
        background:${colors[(Math.random() * colors.length) | 0]};
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 850);
    });
  }

  /* ==========================================================
     BALL INTERACTION (click / tap)
     ========================================================== */
  function initBalls() {
    if (prefersReducedMotion()) return;

    // inject keyframe once
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ball-spin {
        0%   { transform: scale(1) rotate(0deg); }
        50%  { transform: scale(1.25) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    const burstColors = ["#FEDF21", "#01AAE8", "#FF9800", "#ef5350"];

    $$(".ball").forEach((ball) => {
      ball.addEventListener("click", function () {
        // spin
        this.style.animation = "none";
        void this.offsetHeight;
        this.style.animation = `ball-spin 0.55s ${getComputedStyle(document.documentElement).getPropertyValue("--ease-bounce")}`;

        // micro burst
        const count = isMobile() ? 5 : 8;
        const rect = this.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < count; i++) {
          const dot = document.createElement("div");
          dot.style.cssText = `
            position:fixed;z-index:9999;pointer-events:none;
            width:5px;height:5px;border-radius:50%;
            background:${burstColors[(Math.random() * burstColors.length) | 0]};
            left:${cx}px;top:${cy}px;
            transition:all 0.55s ${getComputedStyle(document.documentElement).getPropertyValue("--ease-bounce")};
          `;
          document.body.appendChild(dot);

          const angle = ((Math.PI * 2) / count) * i;
          const dist = 28 + Math.random() * 22;
          requestAnimationFrame(() => {
            dot.style.left = cx + Math.cos(angle) * dist + "px";
            dot.style.top = cy + Math.sin(angle) * dist + "px";
            dot.style.opacity = "0";
            dot.style.transform = "scale(0)";
          });
          setTimeout(() => dot.remove(), 600);
        }
      });
    });
  }

  /* ==========================================================
     CARD TILT (non-touch only)
     ========================================================== */
  function initTilt() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    $$(".vcard").forEach((card) => {
      card.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform = `translateY(-10px) scale(1.03) perspective(600px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "";
      });
    });
  }

  /* ==========================================================
     JACKPOT GLOW
     ========================================================== */
  function initJackpotGlow() {
    if (prefersReducedMotion()) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes jackpot-glow {
        0%   { background-color: #fffbeb; box-shadow: none; }
        100% { background-color: #fef3c7; box-shadow: inset 0 0 18px rgba(217,119,6,.12); }
      }
    `;
    document.head.appendChild(style);

    $$(".gains__jackpot").forEach((row) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              row.style.animation =
                "jackpot-glow 2s ease-in-out infinite alternate";
            }
          });
        },
        { threshold: 0.3 },
      );
      obs.observe(row);
    });
  }

  /* ==========================================================
     COUNT-UP ANIMATION
     ========================================================== */
  function initCountUp() {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.counted) return;
          entry.target.dataset.counted = "1";

          const target =
            parseInt(entry.target.dataset.target, 10) ||
            parseInt(entry.target.textContent.replace(/\D/g, ""), 10);
          if (!target) return;

          let current = 0;
          const steps = 24;
          const inc = target / steps;
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = "x" + Math.round(current);
          }, 35);
        });
      },
      { threshold: 0.3 },
    );

    $$(".vcard__gain-value").forEach((el) => observer.observe(el));
  }

  /* ==========================================================
     CTA PULSE
     ========================================================== */
  function initCtaPulse() {
    if (prefersReducedMotion()) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes cta-pulse {
        0%   { transform: scale(1); }
        30%  { transform: scale(1.04); }
        60%  { transform: scale(0.98); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.animation = `cta-pulse 0.9s ${getComputedStyle(document.documentElement).getPropertyValue("--ease-bounce")}`;
            }, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    $$(".card__cta").forEach((el) => observer.observe(el));
  }

  /* ==========================================================
     BOOT
     ========================================================== */
  function init() {
    initScrollReveal();
    initScrollProgress();
    initParticles();
    initSparkles();
    initBalls();
    initTilt();
    initJackpotGlow();
    initCountUp();
    initCtaPulse();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", fireConfetti);
})();
