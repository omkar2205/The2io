(() => {
  const two = value => String(value).padStart(2, "0");

  function tick() {
    const date = new Date();
    const stamp = `${date.getFullYear()}.${two(date.getMonth() + 1)}.${two(date.getDate())} // ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
    document.getElementById("heroDate").textContent = stamp;
    document.getElementById("topClock").textContent = `${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
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
    document.getElementById("subjectAlias").textContent = settings.artist_display || "The2iO";
    document.getElementById("heroCaption").textContent = settings.artist_subtitle ? `Music by Ilya. ${settings.artist_subtitle}.` : "Music by Ilya.";

    refreshReactive();
    document.addEventListener("mousemove", reactiveMotion, { passive: true });
  }

  window.The2iOMain = { refreshReactive };
  document.addEventListener("DOMContentLoaded", init);
})();
