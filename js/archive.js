(() => {
  function installAboutPlaceholderStyles() {
    if (document.getElementById("the2ioAboutPlaceholderStyles")) return;
    const style = document.createElement("style");
    style.id = "the2ioAboutPlaceholderStyles";
    style.textContent = `
      .id-portrait.about-placeholder{
        display:grid;
        place-items:center;
        padding:18px;
        background:
          linear-gradient(rgba(0,0,0,.08) 1px,transparent 1px),
          linear-gradient(90deg,rgba(0,0,0,.08) 1px,transparent 1px),#bab9b1;
        background-size:24px 24px;
      }
      .id-portrait.about-placeholder img{display:none}
      .about-placeholder-copy{
        width:100%;
        color:#111;
        font:700 8px/1.6 var(--mono);
        letter-spacing:.13em;
        text-transform:uppercase;
        text-align:center;
      }
      .about-placeholder-copy strong{
        display:block;
        margin-bottom:8px;
        font-family:var(--cond);
        font-size:24px;
        line-height:1;
        letter-spacing:-.02em;
      }
    `;
    document.head.appendChild(style);
  }

  function setupAboutPortrait(about) {
    if (!about) return;
    installAboutPlaceholderStyles();

    const frame = about.parentElement;
    const imagePath = "assets/ilya-about.png";

    const showPlaceholder = () => {
      frame.classList.add("about-placeholder");
      if (!frame.querySelector(".about-placeholder-copy")) {
        const copy = document.createElement("div");
        copy.className = "about-placeholder-copy";
        copy.innerHTML = `<strong>IMAGE FILE</strong>SUBJECT_02 // PENDING`;
        frame.appendChild(copy);
      }
    };

    about.addEventListener("load", () => {
      frame.classList.remove("about-placeholder");
      frame.querySelector(".about-placeholder-copy")?.remove();
    }, { once: true });

    about.addEventListener("error", showPlaceholder, { once: true });
    about.alt = "Ilya";
    about.src = imagePath;
  }

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
    setupAboutPortrait(about);

    const ruptureSrc = gallery[1]?.image_url || visual || rupture.getAttribute("src") || "";
    if (ruptureSrc) {
      rupture.src = ruptureSrc;
      document.querySelectorAll("[data-mosh-artwork]").forEach(copy => copy.src = ruptureSrc);
    }
  }

  window.The2iOArchive = { render };
})();
