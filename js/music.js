(() => {
  const spotifyId = value => {
    const text = String(value || "");
    const uri = text.match(/spotify:track:([A-Za-z0-9]+)/);
    if (uri) return uri[1];
    const url = text.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
    return url ? url[1] : text;
  };

  const HUD_GLYPHS = ["[♪]", "[♥]", "[☠]", "[⚡]", "[$#%!]"];

  function installHeartbeatStyles() {
    if (document.getElementById("the2ioHeartbeatStyles")) return;

    const style = document.createElement("style");
    style.id = "the2ioHeartbeatStyles";
    style.textContent = `
      .released-mini-wave{
        position:relative!important;
        height:64px!important;
        display:block!important;
        padding:0!important;
        overflow:hidden!important;
        isolation:isolate;
        border-bottom:1px solid var(--line);
        background:
          linear-gradient(rgba(222,221,212,.035) 1px,transparent 1px),
          linear-gradient(90deg,rgba(222,221,212,.035) 1px,transparent 1px);
        background-size:18px 18px;
      }
      .released-mini-wave::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:0;
        background:linear-gradient(90deg,transparent,rgba(216,255,50,.05) 45%,rgba(216,255,50,.12) 50%,rgba(216,255,50,.05) 55%,transparent);
        transform:translateX(-110%);
        animation:the2ioSweep 3.4s linear infinite;
        pointer-events:none;
      }
      .released-mini-wave::after{display:none!important}
      .released-mini-wave>i{display:none!important}
      .pulse-svg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        overflow:visible;
        z-index:2;
        filter:drop-shadow(0 0 3px rgba(216,255,50,.34));
      }
      .pulse-trace{
        fill:none;
        stroke:var(--acid);
        stroke-width:1.45;
        vector-effect:non-scaling-stroke;
        stroke-linecap:square;
        stroke-linejoin:miter;
        opacity:.92;
        transition:d .22s linear,opacity .18s ease,stroke-width .18s ease;
      }
      .pulse-baseline{
        fill:none;
        stroke:rgba(222,221,212,.16);
        stroke-width:1;
        vector-effect:non-scaling-stroke;
      }
      .heartbeat-glyph{
        position:absolute;
        z-index:4;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%) scale(.82);
        padding:2px 4px;
        border:1px solid rgba(216,255,50,.45);
        background:rgba(7,7,7,.86);
        color:var(--acid);
        font:700 8px/1 var(--mono);
        letter-spacing:.04em;
        white-space:nowrap;
        opacity:0;
        box-shadow:0 0 0 1px rgba(7,7,7,.72),0 0 10px rgba(216,255,50,.08);
        pointer-events:none;
      }
      .heartbeat-glyph.show{
        animation:hudGlyph 1.15s steps(2,end) forwards;
      }
      .released-mini-wave.track-pulse .pulse-trace{
        stroke-width:2;
        opacity:1;
        filter:drop-shadow(0 0 5px rgba(216,255,50,.72));
      }
      .released-mini-wave.track-pulse{
        box-shadow:inset 0 0 18px rgba(216,255,50,.045);
      }
      @keyframes the2ioSweep{
        to{transform:translateX(110%)}
      }
      @keyframes hudGlyph{
        0%{opacity:0;transform:translate(-50%,-50%) scale(.72)}
        12%{opacity:1;transform:translate(-50%,-50%) scale(1)}
        62%{opacity:.92;transform:translate(-50%,-50%) scale(1)}
        78%{opacity:.25;transform:translate(calc(-50% + 2px),calc(-50% - 1px)) scale(.96)}
        100%{opacity:0;transform:translate(-50%,-50%) scale(.84)}
      }
    `;
    document.head.appendChild(style);
  }

  function buildHeartbeatPath() {
    const baseline = 40;
    let x = 0;
    let d = `M 0 ${baseline}`;

    while (x < 1000) {
      const idle = 65 + Math.random() * 55;
      const start = Math.min(1000, x + idle);
      d += ` L ${start.toFixed(1)} ${baseline}`;
      if (start >= 985) break;

      const smallUp = baseline - (4 + Math.random() * 5);
      const smallDown = baseline + (7 + Math.random() * 8);
      const peak = 7 + Math.random() * 10;
      const trough = 62 + Math.random() * 10;
      const settle = baseline - (3 + Math.random() * 4);

      d += ` L ${(start + 10).toFixed(1)} ${baseline}`;
      d += ` L ${(start + 17).toFixed(1)} ${smallUp.toFixed(1)}`;
      d += ` L ${(start + 25).toFixed(1)} ${smallDown.toFixed(1)}`;
      d += ` L ${(start + 34).toFixed(1)} ${peak.toFixed(1)}`;
      d += ` L ${(start + 45).toFixed(1)} ${trough.toFixed(1)}`;
      d += ` L ${(start + 57).toFixed(1)} ${settle.toFixed(1)}`;
      d += ` L ${(start + 70).toFixed(1)} ${baseline}`;

      x = start + 70 + Math.random() * 65;
    }

    d += ` L 1000 ${baseline}`;
    return d;
  }

  function setupHeartbeat(monitor) {
    if (!monitor) return null;

    installHeartbeatStyles();
    monitor.innerHTML = `
      <svg class="pulse-svg" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path class="pulse-baseline" d="M0 40 L1000 40"></path>
        <path class="pulse-trace"></path>
      </svg>
      <span class="heartbeat-glyph" aria-hidden="true">[♪]</span>`;

    const trace = monitor.querySelector(".pulse-trace");
    const glyph = monitor.querySelector(".heartbeat-glyph");
    let pathTimer;
    let glyphTimer;

    const refreshPath = () => {
      trace.setAttribute("d", buildHeartbeatPath());
      window.clearTimeout(pathTimer);
      pathTimer = window.setTimeout(refreshPath, 2100 + Math.random() * 1700);
    };

    const showGlyph = forced => {
      const text = forced || HUD_GLYPHS[Math.floor(Math.random() * HUD_GLYPHS.length)];
      glyph.textContent = text;
      glyph.style.left = `${15 + Math.random() * 70}%`;
      glyph.style.top = `${23 + Math.random() * 54}%`;
      glyph.classList.remove("show");
      void glyph.offsetWidth;
      glyph.classList.add("show");
    };

    const scheduleGlyph = () => {
      window.clearTimeout(glyphTimer);
      glyphTimer = window.setTimeout(() => {
        showGlyph();
        scheduleGlyph();
      }, 1900 + Math.random() * 3600);
    };

    refreshPath();
    scheduleGlyph();

    return {
      kick() {
        monitor.classList.remove("track-pulse");
        void monitor.offsetWidth;
        monitor.classList.add("track-pulse");
        trace.setAttribute("d", buildHeartbeatPath());
        showGlyph();
        window.clearTimeout(this.kickTimer);
        this.kickTimer = window.setTimeout(() => monitor.classList.remove("track-pulse"), 950);
      }
    };
  }

  function render(data) {
    const release = (data.releases || [])[0];
    const tracks = (data.tracks || []).filter(track =>
      !release || !track.release_id || track.release_id === release.id
    );

    const rows = document.getElementById("miniTrackRows");
    const player = document.getElementById("miniSpotifyPlayer");
    const now = document.getElementById("miniSpotifyNow");
    const artistLink = document.getElementById("miniSpotifyArtistLink");
    const monitor = document.querySelector(".released-mini-wave");

    if (!rows || !player || !now || !artistLink) return;

    const heartbeat = setupHeartbeat(monitor);
    artistLink.href = data.settings?.spotify_artist_url || artistLink.href;
    rows.innerHTML = "";

    if (!tracks.length) {
      const empty = document.createElement("div");
      empty.className = "mini-track-row";
      empty.innerHTML = `
        <span class="mini-track-num">000</span>
        <span class="mini-track-name">No release loaded</span>
        <span class="mini-track-action">STANDBY</span>`;
      rows.appendChild(empty);
      now.textContent = "SOURCE_000 // STANDBY";
      player.removeAttribute("src");
      return;
    }

    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mini-track-row${index === 0 ? " active" : ""}`;
      button.dataset.track = spotifyId(track.spotify_track_uri || track.spotify_url);
      button.dataset.name = track.title || `TRACK ${index + 1}`;
      button.innerHTML = `
        <span class="mini-track-num">${String(index + 1).padStart(3, "0")}</span>
        <span class="mini-track-name">${track.title || "UNTITLED"}</span>
        <span class="mini-track-action">PLAY</span>`;
      rows.appendChild(button);
    });

    function select(button, index) {
      rows.querySelectorAll(".mini-track-row").forEach(row => row.classList.remove("active"));
      button.classList.add("active");
      const id = button.dataset.track;
      if (id) player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
      now.textContent = `SOURCE_${String(index + 1).padStart(3, "0")} // ${button.dataset.name.toUpperCase()}`;
      heartbeat?.kick();
    }

    [...rows.querySelectorAll(".mini-track-row")].forEach((button, index) => {
      button.addEventListener("click", () => select(button, index));
    });

    const first = rows.querySelector(".mini-track-row");
    if (first) select(first, 0);
  }

  window.The2iOMusic = { render };
})();
