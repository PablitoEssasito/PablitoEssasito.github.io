document.getElementById("year").textContent = new Date().getFullYear();

const JET_MARK = `<svg class="tool-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 2c.8 0 1.4 1.2 1.4 2.8v3.4l7.6 4.4v2l-7.6-2.2v4l2.4 1.8v1.6L12 19l-3.8.8v-1.6l2.4-1.8v-4L3 14.6v-2l7.6-4.4V4.8C10.6 3.2 11.2 2 12 2Z"/>
</svg>`;

function spawnParticles() {
  const container = document.getElementById("particles");
  if (!container || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = 26;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--size", `${1.5 + Math.random() * 2.5}px`);
    p.style.setProperty("--duration", `${10 + Math.random() * 14}s`);
    p.style.setProperty("--delay", `${Math.random() * -20}s`);
    p.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
    p.style.setProperty("--spark-color", Math.random() > 0.5 ? "#5b9dff" : "#7c5bff");
    container.appendChild(p);
  }
}

// Top-down planforms drawn to true relative scale (10 units = 1 m) in a shared
// 200x120 viewBox, both anchored so the engine exhaust sits at x=20 — that is
// where the contrails attach. Each half-outline is drawn twice, the second time
// mirrored about the centreline, so the symmetry is exact.
const JET_MIRROR = "translate(0,120) scale(1,-1)";

const JETS = {
  // F-16C: 15.06 m long, 9.96 m span. Cropped-delta wing at 40 deg, straight
  // trailing edge, blended body with sharp forebody strakes, single fin.
  f16: {
    color: "#5b9dff",
    noseInset: 0.145,
    trails: [50],
    body: "M171,60Q162,56.2 151,53.4Q141,51.4 129,50.4L120,50L95,46.2L64,10L52,11L51,49L45,49.8L29,32.5L22,33.5L17,50.4L20,54.4L20,60Z",
    fin: "M60,60L34,55.2L9,54.6L7,60Z",
  },
  // MiG-29: 17.32 m long, 11.36 m span. Pitot probe, near-parallel forward
  // fuselage, LERX flaring late and kinking into a 42 deg swept wing, widely
  // spaced engines, twin canted fins on booms outboard of them.
  mig29: {
    color: "#ff4d4d",
    noseInset: 0.035,
    trails: [40.2, 59.8],
    body: "M193,60L178,58.8L175,57.8Q166,54 158,51Q150,50.2 140,49.6L128,49Q116,46 107,42Q102,40 99,39L66.6,3L55,5L52,39L44,39.5L23,22L12,23L14,39L18,41.5L18,55L26,56.5L26,60Z",
    fin: "M62,45L50,33L42,33.5L38,45Z",
  },
};

function jetSvg(jet) {
  return `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <path d="${jet.body}"/><path d="${jet.fin}"/>
      <path d="${jet.body}" transform="${JET_MIRROR}"/>
      <path d="${jet.fin}" transform="${JET_MIRROR}"/>
    </g>
  </svg>`;
}

function spawnPlanes() {
  const container = document.getElementById("planes");
  if (!container || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const count = 6;
  for (let i = 0; i < count; i++) {
    // The two types fly opposite ways, so their paths cross — reads as a fight
    // rather than a formation.
    const reverse = i % 2 === 0;
    const jet = JETS[reverse ? "f16" : "mig29"];

    const plane = document.createElement("div");
    plane.className = reverse ? "plane reverse" : "plane";
    plane.style.setProperty("--y", `${6 + Math.random() * 70}%`);
    plane.style.setProperty("--w", `${58 + Math.random() * 30}px`);
    plane.style.setProperty("--op", `${0.11 + Math.random() * 0.09}`);
    plane.style.setProperty("--plane-color", jet.color);
    plane.style.setProperty("--nose-inset", jet.noseInset);
    plane.style.setProperty("--duration", `${34 + Math.random() * 30}s`);
    plane.style.setProperty("--delay", `${-Math.random() * 40}s`);

    const wrap = document.createElement("div");
    wrap.className = "plane-wrap";
    wrap.style.setProperty("--bob-duration", `${3 + Math.random() * 3}s`);
    wrap.style.setProperty("--bob-delay", `${-Math.random() * 4}s`);
    wrap.style.setProperty("--bob-amt", `${4 + Math.random() * 6}px`);

    for (const top of jet.trails) {
      const trail = document.createElement("span");
      trail.className = "plane-trail";
      trail.style.top = `${top}%`;
      wrap.appendChild(trail);
    }

    const body = document.createElement("span");
    body.className = "plane-body";
    body.innerHTML = jetSvg(jet);
    wrap.appendChild(body);

    const flash = document.createElement("span");
    flash.className = "plane-flash";
    flash.style.setProperty("--flash-duration", `${3 + Math.random() * 4}s`);
    flash.style.setProperty("--flash-delay", `${-Math.random() * 6}s`);
    wrap.appendChild(flash);

    plane.appendChild(wrap);
    container.appendChild(plane);
  }
}

function attachCardGlow(card) {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
}

spawnParticles();
spawnPlanes();

fetch("tools.json")
  .then((res) => res.json())
  .then((tools) => {
    const grid = document.getElementById("tools");
    grid.innerHTML = "";

    tools.forEach((tool, i) => {
      const card = document.createElement("a");
      card.className = "tool-card";
      card.href = tool.url;
      card.target = "_blank";
      card.rel = "noopener";
      card.style.animationDelay = `${i * 0.08}s`;

      card.innerHTML = `
        <span class="tool-tag">${JET_MARK}${tool.tag}</span>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <span class="tool-foot">Open tool <span class="tool-arrow">→</span></span>
      `;

      attachCardGlow(card);
      grid.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("tools").innerHTML =
      '<p class="loading">Failed to load the tools list.</p>';
  });
