(() => {
  const fmt = seconds => {
    if (!Number.isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const driveDirect = url => {
    const text = String(url || "");
    const fileMatch = text.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (fileMatch) return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
    const idMatch = text.match(/[?&]id=([^&]+)/);
    if (text.includes("drive.google.com") && idMatch) return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    return text;
  };

  function render(data) {
    const tracks = (data.unreleased || []).filter(item => item.audio_url);
    const audio = document.getElementById("localAudio");
    const player = document.getElementById("privatePlayer");
    const rupture = document.getElementById("rupture");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const scrub = document.getElementById("scrub");
    const volume = document.getElementById("volume");
    const queueEl = document.getElementById("queue");
    const nameEl = document.getElementById("localName");
    const metaEl = document.getElementById("localMeta");
    const currentEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");
    const bufferState = document.getElementById("bufferState");
    const refEl = document.getElementById("unreleasedRef");
    const statusEl = document.getElementById("unreleasedStatus");
    const artwork = document.getElementById("unreleasedArtwork");
    const artworkCopies = Array.from(document.querySelectorAll("[data-mosh-artwork]"));
    const fallbackArtwork = artwork?.getAttribute("src") || "";
    let current = -1;

    const setDisabled = disabled => {
      [playBtn, prevBtn, nextBtn, scrub, volume].forEach(el => el.disabled = disabled);
    };

    function renderQueue() {
      queueEl.innerHTML = "";
      if (!tracks.length) {
        const row = document.createElement("div");
        row.className = "queue-row empty";
        row.innerHTML = "<span>000</span><span>NO PUBLIC TRANSMISSION</span><span>STANDBY</span>";
        queueEl.appendChild(row);
        return;
      }

      tracks.forEach((track, index) => {
        const row = document.createElement("div");
        row.className = `queue-row${index === current ? " active" : ""}`;
        row.innerHTML = `
          <span>${String(index + 1).padStart(3, "0")}</span>
          <span>${track.title || "UNTITLED"}</span>
          <span>${track.version || track.status || "UNRELEASED"}</span>`;
        row.addEventListener("click", () => {
          load(index);
          audio.play().catch(() => {});
        });
        queueEl.appendChild(row);
      });
    }

    function load(index) {
      if (!tracks.length) return;
      current = (index + tracks.length) % tracks.length;
      const track = tracks[current];
      audio.src = driveDirect(track.audio_url);
      nameEl.textContent = track.title || "UNTITLED";
      metaEl.innerHTML = `FILE_${String(current + 1).padStart(3, "0")}<br>${track.version || "UNRELEASED"}`;
      refEl.textContent = `FILE_${String(current + 1).padStart(3, "0")}`;
      statusEl.textContent = track.public_note || "UNRELEASED";
      const artworkSrc = track.artwork_url || fallbackArtwork;
      if (artwork && artworkSrc) artwork.src = artworkSrc;
      artworkCopies.forEach(copy => { if (artworkSrc) copy.src = artworkSrc; });
      rupture.classList.remove("mosh-hit");
      void rupture.offsetWidth;
      rupture.classList.add("mosh-hit");
      scrub.value = 0;
      currentEl.textContent = "00:00";
      durationEl.textContent = "00:00";
      renderQueue();
    }

    bufferState.textContent = tracks.length ? `${tracks.length} FILE${tracks.length === 1 ? "" : "S"}` : "STANDBY";
    setDisabled(!tracks.length);
    renderQueue();
    if (tracks.length) load(0);

    playBtn.addEventListener("click", () => {
      if (!tracks.length) return;
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
    });
    prevBtn.addEventListener("click", () => {
      if (!tracks.length) return;
      load(current - 1);
      audio.play().catch(() => {});
    });
    nextBtn.addEventListener("click", () => {
      if (!tracks.length) return;
      load(current + 1);
      audio.play().catch(() => {});
    });
    volume.addEventListener("input", () => audio.volume = Number(volume.value));
    audio.volume = Number(volume.value);

    audio.addEventListener("play", () => {
      player.classList.add("playing");
      rupture.classList.add("playing");
      playBtn.textContent = "Pause";
    });
    audio.addEventListener("pause", () => {
      player.classList.remove("playing");
      rupture.classList.remove("playing");
      playBtn.textContent = "Play";
    });
    audio.addEventListener("loadedmetadata", () => durationEl.textContent = fmt(audio.duration));
    audio.addEventListener("timeupdate", () => {
      currentEl.textContent = fmt(audio.currentTime);
      if (audio.duration) scrub.value = Math.round((audio.currentTime / audio.duration) * 1000);
    });
    audio.addEventListener("ended", () => {
      if (!tracks.length) return;
      load(current + 1);
      audio.play().catch(() => {});
    });
    scrub.addEventListener("input", () => {
      if (audio.duration) audio.currentTime = (Number(scrub.value) / 1000) * audio.duration;
    });
  }

  window.The2iOUnreleased = { render };
})();
