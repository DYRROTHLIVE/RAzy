import {
  renderAllHudMiiAvatars as P,
  renderMiiAvatar as L,
} from "./mii_avatars.js";
export class HudUI {
  constructor(t = {}) {
    ((this.callbacks = t),
      (this.bannerTimer = null),
      (this.timingPopupTimer = null),
      (this.skillHistory = [980, 1005, 1030, 1065, 1120]),
      (this.selectedGamesToWin = 2),
      (this.selectedInputMode = "mouse"),
      (this.selectedDifficulty = "casual"),
      (this.currentRoomId = "default"),
      (this.currentTunnelUrl =
        "https://argon-tennis-sandbox-170440.uc.r.appspot.com"),
      (this.elTitleModal = document.getElementById("title-modal")),
      (this.elCompanionModal = document.getElementById("companion-modal")),
      (this.elVictoryModal = document.getElementById("victory-modal")),
      (this.elScoreCenter = document.getElementById("score-center-display")),
      (this.elScorePlayer = document.getElementById("score-player-text")),
      (this.elScoreSep = document.getElementById("score-separator")),
      (this.elScoreOpponent = document.getElementById("score-opponent-text")),
      (this.elGamesPlayer = document.getElementById("games-pill-player")),
      (this.elGamesOpponent = document.getElementById("games-pill-opponent")),
      (this.elServerTag = document.getElementById("server-tag")),
      (this.elPlayerNameplate = document.getElementById("player-nameplate")),
      (this.elTimingPopup = document.getElementById("timing-popup")),
      (this.elTimingGrade = document.getElementById("timing-popup-grade")),
      (this.elTimingDetail = document.getElementById("timing-popup-detail")),
      (this.elBannerLayer = document.getElementById("center-banner-layer")),
      (this.elBannerText = document.getElementById("center-banner-text")),
      (this.elBannerSub = document.getElementById("center-banner-sub")),
      (this.elReplayBadge = document.getElementById("replay-badge")),
      (this.elTimingCursor = document.getElementById("timing-cursor")),
      (this.elGaugeModeTitle = document.getElementById("gauge-mode-title")),
      (this.elGaugeSpeedReadout = document.getElementById(
        "gauge-speed-readout",
      )),
      (this.elAudioDot = document.getElementById("audio-status-dot")),
      (this.elAudioLabel = document.getElementById("audio-track-label")),
      (this.elCameraLabel = document.getElementById("camera-mode-label")),
      (this.elWebcamPip = document.getElementById("webcam-pip-card")),
      (this.elWebcamDot = document.getElementById("webcam-status-dot")),
      (this.elPhoneDot = document.getElementById("phone-status-dot")),
      (this.elPhoneLabel = document.getElementById("phone-status-label")),
      (this.elOpponentPresencePill = document.getElementById(
        "opponent-presence-pill",
      )),
      (this.elOpponentPresenceText = document.getElementById(
        "opponent-presence-text",
      )),
      (this.elEmoteWheelContainer = document.getElementById("match-emote-wheel-container")),
      (this.elBtnCloseEmoteWheel = document.getElementById("btn-close-emote-wheel")),
      (this.elBtnHudEmoteToggle = document.getElementById("btn-hud-emote-toggle")),
      (this.elEmoteWheelBackdrop = document.getElementById("emote-wheel-backdrop")),
      (this.elPlayerSpeechBubble = document.getElementById("player-speech-bubble")),
      (this.elOpponentSpeechBubble = document.getElementById("opponent-speech-bubble")),
      (this.elPsbIcon = document.getElementById("psb-icon")),
      (this.elPsbText = document.getElementById("psb-text")),
      (this.elOsbIcon = document.getElementById("osb-icon")),
      (this.elOsbText = document.getElementById("osb-text")),
      (this._playerSpeechTimer = null),
      (this._opponentSpeechTimer = null),
      (this._emoteWheelAutoTimer = null),
      (this._lastRoomStatus = {}),
      (this._lastOtherReady = !1),
      (this._justJoinedTimer = null),
      (this._joystickActive = !1),
      (this._joystickPointerId = null),
      (this._joystickCenter = { x: 0, y: 0 }),
      this._renderAllMiiPortraits(),
      this._bindEvents(),
      this._bindJoystickAndArcadeControls(),
      this._initUrlParamsState(),
      this._initLandscapeWatch());
  }
  _renderAllMiiPortraits() {
    P();
  }
  _drawMiiFace(t, n = {}) {
    L(t, n.characterId || t?.id || "player1", n);
  }
  _initUrlParamsState() {
    const t = new URLSearchParams(window.location.search),
      n = (t.get("room") || "").trim().toUpperCase(),
      e = (t.get("role") || "p1").trim().toLowerCase() === "p2" ? "p2" : "p1",
      i = (t.get("mode") || t.get("difficulty") || "").toLowerCase();
    if (
      ((this.playerRole = e),
      n && n !== "DEFAULT"
        ? ((this.currentRoomId = n),
          this._setDifficultySelection("1v1", { notify: !1 }))
        : ["casual", "pro", "1v1"].includes(i) &&
          this._setDifficultySelection(i, { notify: !1 }),
      e === "p2")
    ) {
      const o = document.querySelector(".you-tag");
      o && (o.textContent = "Player 1");
      const s = document.getElementById("setup-opponent-label");
      s && (s.textContent = "You");
    }
    this.updateMultiplayerRoomInfo({
      roomId: this.currentRoomId,
      tunnelUrl: this.currentTunnelUrl,
      role: this.playerRole,
    });
  }
  _setDifficultySelection(t, { notify: n = !0 } = {}) {
    const e = ["casual", "pro", "1v1"].includes(t) ? t : "casual";
    ((this.selectedDifficulty = e),
      document
        .querySelectorAll("#difficulty-mode-group .wii-green-choice")
        .forEach((a) => {
          a.classList.toggle("selected", a.dataset.difficulty === e);
        }));
    const o = document.getElementById("match-length-section");
    if (e === "1v1")
      (o && o.classList.add("hidden"),
        (this.selectedGamesToWin = 1),
        this.configureGameBubbles(1),
        n &&
          this.callbacks.onSelectMatchLength &&
          this.callbacks.onSelectMatchLength(1));
    else {
      o && o.classList.remove("hidden");
      const a = document.querySelector(
          "#match-length-group .wii-green-choice.selected",
        ),
        r = parseInt(a?.dataset?.games || "3", 10);
      ((this.selectedGamesToWin = Math.ceil(r / 2)),
        this.configureGameBubbles(this.selectedGamesToWin),
        n &&
          this.callbacks.onSelectMatchLength &&
          this.callbacks.onSelectMatchLength(this.selectedGamesToWin));
    }
    const s = document.getElementById("setup-opponent-label");
    (s &&
      this.playerRole !== "p2" &&
      (e === "1v1"
        ? (s.textContent = "Player 2")
        : e === "pro"
          ? (s.textContent = "Matt")
          : (s.textContent = "Club AI")),
      this.updateOpponentPresence(this._lastRoomStatus || {}),
      n &&
        this.callbacks.onSelectDifficulty &&
        this.callbacks.onSelectDifficulty(e));
  }
  _bindEvents() {
    document
      .querySelectorAll("#difficulty-mode-group .wii-green-choice")
      .forEach((l) => {
        l.addEventListener("click", () => {
          const c = l.dataset.difficulty || "casual";
          this._setDifficultySelection(c, { notify: !0 });
        });
      });
    const n = document.querySelectorAll(
      "#match-length-group .wii-green-choice",
    );
    n.forEach((l) => {
      l.addEventListener("click", () => {
        (n.forEach((u) => u.classList.remove("selected")),
          l.classList.add("selected"));
        const c = parseInt(l.dataset.games || "3", 10);
        ((this.selectedGamesToWin = Math.ceil(c / 2)),
          this.configureGameBubbles(this.selectedGamesToWin),
          this.callbacks.onSelectMatchLength &&
            this.callbacks.onSelectMatchLength(this.selectedGamesToWin));
      });
    });
    const e = document.querySelectorAll("#input-mode-group .wii-cyan-choice");
    e.forEach((l) => {
      l.addEventListener("click", () => {
        (e.forEach((c) => c.classList.remove("selected")),
          l.classList.add("selected"),
          (this.selectedInputMode = l.dataset.input || "mouse"),
          this.callbacks.onSelectInputMode &&
            this.callbacks.onSelectInputMode(this.selectedInputMode));
      });
    });
    const i = document.getElementById("btn-start-match");
    i &&
      i.addEventListener("click", () => {
        (this.hideTitleModal(),
          this.callbacks.onStartMatch &&
            this.callbacks.onStartMatch({
              gamesToWin: this.selectedGamesToWin,
              inputMode: this.selectedInputMode,
              difficulty: this.selectedDifficulty,
            }));
      });
    const o = document.getElementById("btn-audio-toggle");
    o &&
      o.addEventListener("click", (l) => {
        (l.stopPropagation(),
          this.callbacks.onToggleAudio && this.callbacks.onToggleAudio());
      });
    const s = document.getElementById("btn-camera-cycle");
    s &&
      s.addEventListener("click", (l) => {
        (l.stopPropagation(),
          this.callbacks.onCycleCamera && this.callbacks.onCycleCamera());
      });
    const a = document.getElementById("btn-replay-trigger");
    a &&
      a.addEventListener("click", (l) => {
        (l.stopPropagation(),
          this.callbacks.onToggleReplay && this.callbacks.onToggleReplay());
      });
    const r = document.getElementById("btn-webcam-toggle");
    r &&
      r.addEventListener("click", (l) => {
        (l.stopPropagation(),
          this.callbacks.onToggleWebcam && this.callbacks.onToggleWebcam());
      });
    const m = document.getElementById("btn-phone-racket");
    m &&
      m.addEventListener("click", (l) => {
        (l.stopPropagation(), this.openMultiplayerModal());
      });
    const p = document.getElementById("btn-multiplayer-modal");
    p &&
      p.addEventListener("click", (l) => {
        (l.stopPropagation(), this.openMultiplayerModal());
      });
    const g = document.getElementById("btn-create-1v1-room");
    g &&
      g.addEventListener("click", async () => {
        ((g.disabled = !0), (g.textContent = "Creating..."));
        try {
          if (this.callbacks.onCreateMultiplayerRoom) {
            const l = await this.callbacks.onCreateMultiplayerRoom();
            l &&
              l.roomId &&
              ((this.currentRoomId = l.roomId),
              this._setDifficultySelection("1v1", { notify: !1 }),
              this.updateMultiplayerRoomInfo({
                roomId: l.roomId,
                tunnelUrl: l.tunnelUrl || this.currentTunnelUrl,
                urls: l.urls,
              }));
          }
        } finally {
          ((g.disabled = !1), (g.textContent = "+ New 1v1 Room"));
        }
      });
    const y = document.getElementById("btn-save-tunnel-url");
    y &&
      y.addEventListener("click", async () => {
        const l = document.getElementById("tunnel-url-input"),
          c = (l ? l.value : "").trim().replace(/\/+$/, "");
        if (c) {
          this.currentTunnelUrl = c;
          try {
            await fetch("/api/tunnel/url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tunnelUrl: c }),
            });
          } catch {}
          (this.updateMultiplayerRoomInfo({
            roomId: this.currentRoomId,
            tunnelUrl: this.currentTunnelUrl,
          }),
            (y.textContent = "Saved \u2713"),
            setTimeout(() => {
              y.textContent = "Update Tunnel";
            }, 1400));
        }
      });
    const f = document.getElementById("btn-send-gchat-invite");
    f &&
      f.addEventListener("click", async () => {
        const l = document.getElementById("gchat-target-input"),
          c = document.getElementById("gchat-send-status"),
          u = (l ? l.value : "").trim();
        if (!u) {
          c &&
            (c.textContent =
              "Enter a Google Chat Space ID (e.g. AAAAb123456) or colleague email (user@google.com) first.");
          return;
        }
        if (
          (!this.currentRoomId || this.currentRoomId === "default") &&
          this.callbacks.onCreateMultiplayerRoom
        ) {
          const h = await this.callbacks.onCreateMultiplayerRoom();
          h && h.roomId && (this.currentRoomId = h.roomId);
        }
        ((f.disabled = !0), (f.textContent = "Sending..."));
        try {
          const h = u.includes("@"),
            E = await (
              await fetch("/api/gchat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  room: this.currentRoomId,
                  spaceId: h ? "" : u,
                  dmEmail: h ? u : "",
                  tunnelUrl: this.currentTunnelUrl,
                }),
              })
            ).json();
          c &&
            (E.sent
              ? (c.textContent = `\u2705 Posted /argontennis 1v1 Match Card (Room ${this.currentRoomId}) to ${u}!`)
              : (c.textContent = `\u2139\uFE0F Room ${this.currentRoomId} ready! Run: python3 scripts/gchat_argontennis_bot.py ${h ? "--dm " + u : "--space " + u} --room ${this.currentRoomId}`));
        } catch {
          c &&
            (c.textContent = `Room ${this.currentRoomId} ready \u2014 share the P2 Court & Pocket Racket links above!`);
        } finally {
          ((f.disabled = !1), (f.textContent = "Send GChat Card"));
        }
      });
    const I = document.getElementById("btn-copy-gchat-cmd");
    I &&
      I.addEventListener("click", async () => {
        const l = document.getElementById("gchat-target-input"),
          c = document.getElementById("gchat-send-status"),
          h = `python3 scripts/gchat_argontennis_bot.py --watch-space ${(l ? l.value : "").trim() || "<SPACE_ID>"} --tunnel-url ${this.currentTunnelUrl}`;
        try {
          (navigator.clipboard &&
            navigator.clipboard.writeText &&
            (await navigator.clipboard.writeText(h)),
            c && (c.textContent = `\u{1F4CB} Copied: ${h}`));
        } catch {
          c && (c.textContent = `Run: ${h}`);
        }
      });
    const b = document.getElementById("btn-close-companion");
    b &&
      b.addEventListener("click", () => {
        this.elCompanionModal && this.elCompanionModal.classList.add("hidden");
      });
    const B = document.getElementById("btn-play-again");
    B &&
      B.addEventListener("click", () => {
        (this.hideVictoryModal(),
          this.callbacks.onPlayAgain && this.callbacks.onPlayAgain());
      });
    const T = document.getElementById("btn-return-title");
    T &&
      T.addEventListener("click", () => {
        this.hideVictoryModal();
        if (window.__smashClubLobby) {
          window.__smashClubLobby.showScreen("lobby");
        } else {
          this.showTitleModal();
        }
      });

    // Emote Wheel HUD Toggle button
    if (this.elBtnHudEmoteToggle) {
      this.elBtnHudEmoteToggle.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.toggleEmoteWheel();
      });
    }

    // Emote Wheel Close button & Backdrop click
    if (this.elBtnCloseEmoteWheel) {
      this.elBtnCloseEmoteWheel.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.hideEmoteWheel();
      });
    }
    if (this.elEmoteWheelBackdrop) {
      this.elEmoteWheelBackdrop.addEventListener("click", () => {
        this.hideEmoteWheel();
      });
    }

    // Emote Sectors (Radial buttons)
    const sectors = document.querySelectorAll(".emote-wheel-sector");
    sectors.forEach((sec) => {
      sec.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const emoteId = sec.dataset.emote;
        this.hideEmoteWheel();
        if (this.callbacks.onSelectEmote && emoteId) {
          this.callbacks.onSelectEmote(emoteId);
        }
      });
    });

    // Keyboard shortcut 'E' for quick emote wheel toggle during rallies
    window.addEventListener("keydown", (evt) => {
      if ((evt.key === "e" || evt.key === "E") && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        this.toggleEmoteWheel();
      }
    });
  }
  _bindJoystickAndArcadeControls() {
    const t = document.getElementById("virtual-joystick-base"),
      n = document.getElementById("virtual-joystick-stick");
    if (t && n) {
      const e = (i) => {
          if (this._joystickActive) return;
          ((this._joystickActive = !0),
            (this._joystickPointerId = i.pointerId));
          const a = t.getBoundingClientRect();
          ((this._joystickCenter = {
            x: a.left + a.width / 2,
            y: a.top + a.height / 2,
          }),
            n.classList.add("active"),
            t.setPointerCapture && t.setPointerCapture(i.pointerId),
            this._handleJoystickDrag(i.clientX, i.clientY, n));
        },
        o = (i) => {
          if (!this._joystickActive || i.pointerId !== this._joystickPointerId)
            return;
          this._handleJoystickDrag(i.clientX, i.clientY, n);
        },
        s = (i) => {
          if (!this._joystickActive || i.pointerId !== this._joystickPointerId)
            return;
          ((this._joystickActive = !1),
            (this._joystickPointerId = null),
            n.classList.remove("active"),
            (n.style.transform = "translate(0px, 0px)"),
            this.callbacks.onJoystickRelease &&
              this.callbacks.onJoystickRelease());
        };
      (t.addEventListener("pointerdown", e),
        window.addEventListener("pointermove", o),
        window.addEventListener("pointerup", s),
        window.addEventListener("pointercancel", s));
    }
    const e = document.getElementById("btn-action-fire");
    (e &&
      e.addEventListener("pointerdown", (t) => {
        (t.stopPropagation(),
          t.preventDefault(),
          e.classList.add("active"),
          this.callbacks.onFire && this.callbacks.onFire());
      }),
      e && e.addEventListener("pointerup", () => e.classList.remove("active")),
      e &&
        e.addEventListener("pointercancel", () =>
          e.classList.remove("active"),
        ));
    const o = document.getElementById("btn-action-jump");
    (o &&
      o.addEventListener("pointerdown", (t) => {
        (t.stopPropagation(),
          t.preventDefault(),
          o.classList.add("active"),
          this.callbacks.onJump && this.callbacks.onJump());
      }),
      o && o.addEventListener("pointerup", () => o.classList.remove("active")),
      o &&
        o.addEventListener("pointercancel", () =>
          o.classList.remove("active"),
        ));
    const s = document.getElementById("btn-action-swing");
    (s &&
      s.addEventListener("pointerdown", (t) => {
        (t.stopPropagation(),
          t.preventDefault(),
          s.classList.add("active"),
          this.callbacks.onSwing && this.callbacks.onSwing());
      }),
      s && s.addEventListener("pointerup", () => s.classList.remove("active")),
      s &&
        s.addEventListener("pointercancel", () =>
          s.classList.remove("active"),
        ));
    const a = document.getElementById("btn-action-slice");
    (a &&
      a.addEventListener("pointerdown", (t) => {
        (t.stopPropagation(),
          t.preventDefault(),
          a.classList.add("active"),
          this.callbacks.onSlice && this.callbacks.onSlice());
      }),
      a && a.addEventListener("pointerup", () => a.classList.remove("active")),
      a &&
        a.addEventListener("pointercancel", () =>
          a.classList.remove("active"),
        ));
    const r = () => this.toggleFullscreen(),
      l = document.getElementById("btn-fullscreen-toggle");
    l &&
      l.addEventListener("click", (t) => {
        (t.stopPropagation(), r());
      });
    const h = document.getElementById("btn-top-fullscreen");
    h &&
      h.addEventListener("click", (t) => {
        (t.stopPropagation(), r());
      });
    const c = document.getElementById("btn-notice-fullscreen");
    c &&
      c.addEventListener("click", (t) => {
        (t.stopPropagation(), r());
      });
    const u = document.getElementById("btn-notice-dismiss");
    u &&
      u.addEventListener("click", (t) => {
        t.stopPropagation();
        const d = document.getElementById("landscape-orientation-notice");
        d && d.classList.add("hidden");
      });
    const m = document.getElementById("btn-controls-toggle");
    m &&
      m.addEventListener("click", (t) => {
        t.stopPropagation();
        const d = document.body.classList.toggle("hide-touch-controls"),
          p = document.getElementById("controls-toggle-label");
        p && (p.textContent = d ? "Controls: OFF" : "Controls: ON");
      });
    const v = () => {
      const d = !!(
        document.fullscreenElement || document.webkitFullscreenElement
      );
      document.body.classList.toggle("is-fullscreen", d);
      const p = document.getElementById("fullscreen-btn-text");
      p && (p.textContent = d ? "Exit Full" : "Fullscreen");
    };
    (document.addEventListener("fullscreenchange", v),
      document.addEventListener("webkitfullscreenchange", v));
  }
  _handleJoystickDrag(t, n, e) {
    const i = t - this._joystickCenter.x,
      o = n - this._joystickCenter.y,
      s = Math.hypot(i, o),
      a = 38,
      r = s > a ? a / s : 1,
      l = i * r,
      h = o * r;
    e.style.transform = `translate(${l.toFixed(1)}px, ${h.toFixed(1)}px)`;
    const c = l / a,
      u = h / a;
    this.callbacks.onJoystickMove &&
      this.callbacks.onJoystickMove({ x: c, z: u });
  }
  _initLandscapeWatch() {
    const t = () => {
      const n = window.innerWidth,
        e = window.innerHeight,
        i = e > n,
        o = document.getElementById("landscape-orientation-notice");
      o &&
      i &&
      n < 900 &&
      !document.body.classList.contains("dismissed-orientation-notice")
        ? o.classList.remove("hidden")
        : o && o.classList.add("hidden");
    };
    (window.addEventListener("resize", t),
      window.addEventListener("orientationchange", () => setTimeout(t, 200)),
      t());
    const n = document.getElementById("btn-notice-dismiss");
    n &&
      n.addEventListener("click", () => {
        document.body.classList.add("dismissed-orientation-notice");
      });
  }
  toggleFullscreen() {
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const t = document.documentElement;
        (t.requestFullscreen
          ? t.requestFullscreen().catch(() => {
              t.webkitRequestFullscreen && t.webkitRequestFullscreen();
            })
          : t.webkitRequestFullscreen && t.webkitRequestFullscreen(),
          window.screen &&
            window.screen.orientation &&
            window.screen.orientation.lock &&
            window.screen.orientation.lock("landscape").catch(() => {}));
      } else
        document.exitFullscreen
          ? document.exitFullscreen().catch(() => {
              document.webkitExitFullscreen && document.webkitExitFullscreen();
            })
          : document.webkitExitFullscreen && document.webkitExitFullscreen();
    } catch (t) {
      console.warn("[HudUI] Fullscreen toggle error:", t);
    }
  }
  async openMultiplayerModal() {
    if (this.elCompanionModal) {
      try {
        const t = await fetch("/api/tunnel/status", { cache: "no-store" });
        if (t.ok) {
          const n = await t.json();
          if (n.tunnelUrl) {
            this.currentTunnelUrl = n.tunnelUrl;
            const e = document.getElementById("tunnel-url-input");
            e && (e.value = n.tunnelUrl);
          }
        }
      } catch {}
      (this.updateMultiplayerRoomInfo({
        roomId: this.currentRoomId,
        tunnelUrl: this.currentTunnelUrl,
      }),
        this.elCompanionModal.classList.remove("hidden"));
    }
  }
  hideTitleModal() {
    (document.documentElement.classList.add("autoplay-mode"),
      this.elTitleModal &&
        (this.elTitleModal.classList.add("hidden"),
        (this.elTitleModal.style.display = "none")));
  }
  showTitleModal() {
    (document.documentElement.classList.remove("autoplay-mode"),
      this.elTitleModal &&
        (this.elTitleModal.classList.remove("hidden"),
        (this.elTitleModal.style.display = "flex")));
  }
  hideVictoryModal() {
    this.elVictoryModal && this.elVictoryModal.classList.add("hidden");
  }
  showVictoryModal({ playerWon: t, playerGames: n, opponentGames: e, activeLevel: lvl = null, activeStoryChapter: ch = null, starsResult: sr = null }) {
    if (!this.elVictoryModal) return;
    const i = document.getElementById("victory-result-banner"),
      o = document.getElementById("victory-match-score"),
      s = document.getElementById("skill-rating-value"),
      lvlBanner = document.getElementById("victory-level-cleared-banner"),
      lvlStars = document.getElementById("victory-level-stars"),
      btnNext = document.getElementById("btn-victory-next-level");

    (i &&
      ((i.textContent = t ? "YOU WIN!" : "TRY AGAIN!"),
      (i.style.color = t ? "#ffea28" : "#9ad4ff")),
      o && (o.textContent = `Final Games: ${n} - ${e}`));
    const a = t ? 1145 : 1020;
    (s && (s.textContent = String(a)),
      this._drawSkillGraph(t));

    // Handle level cleared or chapter cleared banner
    if (lvlBanner) {
      if ((lvl || ch) && t) {
        lvlBanner.classList.remove("hidden");
        const titleSpan = lvlBanner.querySelector(".level-cleared-title");
        if (titleSpan) {
          titleSpan.textContent = lvl ? `🏆 ${lvl.title} CLEARED!` : `📖 CHAPTER ${ch.id} COMPLETED!`;
        }
        if (lvlStars) {
          const count = sr ? sr.stars : 3;
          let starsStr = "";
          for (let k = 0; k < 3; k++) {
            starsStr += k < count ? "⭐" : "☆";
          }
          lvlStars.textContent = starsStr;
        }
      } else {
        lvlBanner.classList.add("hidden");
      }
    }

    // Handle Next Level / Chapter button
    if (btnNext) {
      if ((lvl || ch) && t) {
        btnNext.classList.remove("hidden");
        btnNext.textContent = lvl ? "Next Level ➔" : "Next Chapter ➔";
      } else {
        btnNext.classList.add("hidden");
      }
    }

    // Auto-record chronological match result into Career History
    try {
      if (window.__lobbyManager?.recordMatchResult) {
        const oppName = lvl ? lvl.opponentName : (ch ? ch.rival.name : (this.selectedDifficulty === "pro" ? "Matt Titan" : "Casual AI"));
        const fmt = lvl ? lvl.format.toUpperCase() : (ch ? ch.format.toUpperCase() : (this.selectedGamesToWin === 1 ? "1v1 Quick" : "1v1 Solo"));
        const court = lvl ? lvl.courtName : (ch ? ch.location : "Cyber Arena");
        const starCount = sr ? sr.stars : (t ? 3 : 1);
        window.__lobbyManager.recordMatchResult({
          opponentName: oppName,
          score: `${n} - ${e}`,
          playerWon: t,
          format: fmt,
          courtName: court,
          stars: starCount,
          rewardCoins: lvl ? lvl.rewardCoins : (t ? 8000 : 2500),
          rewardRP: lvl ? lvl.rewardRP : (t ? 35 : 10),
        });
      }
    } catch (err) {}

    this.elVictoryModal.classList.remove("hidden");
  }
  _drawSkillGraph(t) {
    const n = document.getElementById("skill-graph-canvas");
    if (!n) return;
    const e = n.getContext("2d"),
      i = n.width,
      o = n.height;
    (e.clearRect(0, 0, i, o),
      (e.fillStyle = "#f8fbff"),
      e.fillRect(0, 0, i, o),
      (e.strokeStyle = "#d0dce8"),
      (e.lineWidth = 1));
    for (let p = 25; p < o; p += 35)
      (e.beginPath(), e.moveTo(0, p), e.lineTo(i, p), e.stroke());
    const s = o * 0.56;
    ((e.strokeStyle = "#9aaab8"),
      e.setLineDash([4, 4]),
      e.beginPath(),
      e.moveTo(0, s),
      e.lineTo(i, s),
      e.stroke(),
      e.setLineDash([]),
      (e.fillStyle = "#6c7c8c"),
      (e.font = "bold 11px sans-serif"),
      e.fillText("PRO 1000", 8, s - 5));
    const a = t
      ? [0.74, 0.66, 0.58, 0.45, 0.24]
      : [0.74, 0.66, 0.58, 0.52, 0.55];
    ((e.strokeStyle = "#1f96f2"),
      (e.lineWidth = 3.5),
      (e.lineCap = "round"),
      (e.lineJoin = "round"),
      e.beginPath(),
      a.forEach((p, g) => {
        const y = 24 + (g / (a.length - 1)) * (i - 48),
          f = o * p;
        g === 0 ? e.moveTo(y, f) : e.lineTo(y, f);
      }),
      e.stroke());
    const r = i - 24,
      m = o * a[a.length - 1];
    ((e.fillStyle = "#ffea28"),
      e.beginPath(),
      e.arc(r, m, 6, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#006cc4"),
      (e.lineWidth = 2.5),
      e.stroke());
  }
  configureGameBubbles(t = 2) {
    [this.elGamesPlayer, this.elGamesOpponent].forEach((n) => {
      if (!n) return;
      n.querySelectorAll(".game-bubble").forEach((i, o) => {
        o < Math.max(1, t)
          ? i.classList.remove("hidden")
          : i.classList.add("hidden");
      });
    });
  }
  updateScoreboard({
    playerScoreText: t = "00",
    opponentScoreText: n = "00",
    deuceLabel: e = null,
    playerGames: i = 0,
    opponentGames: o = 0,
    gamesToWin: s = 2,
  }) {
    this.elScoreCenter &&
      (e
        ? (this.elScoreCenter.classList.add("deuce-mode"),
          (this.elScorePlayer.textContent = e),
          this.elScoreSep.classList.add("hidden"),
          this.elScoreOpponent.classList.add("hidden"))
        : (this.elScoreCenter.classList.remove("deuce-mode"),
          (this.elScorePlayer.textContent = t),
          this.elScoreSep.classList.remove("hidden"),
          this.elScoreOpponent.classList.remove("hidden"),
          (this.elScoreOpponent.textContent = n)),
      this.configureGameBubbles(s),
      this.elGamesPlayer &&
        this.elGamesPlayer
          .querySelectorAll(".game-bubble")
          .forEach((r, m) => r.classList.toggle("won", m < i)),
      this.elGamesOpponent &&
        this.elGamesOpponent
          .querySelectorAll(".game-bubble")
          .forEach((r, m) => r.classList.toggle("won", m < o)));
  }
  updateServerTag(t, n) {
    if (!this.elServerTag) return;
    if (!n || !t || !t.visible) {
      this.elServerTag.classList.add("hidden");
      return;
    }
    this.elServerTag.classList.remove("hidden");
    const e = Math.max(80, Math.min(window.innerWidth - 80, t.x)),
      i = Math.max(95, Math.min(window.innerHeight - 90, t.y));
    ((this.elServerTag.style.left = `${e.toFixed(1)}px`),
      (this.elServerTag.style.top = `${i.toFixed(1)}px`));
  }
  updatePlayerNameplate(t, n) {
    if (!this.elPlayerNameplate) return;
    if (!n || !t || !t.visible) {
      this.elPlayerNameplate.classList.add("hidden");
      return;
    }
    this.elPlayerNameplate.classList.remove("hidden");
    const e = Math.max(90, Math.min(window.innerWidth - 90, t.x)),
      i = Math.max(120, Math.min(window.innerHeight - 50, t.y));
    ((this.elPlayerNameplate.style.left = `${e.toFixed(1)}px`),
      (this.elPlayerNameplate.style.top = `${i.toFixed(1)}px`));
  }
  showTimingPopup({
    grade: t = "PERFECT",
    detail: n = "POWER TOPSPIN \u2022 176 KM/H",
    screenPos: e = null,
    durationMs: i = 750,
  }) {
    if (this.elTimingPopup) {
      if (
        (this.timingPopupTimer && clearTimeout(this.timingPopupTimer),
        (this.elTimingGrade.textContent = t),
        (this.elTimingGrade.className = "timing-grade"),
        t.includes("EARLY")
          ? this.elTimingGrade.classList.add("grade-early")
          : t.includes("LATE")
            ? this.elTimingGrade.classList.add("grade-late")
            : this.elTimingGrade.classList.add("grade-perfect"),
        (this.elTimingDetail.textContent = n),
        e && e.visible)
      ) {
        const o = Math.max(110, Math.min(window.innerWidth - 110, e.x)),
          s = Math.max(65, Math.min(window.innerHeight * 0.22, e.y - 70));
        ((this.elTimingPopup.style.left = `${o.toFixed(1)}px`),
          (this.elTimingPopup.style.top = `${s.toFixed(1)}px`));
      } else
        ((this.elTimingPopup.style.left = "50%"),
          (this.elTimingPopup.style.top = "16%"));
      (this.elTimingPopup.classList.remove("hidden"),
        i > 0 &&
          (this.timingPopupTimer = setTimeout(() => {
            this.elTimingPopup.classList.add("hidden");
          }, i)));
    }
  }
  showCenterBanner(
    t,
    {
      style: n = "style-gold",
      subText: e = "",
      durationMs: i = 1500,
      persistent: o = !1,
    } = {},
  ) {
    !this.elBannerLayer ||
      !this.elBannerText ||
      (this.bannerTimer &&
        (clearTimeout(this.bannerTimer), (this.bannerTimer = null)),
      (this.elBannerText.textContent = t),
      (this.elBannerText.className = `center-banner-text ${n}`),
      this.elBannerSub &&
        (e
          ? ((this.elBannerSub.textContent = e),
            this.elBannerSub.classList.remove("hidden"))
          : this.elBannerSub.classList.add("hidden")),
      this.elBannerLayer.classList.remove("hidden"),
      !o &&
        i > 0 &&
        (this.bannerTimer = setTimeout(() => {
          this.hideCenterBanner();
        }, i)));
  }
  hideCenterBanner() {
    (this.bannerTimer &&
      (clearTimeout(this.bannerTimer), (this.bannerTimer = null)),
      this.elBannerLayer && this.elBannerLayer.classList.add("hidden"));
  }
  showEmoteWheel({ autoCloseMs = 3800 } = {}) {
    if (!this.elEmoteWheelContainer) return;
    if (this._emoteWheelAutoTimer) {
      clearTimeout(this._emoteWheelAutoTimer);
      this._emoteWheelAutoTimer = null;
    }
    this.elEmoteWheelContainer.classList.remove("hidden");
    if (autoCloseMs > 0) {
      this._emoteWheelAutoTimer = setTimeout(() => {
        this.hideEmoteWheel();
      }, autoCloseMs);
    }
  }
  hideEmoteWheel() {
    if (this._emoteWheelAutoTimer) {
      clearTimeout(this._emoteWheelAutoTimer);
      this._emoteWheelAutoTimer = null;
    }
    if (this.elEmoteWheelContainer) {
      this.elEmoteWheelContainer.classList.add("hidden");
    }
  }
  toggleEmoteWheel() {
    if (!this.elEmoteWheelContainer) return;
    if (this.elEmoteWheelContainer.classList.contains("hidden")) {
      this.showEmoteWheel({ autoCloseMs: 4500 });
    } else {
      this.hideEmoteWheel();
    }
  }
  showSpeechBubble(role = "player", { icon = "👏", text = "Nice Shot!", durationMs = 2800 } = {}) {
    const isPlayer = role === "player" || role === "p1";
    const bubble = isPlayer ? this.elPlayerSpeechBubble : this.elOpponentSpeechBubble;
    const iconEl = isPlayer ? this.elPsbIcon : this.elOsbIcon;
    const textEl = isPlayer ? this.elPsbText : this.elOsbText;

    if (!bubble) return;
    if (iconEl) iconEl.textContent = icon;
    if (textEl) textEl.textContent = text;

    bubble.classList.remove("hidden");

    if (isPlayer) {
      if (this._playerSpeechTimer) clearTimeout(this._playerSpeechTimer);
      this._playerSpeechTimer = setTimeout(() => {
        bubble.classList.add("hidden");
      }, durationMs);
    } else {
      if (this._opponentSpeechTimer) clearTimeout(this._opponentSpeechTimer);
      this._opponentSpeechTimer = setTimeout(() => {
        bubble.classList.add("hidden");
      }, durationMs);
    }
  }
  updateSpeechBubblePosition(role = "player", screenPos = null) {
    const isPlayer = role === "player" || role === "p1";
    const bubble = isPlayer ? this.elPlayerSpeechBubble : this.elOpponentSpeechBubble;
    if (!bubble) return;

    if (!screenPos || !screenPos.visible) {
      return;
    }

    const clampX = Math.max(90, Math.min(window.innerWidth - 90, screenPos.x));
    const clampY = Math.max(80, Math.min(window.innerHeight - 60, screenPos.y - 48));
    bubble.style.left = `${clampX.toFixed(1)}px`;
    bubble.style.top = `${clampY.toFixed(1)}px`;
  }
  setReplayMode(t) {
    (document.body.classList.toggle("replay-mode", !!t),
      this.elReplayBadge && this.elReplayBadge.classList.toggle("hidden", !t));
  }
  setActiveShotChip(t) {}
  updateTimingGauge({
    cursorNormalized: t = 0.5,
    modeTitle: n = "SWING TIMING",
    speedText: e = "READY",
  }) {
    if (this.elTimingCursor) {
      const i = Math.max(4, Math.min(96, t * 100));
      this.elTimingCursor.style.left = `${i.toFixed(1)}%`;
    }
    (this.elGaugeModeTitle && (this.elGaugeModeTitle.textContent = n),
      this.elGaugeSpeedReadout && (this.elGaugeSpeedReadout.textContent = e));
  }
  updateAudioStatus({ playing: t, trackName: n }) {
    (this.elAudioDot && this.elAudioDot.classList.toggle("music-on", !!t),
      this.elAudioLabel &&
        (this.elAudioLabel.textContent = t
          ? `Lyria: ${n || "Sunny Rally"}`
          : "Lyria: Muted"));
  }
  updateCameraLabel(t) {
    this.elCameraLabel && (this.elCameraLabel.textContent = t);
  }
  updateMotionStatus({
    webcamActive: t = !1,
    phoneConnected: n = !1,
    p1Phone: e = !1,
    p2Phone: i = !1,
  }) {
    (this.elWebcamPip && this.elWebcamPip.classList.toggle("hidden", !t),
      this.elWebcamDot && this.elWebcamDot.classList.toggle("active", !!t),
      this.elPhoneDot &&
        this.elPhoneDot.classList.toggle("active", !!(n || e || i)),
      this.elPhoneLabel &&
        (e && i
          ? (this.elPhoneLabel.textContent = "P1 & P2 Rackets")
          : n || e || i
            ? (this.elPhoneLabel.textContent = "Racket Connected")
            : (this.elPhoneLabel.textContent = "Pocket Racket")));
  }
  updateMultiplayerRoomInfo(t = {}) {
    const n = { ...(this._lastRoomStatus || {}), ...t };
    if (
      ((this._lastRoomStatus = n),
      n.roomId && (this.currentRoomId = String(n.roomId).toLowerCase()),
      n.role &&
        (this.playerRole = String(n.role).toLowerCase() === "p2" ? "p2" : "p1"),
      n.tunnelUrl)
    ) {
      this.currentTunnelUrl = String(n.tunnelUrl).replace(/\/+$/, "");
      const d = document.getElementById("tunnel-url-input");
      d && document.activeElement !== d && (d.value = this.currentTunnelUrl);
    }
    const e = this.playerRole === "p2",
      i = document.getElementById("mp-card-p1"),
      o = document.getElementById("mp-card-p2"),
      s = document.getElementById("mp-gchat-invite-box"),
      a = document.getElementById("btn-create-1v1-room");
    (i && i.classList.toggle("hidden", e),
      o && o.classList.toggle("hidden", !e),
      s && s.classList.toggle("hidden", e),
      a && a.classList.toggle("hidden", e));
    const r = document.getElementById("companion-room-badge");
    r &&
      (r.textContent = `ROOM #${this.currentRoomId.toUpperCase()} \u2022 ${e ? "PLAYER 2" : "PLAYER 1"}`);
    const m = encodeURIComponent(this.currentRoomId),
      p = (this.currentTunnelUrl || window.location.origin).replace(/\/+$/, ""),
      g = `${p}/companion.html?room=${m}&role=p1`,
      y = `${p}/companion.html?room=${m}&role=p2`,
      f = document.getElementById("companion-link");
    f && (f.href = g);
    const I = document.getElementById("companion-link-p2");
    I && (I.href = y);
    const b = document.getElementById("companion-qr");
    if (b) {
      const d =
        "https://www.gstatic.com/aistudio/starter-apps/tennis/qr/player1_qr.png";
      b.dataset.lastSrc !== d && ((b.src = d), (b.dataset.lastSrc = d));
    }
    const B = document.getElementById("companion-qr-p2");
    if (B) {
      const d =
        "https://www.gstatic.com/aistudio/starter-apps/tennis/qr/player2_qr.png";
      B.dataset.lastSrc !== d && ((B.src = d), (B.dataset.lastSrc = d));
    }
    const T = document.getElementById("court-link-p1");
    T && (T.href = `/?room=${m}&role=p1`);
    const l = document.getElementById("court-link-p2");
    l && (l.href = `/?room=${m}&role=p2`);
    const c = document.getElementById("mp-p1-status");
    if (c) {
      const d = !!(n.p1Phone || n.p1Online);
      ((c.textContent = n.p1Phone
        ? "Connected \u2713"
        : d
          ? "Court Ready"
          : "Scan QR"),
        c.classList.toggle("online", !!n.p1Phone));
    }
    const u = document.getElementById("mp-p2-status");
    if (u) {
      const d = !!(n.p2Phone || n.p2Online);
      ((u.textContent = n.p2Phone
        ? "Connected \u2713"
        : d
          ? "Court Ready"
          : "Scan QR"),
        u.classList.toggle("online", !!n.p2Phone));
    }
    const h = document.getElementById("mp-active-status");
    if (h) {
      const d = e ? !!n.p2Phone : !!n.p1Phone;
      ((h.textContent = d ? "Connected \u2713" : "Scan QR"),
        h.classList.toggle("online", d));
    }
    this.updateOpponentPresence(n);
  }
  updateOpponentPresence(t = {}) {
    const n = !!(
        t.isMultiplayer ||
        this.selectedDifficulty === "1v1" ||
        (this.currentRoomId && this.currentRoomId !== "default")
      ),
      e = document.querySelector(
        ".mii-side-opponent .mii-avatar-badge:not(.secondary-mii)",
      );
    if (!n) {
      (this.elOpponentPresencePill &&
        this.elOpponentPresencePill.classList.add("hidden"),
        e && e.classList.remove("opponent-ready"),
        (this._lastOtherReady = !1));
      return;
    }
    const i = t.hostName && t.hostName.trim() ? t.hostName.trim() : "Player 1",
      o = t.guestName && t.guestName.trim() ? t.guestName.trim() : "Player 2",
      s = this.playerRole === "p2";
    let a = !1,
      r = "";
    (s
      ? ((a = !!(t.p2Phone || t.p1Phone || t.p1Online)),
        t.p2Phone
          ? (r = `Racket Ready \u2022 ${i} Joined`)
          : t.p1Phone || t.p1Online
            ? (r = `${i} Ready \u2022 Scan QR for Phone Racket`)
            : (r = `Waiting for ${i}\u2026`))
      : ((a = !!(t.p2Phone || t.p2Online)),
        t.p2Phone && t.p2Online
          ? (r = `${o} Connected \u2022 Ready to Serve!`)
          : t.p2Phone
            ? (r = `${o}'s Racket Ready \u2022 Ready to Serve!`)
            : t.p2Online
              ? (r = `${o} Joined \u2022 Ready to Serve!`)
              : (r = `Waiting for ${o}\u2026`)),
      this.elOpponentPresencePill &&
        (this.elOpponentPresencePill.classList.remove("hidden"),
        this.elOpponentPresencePill.classList.toggle("ready", a),
        this.elOpponentPresencePill.classList.toggle("in-rally", !!t.inRally),
        a &&
          !this._lastOtherReady &&
          (this.elOpponentPresencePill.classList.remove("just-joined"),
          this.elOpponentPresencePill.offsetWidth,
          this.elOpponentPresencePill.classList.add("just-joined"),
          this._justJoinedTimer && clearTimeout(this._justJoinedTimer),
          (this._justJoinedTimer = setTimeout(() => {
            this.elOpponentPresencePill &&
              this.elOpponentPresencePill.classList.remove("just-joined");
          }, 950)))),
      this.elOpponentPresenceText &&
        (this.elOpponentPresenceText.textContent = r),
      e && e.classList.toggle("opponent-ready", a));
    const m = document.getElementById("setup-opponent-label");
    (m &&
      this.selectedDifficulty === "1v1" &&
      !s &&
      (m.textContent = a ? `\u{1F7E2} ${o} Ready` : o),
      (this._lastOtherReady = a));
  }
}
