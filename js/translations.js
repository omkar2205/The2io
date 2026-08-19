(() => {
  function linkedText(text) {
    const target = "contact (unknown)";
    const source = String(text || "");
    const index = source.toLowerCase().indexOf(target);
    if (index < 0) return document.createTextNode(source);

    const fragment = document.createDocumentFragment();
    fragment.append(document.createTextNode(source.slice(0, index)));
    const link = document.createElement("a");
    link.href = "#contact";
    link.textContent = source.slice(index, index + target.length);
    link.setAttribute("data-reactive", "");
    fragment.append(link);
    fragment.append(document.createTextNode(source.slice(index + target.length)));
    return fragment;
  }

  function render(data) {
    const translations = (data.translations || []).filter(item => item.enabled !== false);
    const toggle = document.getElementById("languageToggle");
    const copy = document.getElementById("aboutCopy");
    const settings = data.settings || {};
    let current = settings.default_language || "en";

    function show(language) {
      const item = translations.find(entry => entry.language_code === language) || translations[0];
      if (!item) return;
      current = item.language_code;
      copy.classList.remove("translating");
      void copy.offsetWidth;
      copy.classList.add("translating");
      copy.replaceChildren(linkedText(item.about_text));
      toggle.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.lang === current));
      setTimeout(() => window.The2ioMain?.refreshReactive?.(), 0);
    }

    toggle.innerHTML = "";
    translations.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lang = item.language_code;
      button.textContent = item.language_code.toUpperCase();
      button.title = item.language_name;
      button.addEventListener("click", () => show(item.language_code));
      toggle.appendChild(button);
    });

    const links = document.getElementById("aboutLinks");
    links.innerHTML = "";
    [
      ["Spotify", settings.spotify_artist_url],
      ["Instagram", settings.instagram_url],
      ["TikTok", settings.tiktok_url],
      ["SoundCloud", settings.soundcloud_url]
    ].filter(([, url]) => url).forEach(([label, url]) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.textContent = `${label} ↗`;
      links.appendChild(anchor);
    });

    show(current);
  }

  window.The2ioTranslations = { render };
})();