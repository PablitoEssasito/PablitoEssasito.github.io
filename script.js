document.getElementById("year").textContent = new Date().getFullYear();

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
        <span class="tool-tag">${tool.tag}</span>
        <h2>${tool.name}</h2>
        <p>${tool.description}</p>
      `;

      grid.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("tools").innerHTML =
      '<p class="loading">Failed to load the tools list.</p>';
  });
