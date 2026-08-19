(() => {
  const spotifyId = value => {
    const text = String(value || "");
    const uri = text.match(/spotify:track:([A-Za-z0-9]+)/);
    if (uri) return uri[1];
    const url = text.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
    return url ? url[1] : text;
  };

  function render(data) {
    const release = (data.releases || [])[0];
    const tracks = (data.tracks || []).filter(track =>
      !release || !track.release_id || track.release_id === release.id
    );

    const rows = document.getElementById("miniTrackRows");
    const player = document.getElementById("miniSpotifyPlayer");
    const now = document.getElementById("miniSpotifyNow");
    const artistLink = document.getElementById("miniSpotifyArtistLink");

    if (!rows || !player || !now || !artistLink) return;

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
    }

    [...rows.querySelectorAll(".mini-track-row")].forEach((button, index) => {
      button.addEventListener("click", () => select(button, index));
    });

    const first = rows.querySelector(".mini-track-row");
    if (first) select(first, 0);
  }

  window.The2iOMusic = { render };
})();
