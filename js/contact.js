(() => {
  function render(data) {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    const settings = data.settings || {};
    const config = window.THE2IO_CONFIG || {};
    const socials = document.getElementById("contactSocials");

    socials.innerHTML = "";
    [
      ["Instagram", settings.instagram_url],
      ["TikTok", settings.tiktok_url],
      ["Spotify", settings.spotify_artist_url],
      ["SoundCloud", settings.soundcloud_url]
    ].filter(([, url]) => url).forEach(([label, url]) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = `${label} ↗`;
      socials.appendChild(link);
    });

    form.action = config.API_URL || config.FALLBACK_CONTACT_URL || "";
    const subject = form.querySelector('input[name="_subject"]');
    const template = form.querySelector('input[name="_template"]');
    const action = form.querySelector('input[name="action"]');
    const usingAppsScript = Boolean(config.API_URL);
    subject.disabled = usingAppsScript;
    template.disabled = usingAppsScript;
    action.disabled = !usingAppsScript;

    form.addEventListener("submit", event => {
      if (!form.action) {
        event.preventDefault();
        status.textContent = "CHANNEL UNAVAILABLE";
        return;
      }
      status.textContent = "TRANSMITTING";
      setTimeout(() => {
        status.textContent = "TRANSMISSION SENT";
        form.reset();
      }, 900);
    });
  }

  window.The2ioContact = { render };
})();