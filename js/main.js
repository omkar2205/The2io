(() => {
  const two = value => String(value).padStart(2, "0");

  function tick() {
    const date = new Date();
    const stamp = `${date.getFullYear()}.${two(date.getMonth() + 1)}.${two(date.getDate())} // ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
    document.getElementById("heroDate").textContent = stamp;
    document.getElementById("topClock").textContent = `${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
  }

  function installSubjectSocialStyles() {
    if (document.getElementById("the2ioSubjectSocialStyles")) return;

    const style = document.createElement("style");
    style.id = "the2ioSubjectSocialStyles";
    style.textContent = `
      .subject-socials{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:10px;
        margin-top:14px;
      }
      .subject-social-link{
        min-height:90px;
        display:grid;
        place-items:center;
        border:1px solid var(--line);
        background:rgba(222,221,212,.018);
        color:#b8b7ae;
        transition:border-color .16s ease,color .16s ease,background .16s ease,box-shadow .16s ease;
      }
      .subject-social-link:hover{
        border-color:var(--acid);
        color:var(--acid);
        background:rgba(216,255,50,.045);
        box-shadow:inset 0 0 18px rgba(216,255,50,.035),0 0 14px rgba(216,255,50,.06);
      }
      .subject-social-link svg{
        width:34px;
        height:34px;
        display:block;
        overflow:visible;
      }
      .subject-social-link:focus-visible{
        outline:1px solid var(--acid);
        outline-offset:3px;
      }
    `;
    document.head.appendChild(style);
  }

  function renderSubjectSocials(settings) {
    const container = document.querySelector(".sidebar .module .data-list");
    if (!container) return;

    installSubjectSocialStyles();
    container.className = "subject-socials";

    const instagramUrl = settings.instagram_url || "https://www.instagram.com/the2io/";
    const spotifyUrl = settings.spotify_artist_url || "https://open.spotify.com/artist/3tImcBvyvtx11LEkH8CDke";
    const soundcloudUrl = settings.soundcloud_url || "https://soundcloud.com/the2iorebeat";

    const socials = [
      {
        label: "Instagram",
        url: instagramUrl,
        icon: `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="17.4" cy="6.8" r="1" fill="currentColor"/>
          </svg>`
      },
      {
        label: "Spotify",
        url: spotifyUrl,
        icon: `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7.2 9.2c3.5-1 7.5-.75 10.3.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M7.9 12.2c2.9-.75 6.4-.55 8.9.65" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8.6 15c2.35-.52 5-.35 7.1.55" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`
      },
      {
        label: "SoundCloud",
        url: soundcloudUrl,
        icon: `
          <svg viewBox="0 0 28 24" aria-hidden="true">
            <path d="M10.5 17.8h11.2a4.3 4.3 0 0 0 .4-8.58 6.8 6.8 0 0 0-12.65 2.45" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.2 13v4.8M5.2 11.7v6.1M7.2 10.3v7.5M9.2 9.3v8.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`
      }
    ];

    container.innerHTML = "";
    socials.forEach(({ label, url, icon }) => {
      const link = document.createElement("a");
      link.className = "subject-social-link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", label);
      link.title = label;
      link.innerHTML = icon;
      container.appendChild(link);
    });
  }

  let reactiveElements = [];
  function refreshReactive() {
    document.querySelectorAll("[data-reactive]").forEach(element => {
      if (element.dataset.reactiveReady === "1") return;
      const nodes = [...element.childNodes];
      nodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
        const fragment = document.createDocumentFragment();
        [...node.textContent].forEach(char => {
          if (char === " ") {
            fragment.append(document.createTextNode(" "));
          } else {
            const span = document.createElement("span");
            span.className = "reactive-char";
            span.textContent = char;
            fragment.append(span);
          }
        });
        node.replaceWith(fragment);
      });
      element.dataset.reactiveReady = "1";
    });
    reactiveElements = [...document.querySelectorAll(".reactive-char")];
  }

  function reactiveMotion(event) {
    const x = event.clientX;
    const y = event.clientY;
    reactiveElements.forEach(span => {
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - x;
      const dy = cy - y;
      const distance = Math.hypot(dx, dy);
      if (distance < 70) {
        const force = (70 - distance) / 70;
        const angle = Math.atan2(dy, dx);
        span.style.transform = `translate(${Math.cos(angle) * force * 8}px, ${Math.sin(angle) * force * 8}px)`;
        span.classList.add("hot");
      } else {
        span.style.transform = "";
        span.classList.remove("hot");
      }
    });
  }

  async function init() {
    tick();
    setInterval(tick, 1000);

    let frame = 1;
    setInterval(() => {
      frame = (frame + 1) % 999999;
      document.getElementById("frameCount").textContent = String(frame).padStart(6, "0");
    }, 1000 / 24);

    const data = await window.The2iOAPI.loadSiteData();
    window.The2iOMusic.render(data);
    window.The2iOArchive.render(data);
    window.The2iOUnreleased.render(data);
    window.The2iOTranslations.render(data);
    window.The2iONews.render(data);
    window.The2iOContact.render(data);

    const settings = data.settings || {};
    document.getElementById("navInstagram").href = settings.instagram_url || document.getElementById("navInstagram").href;
    document.getElementById("heroCaption").textContent = settings.artist_subtitle || "";
    renderSubjectSocials(settings);

    refreshReactive();
    document.addEventListener("mousemove", reactiveMotion, { passive: true });
  }

  window.The2iOMain = { refreshReactive };
  document.addEventListener("DOMContentLoaded", init);
})();
