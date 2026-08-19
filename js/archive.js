(() => {
  function render(data) {
    const gallery = (data.gallery || []).slice().sort((a, b) => Number(a.sort_order || 999) - Number(b.sort_order || 999));
    const grid = document.getElementById("galleryGrid");
    grid.innerHTML = "";

    gallery.slice(0, 8).forEach((item, index) => {
      const card = document.createElement(item.source_url ? "a" : "div");
      card.className = "contact";
      if (item.source_url) {
        card.href = item.source_url;
        card.target = "_blank";
        card.rel = "noreferrer";
      }
      const frame = 102 + index * 11;
      card.innerHTML = `
        <div class="contact-top"><span>FRM_${String(frame).padStart(4, "0")}</span><span>CH_${String((index % 4) + 2).padStart(2, "0")}</span></div>
        <img class="contact-image" src="${item.image_url || ""}" alt="${item.alt_text || ""}" loading="lazy" />
        <div class="contact-bottom"><span>${item.title || "VISUAL FILE"}</span><span>${String(index + 1).padStart(2, "0")}</span></div>`;
      grid.appendChild(card);
    });

    const hero = document.getElementById("heroImage");
    const about = document.getElementById("aboutImage");
    const rupture = document.getElementById("unreleasedArtwork");
    const visual = gallery[0]?.image_url || "";
    hero.src = gallery[5]?.image_url || visual;
    about.src = gallery[3]?.image_url || visual;
    rupture.src = gallery[1]?.image_url || visual;
  }

  window.The2ioArchive = { render };
})();