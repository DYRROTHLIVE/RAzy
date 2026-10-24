// RAzy: Screen Flow, Cyber Command Deck, 100+ Levels Tour, User Profile & Rank Manager
import { renderMiiAvatar } from './mii_avatars.js';
import {
  StoryAndLevelsManager,
  STORY_CHAPTERS,
  TOURNAMENT_WORLDS,
  TOURNAMENT_LEVELS,
  RANK_TIERS,
  MII_PERSONALITIES,
  DAILY_QUESTS,
  SYSTEM_MAILS,
  DAILY_CHECKIN,
  getRankFromRP
} from './story_and_levels.js';

export class SmashClubLobbyManager {
  constructor(gameEngine, hudUI) {
    this.engine = gameEngine;
    this.hud = hudUI;
    window.__lobbyManager = this;

    // Current Screen
    this.currentScreen = 'splash';

    // Active Selection Mode: 'levels' | 'story' | 'ranked' | 'doubles'
    this.selectedMode = 'levels';

    // Player Profile (persisted)
    this.playerProfile = this._loadProfile();

    // Story & 100+ Levels Manager
    this.storyManager = new StoryAndLevelsManager(gameEngine, this);
    if (this.engine) {
      this.engine.storyManager = this.storyManager;
    }

    // Selected Story Chapter
    this.selectedChapterId = Math.min(this.storyManager.unlockedChapter, STORY_CHAPTERS.length);

    // Selected World for 100+ Level Select (default to active unlocked world)
    const currentWorld = Math.min(10, Math.ceil(this.storyManager.unlockedLevel / 12));
    this.selectedWorldId = Math.max(1, currentWorld);

    // Match Configuration
    this.matchSettings = {
      mode: 'offline',
      format: '2v2',
      difficulty: 'casual',
      gamesToWin: 2,
      teamCode: this._generateTeamCode(),
    };

    // System Mails & Quests state
    this.quests = JSON.parse(JSON.stringify(DAILY_QUESTS));
    this.mails = JSON.parse(JSON.stringify(SYSTEM_MAILS));

    this.friendsList = this._loadFriends();
    this.matchHistory = this._loadMatchHistory();

    this._cacheDOMElements();
    this._bindDOMEvents();
    this._initScreenFlow();
  }

  _cacheDOMElements() {
    this.cmdDeckStage = document.querySelector('.cmd-deck-stage');
    this.elSplash = document.getElementById('brand-splash-screen');
    this.elLoading = document.getElementById('loading-screen');
    this.loadingFill = document.getElementById('loading-bar-fill');
    this.loadingStatus = document.getElementById('loading-status-text');
    this.loadingPct = document.getElementById('loading-pct-text');
    this.btnLoadingRetry = document.getElementById('btn-loading-retry');

    this.elLanding = document.getElementById('landing-screen');
    this.elAuth = document.getElementById('auth-screen');
    this.elProfileCreate = document.getElementById('profile-create-screen');
    this.elLobby = document.getElementById('game-lobby-screen');
    this.elLandscapeShield = document.getElementById('landscape-enforcer-shield');
    this.elHudRoot = document.getElementById('hud-root');

    // Splash
    this.btnSkipSplash = document.getElementById('btn-skip-splash');

    // Landing
    this.btnLandingPlay = document.getElementById('btn-landing-play');
    this.btnLandingSettings = document.getElementById('btn-landing-audio');

    // Auth
    this.btnGoogleLogin = document.getElementById('btn-google-login');
    this.btnGuestLogin = document.getElementById('btn-guest-login');
    this.inputGuestName = document.getElementById('input-guest-name');
    this.avatarPickerItems = document.querySelectorAll('.auth-avatar-choice');
    this.authStatusToast = document.getElementById('auth-status-toast');
    this.linkPrivacyPolicy = document.getElementById('link-privacy-policy');
    this.linkTermsService = document.getElementById('link-terms-service');

    // Profile Creation (Stage 5)
    this.pCreateAvatarCanvas = document.getElementById('p-create-avatar-canvas');
    this.pCreateGoogleEmail = document.getElementById('p-create-google-email');
    this.inputProfileUsername = document.getElementById('input-profile-username');
    this.badgeUsernameAvailability = document.getElementById('username-availability-badge');
    this.btnSuggestUsername = document.getElementById('btn-suggest-username');
    this.boxSuggestions = document.getElementById('username-suggestions-box');
    this.previewUID = document.getElementById('profile-create-uid-preview');
    this.btnSubmitCreateProfile = document.getElementById('btn-submit-create-profile');

    // Command Top Bar Elements
    this.cmdProfilePill = document.getElementById('cmd-profile-pill');
    this.profileNameDisplay = document.getElementById('lobby-player-name');
    this.profileLvlDisplay = document.getElementById('lobby-player-lvl');
    this.profileExpBar = document.getElementById('lobby-player-exp-bar');
    this.profileExpDigits = document.getElementById('lobby-exp-text');
    this.profileVipTag = document.getElementById('lobby-vip-tag');
    this.profileCombatPower = document.getElementById('lobby-combat-power');
    this.profileBadgeCanvas = document.getElementById('lobby-player-avatar');

    // Currencies & Rank Pill
    this.goldCountDisplay = document.getElementById('lobby-gold-count');
    this.gemsCountDisplay = document.getElementById('lobby-gems-count');
    this.energyCountDisplay = document.getElementById('lobby-energy-count');
    this.cmdRankPill = document.getElementById('cmd-rank-pill');
    this.rankBadgeIcon = document.getElementById('lobby-rank-badge-icon');
    this.rankNameDisplay = document.getElementById('lobby-rank-name');
    this.rankRpDisplay = document.getElementById('lobby-rank-rp');

    // Top Right Utility Buttons
    this.btnTopInstallApk = document.getElementById('btn-top-install-apk');
    this.btnInstallApkPrompt = document.getElementById('btn-install-apk-prompt');
    this.btnTopFriends = document.getElementById('btn-top-friends');
    this.btnTopMessages = document.getElementById('btn-top-messages');
    this.btnTopNotifications = document.getElementById('btn-top-notifications');
    this.btnTopSettings = document.getElementById('btn-top-settings');

    // Left Navigation 10-Item Panel
    this.navTabBtns = document.querySelectorAll('.lobby-left-navbar .nav-tab-btn');

    // Bottom Action Bar
    this.lobbyChatPill = document.getElementById('lobby-chat-pill');
    this.lobbyModePills = document.querySelectorAll('.lobby-mode-pill');
    this.btnOpenGameLibrary = document.getElementById('btn-open-game-library');
    this.activeGameTitle = document.getElementById('lobby-active-game-title');
    this.btnLobbyStartMatch = document.getElementById('btn-lobby-start-match');

    // Left Hex & Billboard Buttons
    this.btnHexMail = document.getElementById('btn-hex-mail');
    this.btnHexQuests = document.getElementById('btn-hex-quests');
    this.btnHexCheckin = document.getElementById('btn-hex-checkin');
    this.btnShopBillboard = document.getElementById('btn-shop-billboard');

    // Center Stage Battle Launch
    this.btnMainBattle = document.getElementById('btn-main-battle-start');
    this.pedestalLevels = document.getElementById('btn-pedestal-levels');
    this.pedestalStory = document.getElementById('btn-pedestal-story');
    this.pedestalRanked = document.getElementById('btn-pedestal-ranked');
    this.pedestalDoubles = document.getElementById('btn-pedestal-doubles');

    // Right Column Terminal
    this.termAvatarCanvas = document.getElementById('terminal-operator-avatar');
    this.termOperatorName = document.getElementById('terminal-operator-name');
    this.termOperatorTitle = document.getElementById('term-operator-title');
    this.btnTermFriends = document.getElementById('btn-term-friends');
    this.btnTermBag = document.getElementById('btn-term-bag');
    this.btnTermRanks = document.getElementById('btn-term-ranks');
    this.btnTermChat = document.getElementById('btn-term-chat');
    this.btnTermReplay = document.getElementById('btn-term-replay');
    this.btnTermHistory = document.getElementById('btn-term-history');

    // Modals
    this.modalProfile = document.getElementById('user-profile-modal');
    this.modalLevels = document.getElementById('levels-browser-modal');
    this.modalStory = document.getElementById('story-browser-modal');
    this.modalRanked = document.getElementById('ranked-system-modal');
    this.modalQuests = document.getElementById('quests-modal');
    this.modalMailbox = document.getElementById('mailbox-modal');
    this.modalCheckin = document.getElementById('checkin-modal');
    this.modalShop = document.getElementById('pro-shop-modal');
    this.modalTeam = document.getElementById('team-room-modal');
    this.modalCinematicReplay = document.getElementById('cinematic-replay-modal');
    this.modalHistory = document.getElementById('match-history-modal');
    this.historyItemsContainer = document.getElementById('history-items-container');

    // New RAzy Modals
    this.modalMatchPrep = document.getElementById('match-prep-modal');
    this.modalGameLibrary = document.getElementById('game-library-modal');
    this.modalSettings = document.getElementById('universal-settings-modal');
    this.modalWardrobe = document.getElementById('character-wardrobe-modal');
    this.modalArmory = document.getElementById('weapons-armory-modal');
    this.modalInventory = document.getElementById('inventory-modal');
    this.modalClan = document.getElementById('clan-modal');
    this.modalEvents = document.getElementById('events-modal');
    this.modalNotifications = document.getElementById('notifications-modal');
    this.modalChat = document.getElementById('chat-modal');
    this.modalPrivacy = document.getElementById('privacy-policy-modal');
    this.modalTerms = document.getElementById('terms-service-modal');
    this.modalDeleteAccount = document.getElementById('delete-account-modal');

    // Match Prep elements
    this.prepCountdown = document.getElementById('prep-countdown');
    this.btnPrepCancel = document.getElementById('btn-prep-cancel');
    this.btnPrepLaunchNow = document.getElementById('btn-prep-launch-now');
    this.prepPlayerAvatar = document.getElementById('prep-mii-player');
    this.prepOpponentAvatar = document.getElementById('prep-mii-opponent');
    this._prepTimer = null;

    // Quick Match Floating Button
    this.btnLobbyQuickCasual = document.getElementById('btn-lobby-quick-casual');

    // Instant Replay Theatre Elements
    this.btnCloseCinematicReplay = document.getElementById('btn-close-cinematic-replay');
    this.replayScrubSlider = document.getElementById('replay-scrub-slider');
    this.replayCurrentTime = document.getElementById('replay-current-time');
    this.replayTotalTime = document.getElementById('replay-total-time');
    this.btnReplayPlayPause = document.getElementById('btn-replay-play-pause');
    this.replayPlayIcon = document.getElementById('replay-play-icon');
    this.replayPlayTxt = document.getElementById('replay-play-txt');
    this.btnReplayRestart = document.getElementById('btn-replay-restart');
    this.replaySpeedBtns = document.querySelectorAll('.replay-spd-btn');
    this.replayCamBtns = document.querySelectorAll('.replay-cam-btn');
    this.replayMetaText = document.getElementById('replay-meta-text');
    this.replayCamBadge = document.getElementById('replay-camera-badge');
    this.replaySpeedBadge = document.getElementById('replay-speed-badge');
    this._replaySyncTimer = null;

    // Victory modal Next Level button
    this.btnVictoryNextLevel = document.getElementById('btn-victory-next-level');

    // Online & Friends
    this.txtTeamCode = document.getElementById('lobby-team-code');
    this.btnCopyCode = document.getElementById('btn-copy-team-code');
    this.btnNewCode = document.getElementById('btn-new-team-code');
    this.inputJoinCode = document.getElementById('input-join-code');
    this.btnJoinTeam = document.getElementById('btn-join-team-code');
    this.friendsContainer = document.getElementById('lobby-friends-list');

    // Toasts
    this.toastContainer = document.getElementById('razy-toast-container');
  }

  _generatePermanentUID() {
    const chars = '0123456789ABCDEF';
    let id = 'RAZ-';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  _getRegisteredUsernames() {
    try {
      const list = localStorage.getItem('razy_registered_usernames');
      if (list) return JSON.parse(list);
    } catch (e) {}
    return ['ammaar', 'alex', 'sarah', 'matt', 'elisa', 'kenji', 'pro_ace', 'cyber_striker'];
  }

  _registerUsername(uname) {
    const list = this._getRegisteredUsernames();
    const clean = uname.trim().toLowerCase();
    if (!list.includes(clean)) {
      list.push(clean);
      localStorage.setItem('razy_registered_usernames', JSON.stringify(list));
    }
  }

  _loadProfile() {
    const saved = localStorage.getItem('razy_user_profile') || localStorage.getItem('smash_club_player_profile');
    const defaultProfile = {
      uid: this._generatePermanentUID(),
      isLoggedIn: false,
      isGuest: false,
      username: 'Ammaar',
      name: 'Ammaar',
      avatarId: 'player1',
      title: 'Thunder Ace',
      personality: 'aggressive',
      skillRating: 1120,
      matchesWon: 42,
      matchesPlayed: 48,
      googleEmail: 'playixkid@gmail.com',
      createdAt: '2026-10-24',
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProfile,
          ...parsed,
          uid: parsed.uid || defaultProfile.uid,
          username: parsed.username || parsed.name || defaultProfile.username,
          personality: parsed.personality || 'aggressive'
        };
      } catch (e) {}
    }
    return defaultProfile;
  }

  _saveProfile() {
    localStorage.setItem('razy_user_profile', JSON.stringify(this.playerProfile));
    localStorage.setItem('smash_club_player_profile', JSON.stringify(this.playerProfile));
    this.updateCommandTopBar();
  }

  _loadFriends() {
    const saved = localStorage.getItem('smash_club_friends');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'f1', name: 'Matt', status: 'online', skill: 1420, avatar: 'opponent1' },
      { id: 'f2', name: 'Sarah', status: 'in-match', skill: 1250, avatar: 'opponent2' },
      { id: 'f3', name: 'Elisa', status: 'online', skill: 1180, avatar: 'player2' },
      { id: 'f4', name: 'Kenji', status: 'online', skill: 1560, avatar: 'opponent2' },
      { id: 'f5', name: 'Leo', status: 'offline', skill: 980, avatar: 'opponent1' },
    ];
  }

  _loadMatchHistory() {
    const saved = localStorage.getItem('smash_club_match_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return [
      {
        id: 'rec-1',
        date: '5m ago',
        timestamp: Date.now() - 300000,
        opponentName: 'Matt Titan',
        format: '1v1 Solo',
        courtName: 'Cyber Dome Final',
        score: '2 - 1',
        playerWon: true,
        stars: 3,
        rewardCoins: 12500,
        rewardRP: 45,
      },
      {
        id: 'rec-2',
        date: '25m ago',
        timestamp: Date.now() - 1500000,
        opponentName: 'Sarah & Kenji',
        format: '2v2 Doubles',
        courtName: 'Neon Metropolis',
        score: '2 - 0',
        playerWon: true,
        stars: 3,
        rewardCoins: 16000,
        rewardRP: 60,
      },
      {
        id: 'rec-3',
        date: '1h ago',
        timestamp: Date.now() - 3600000,
        opponentName: 'Overlord Titan',
        format: '1v1 Boss',
        courtName: 'Orbital Stadium',
        score: '1 - 2',
        playerWon: false,
        stars: 1,
        rewardCoins: 3500,
        rewardRP: 10,
      },
      {
        id: 'rec-4',
        date: '3h ago',
        timestamp: Date.now() - 10800000,
        opponentName: 'Elisa Ice',
        format: '1v1 Solo',
        courtName: 'Emerald Forest',
        score: '2 - 0',
        playerWon: true,
        stars: 3,
        rewardCoins: 9500,
        rewardRP: 35,
      },
      {
        id: 'rec-5',
        date: 'Yesterday',
        timestamp: Date.now() - 86400000,
        opponentName: 'Club Ace AI',
        format: 'Casual AI',
        courtName: 'Classic W-Sports',
        score: '2 - 1',
        playerWon: true,
        stars: 2,
        rewardCoins: 8000,
        rewardRP: 25,
      },
    ];
  }

  recordMatchResult({
    opponentName = 'Casual AI',
    score = '2 - 0',
    playerWon = true,
    format = '1v1 Solo',
    courtName = 'Cyber Arena',
    stars = 3,
    rewardCoins = 6000,
    rewardRP = 25,
  } = {}) {
    const record = {
      id: 'rec-' + Date.now(),
      date: 'Just now',
      timestamp: Date.now(),
      opponentName,
      format,
      courtName,
      score,
      playerWon: !!playerWon,
      stars: Math.max(1, Math.min(3, stars || (playerWon ? 3 : 1))),
      rewardCoins: rewardCoins || (playerWon ? 8000 : 2500),
      rewardRP: rewardRP || (playerWon ? 35 : 10),
    };

    if (!Array.isArray(this.matchHistory)) {
      this.matchHistory = [];
    }
    this.matchHistory.unshift(record);
    if (this.matchHistory.length > 40) {
      this.matchHistory = this.matchHistory.slice(0, 40);
    }

    try {
      localStorage.setItem('smash_club_match_history', JSON.stringify(this.matchHistory));
    } catch (e) {}

    // Also update playerProfile match stats
    if (this.playerProfile) {
      this.playerProfile.matchesPlayed = (this.playerProfile.matchesPlayed || 48) + 1;
      if (playerWon) {
        this.playerProfile.matchesWon = (this.playerProfile.matchesWon || 42) + 1;
      }
      this._saveProfile();
    }

    if (this.modalHistory && !this.modalHistory.classList.contains('hidden')) {
      this._renderMatchHistoryModal();
    }
  }

  _renderMatchHistoryModal() {
    const container = this.historyItemsContainer || document.getElementById('history-items-container');
    const elPlayed = document.getElementById('hist-total-played');
    const elWon = document.getElementById('hist-total-won');
    const elWinRate = document.getElementById('hist-win-rate');
    const elStars = document.getElementById('hist-total-stars');

    const history = Array.isArray(this.matchHistory) ? this.matchHistory : [];
    const totalPlayed = this.playerProfile?.matchesPlayed || history.length || 48;
    const totalWon = this.playerProfile?.matchesWon || history.filter(h => h.playerWon).length || 42;
    const winRate = totalPlayed > 0 ? ((totalWon / totalPlayed) * 100).toFixed(1) : '0.0';

    let totalStars = 0;
    history.forEach(h => {
      totalStars += (h.stars || 0);
    });

    if (elPlayed) elPlayed.textContent = String(totalPlayed);
    if (elWon) elWon.textContent = String(totalWon);
    if (elWinRate) elWinRate.textContent = `${winRate}%`;
    if (elStars) elStars.textContent = `⭐ ${totalStars}`;

    if (!container) return;
    container.innerHTML = '';

    if (history.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:24px 12px;color:#94a3b8;font-size:12px;font-weight:800;">
          No matches recorded yet. Jump into Quick Casual, Ranked, or Level Tour!
        </div>
      `;
      return;
    }

    history.forEach(rec => {
      const card = document.createElement('div');
      card.className = `match-record-card ${rec.playerWon ? 'win' : 'loss'}`;

      let starIcons = '';
      for (let s = 1; s <= 3; s++) {
        starIcons += s <= (rec.stars || 1) ? '⭐' : '☆';
      }

      card.innerHTML = `
        <div class="mrec-left">
          <span class="mrec-outcome-pill ${rec.playerWon ? 'win' : 'loss'}">
            ${rec.playerWon ? 'VICTORY' : 'DEFEAT'}
          </span>
          <div class="mrec-info">
            <span class="mrec-opponent">VS ${rec.opponentName}</span>
            <span class="mrec-meta">${rec.format} • ${rec.courtName || 'Cyber Arena'} • ${rec.date}</span>
          </div>
        </div>
        <div class="mrec-right">
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
            <span class="mrec-score">${rec.score}</span>
            <span class="mrec-stars" title="${rec.stars} Stars">${starIcons}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;font-size:9.5px;font-weight:900;">
            <span style="color:#ffea28;">🪙 +${(rec.rewardCoins || 0).toLocaleString()}</span>
            <span style="color:#38bdf8;">⚡ +${rec.rewardRP || 0} RP</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  _generateTeamCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'RAZ-';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  _enforceLandscapeOrientation() {
    if (!this.elLandscapeShield) return;
    const isPortrait = window.innerHeight > window.innerWidth || (window.innerWidth / window.innerHeight) < 1.15;
    if (isPortrait) {
      this.elLandscapeShield.classList.remove('hidden');
    } else {
      this.elLandscapeShield.classList.add('hidden');
    }
  }

  _initScreenFlow() {
    this._enforceLandscapeOrientation();
    window.addEventListener('resize', () => this._enforceLandscapeOrientation());
    window.addEventListener('orientationchange', () => setTimeout(() => this._enforceLandscapeOrientation(), 250));

    // STAGE 1 — RAzy Brand Splash Screen (1.8s centered logo)
    this.showScreen('splash');

    this.splashTimeout = setTimeout(() => {
      this._runLoadingSequence();
    }, 1800);

    this.updateCommandTopBar();
    this._renderFriendsList();
    this._initModalCloseButtons();
    this._initProfileModalFeatures();
  }

  // STAGE 2 & 3 — Measurable Loading Sequence & Session Validation Check
  _runLoadingSequence() {
    this.showScreen('loading');
    if (this.btnLoadingRetry) this.btnLoadingRetry.classList.add('hidden');

    const updateStep = (pct, statusText) => {
      if (this.loadingFill) this.loadingFill.style.width = `${pct}%`;
      if (this.loadingPct) this.loadingPct.textContent = `${pct}%`;
      if (this.loadingStatus) this.loadingStatus.textContent = statusText;
    };

    updateStep(15, 'Initializing RAzy Core Systems…');

    setTimeout(() => {
      updateStep(45, 'Checking authentication & session…');
      setTimeout(() => {
        updateStep(80, 'Synchronizing game engine & landscape mode…');
        setTimeout(() => {
          updateStep(100, 'Preparing lobby…');
          setTimeout(() => {
            // STAGE 3 — Authentication Check
            if (this.playerProfile && this.playerProfile.isLoggedIn && this.playerProfile.username) {
              this.showScreen('lobby');
              this.showToast(`Welcome back, ${this.playerProfile.username}!`, '🎮');
            } else {
              this.showScreen('auth');
            }
          }, 350);
        }, 400);
      }, 400);
    }, 400);
  }

  // Toast Notification System
  showToast(message, icon = '✓') {
    const container = this.toastContainer || document.getElementById('razy-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'razy-toast-bubble';
    toast.innerHTML = `<span style="font-size:16px;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 320);
    }, 3200);
  }

  showScreen(screenName) {
    this.currentScreen = screenName;

    const screens = {
      splash: this.elSplash,
      loading: this.elLoading,
      auth: this.elAuth,
      profileCreate: this.elProfileCreate,
      landing: this.elLanding,
      lobby: this.elLobby,
    };

    Object.entries(screens).forEach(([name, el]) => {
      if (!el) return;
      if (name === screenName) {
        el.classList.remove('hidden');
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else {
        el.classList.add('hidden');
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
    });

    if (screenName === 'game') {
      const titleModal = document.getElementById('title-modal');
      if (titleModal) titleModal.classList.add('hidden');
      if (this.elHudRoot) this.elHudRoot.classList.remove('hidden');
    } else {
      const titleModal = document.getElementById('title-modal');
      if (titleModal) titleModal.classList.add('hidden');
    }

    if (this.engine) {
      if (screenName === 'splash' || screenName === 'loading' || screenName === 'auth' || screenName === 'profileCreate') {
        this.engine.manualCameraOverride = 'INTRO_PAN';
      } else if (screenName === 'game') {
        this.engine.manualCameraOverride = null;
      }
    }

    if (screenName === 'lobby') {
      this.updateCommandTopBar();
    }
  }

  // Update Top Command Bar with live currency, rank, level, and player details
  updateCommandTopBar() {
    const res = this.storyManager.resources;
    const rankInfo = this.storyManager.getRank();

    // Name & Titles
    if (this.profileNameDisplay) this.profileNameDisplay.textContent = this.playerProfile.name || 'Ammaar';
    if (this.profileLvlDisplay) this.profileLvlDisplay.textContent = `LV.${res.playerLevel}`;
    if (this.profileVipTag) this.profileVipTag.textContent = `VIP ${res.vipLevel}`;
    if (this.profileCombatPower) this.profileCombatPower.textContent = res.combatPower.toLocaleString();

    // EXP Bar
    const expPercent = Math.min(100, Math.floor((res.playerEXP / res.maxEXP) * 100));
    if (this.profileExpBar) this.profileExpBar.style.width = `${expPercent}%`;
    if (this.profileExpDigits) this.profileExpDigits.textContent = `${expPercent}%`;

    // Currencies
    if (this.goldCountDisplay) this.goldCountDisplay.textContent = res.coins.toLocaleString();
    if (this.gemsCountDisplay) this.gemsCountDisplay.textContent = res.gems.toLocaleString();
    if (this.energyCountDisplay) this.energyCountDisplay.textContent = `${res.energy}/${res.maxEnergy}`;

    // Rank Pill
    if (this.rankBadgeIcon) this.rankBadgeIcon.textContent = rankInfo.badge;
    if (this.rankNameDisplay) {
      this.rankNameDisplay.textContent = rankInfo.name;
      this.rankNameDisplay.style.color = rankInfo.color;
    }
    if (this.rankRpDisplay) this.rankRpDisplay.textContent = `${res.rankPoints} RP`;

    // Avatars
    const avatar = this.playerProfile.avatarId || 'player1';
    if (this.profileBadgeCanvas) renderMiiAvatar(this.profileBadgeCanvas, avatar);
    if (this.termAvatarCanvas) renderMiiAvatar(this.termAvatarCanvas, avatar);
    if (this.termOperatorName) this.termOperatorName.textContent = this.playerProfile.name || 'Ammaar';
    if (this.termOperatorTitle) this.termOperatorTitle.textContent = this.playerProfile.title || 'Thunder Ace';

    // In-match court plates
    renderMiiAvatar('plate-mii-player', avatar);
    renderMiiAvatar('mii-icon-player', avatar);
    const plateName = document.querySelector('.plate-name');
    if (plateName) plateName.textContent = this.playerProfile.name || 'Ammaar';
    const plateSkill = document.querySelector('.plate-skill');
    if (plateSkill) plateSkill.textContent = `${rankInfo.badge} ${rankInfo.name} • ${res.rankPoints} RP`;
  }

  // Open any holographic cyber modal
  openCyberModal(modalEl) {
    if (!modalEl) return;
    if (this.cmdDeckStage) {
      this.cmdDeckStage.classList.add('deck-modal-open');
    }
    modalEl.classList.remove('hidden');
    modalEl.style.opacity = '1';
    modalEl.style.pointerEvents = 'auto';

    // Refresh contents if specific modal
    if (modalEl === this.modalLevels) {
      this._renderLevelsBrowser();
    } else if (modalEl === this.modalStory) {
      this._renderStoryBrowser();
    } else if (modalEl === this.modalRanked) {
      this._renderRankedModal();
    } else if (modalEl === this.modalProfile) {
      this._refreshProfileModal();
    } else if (modalEl === this.modalQuests) {
      this._renderQuestsModal();
    } else if (modalEl === this.modalMailbox) {
      this._renderMailboxModal();
    } else if (modalEl === this.modalCheckin) {
      this._renderCheckinModal();
    } else if (modalEl === this.modalHistory) {
      this._renderMatchHistoryModal();
    }
  }

  closeCyberModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.style.opacity = '0';
    modalEl.style.pointerEvents = 'none';

    // Remove deck-modal-open if all cyber modals are closed
    setTimeout(() => {
      const openModals = document.querySelectorAll('.cyber-modal-backdrop:not(.hidden)');
      if (openModals.length === 0 && this.cmdDeckStage) {
        this.cmdDeckStage.classList.remove('deck-modal-open');
      }
    }, 40);
  }

  _initModalCloseButtons() {
    document.querySelectorAll('.cyber-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        if (modalId) {
          const m = document.getElementById(modalId);
          this.closeCyberModal(m);
        }
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.cyber-modal-backdrop').forEach(bd => {
      bd.addEventListener('click', (e) => {
        if (e.target === bd) {
          this.closeCyberModal(bd);
        }
      });
    });
  }

  // =========================================================================
  // 1. 100+ LEVELS BROWSER (10 Worlds x 12 Stages = 120 Stages)
  // =========================================================================
  _renderLevelsBrowser() {
    const strip = document.getElementById('world-tabs-strip');
    const grid = document.getElementById('world-stages-grid');
    const starCount = document.getElementById('levels-modal-star-count');

    // Total stars
    let totalStars = 0;
    Object.values(this.storyManager.levelStars).forEach(s => totalStars += (s || 0));
    if (starCount) starCount.textContent = `Total Stars: ⭐ ${totalStars} / ${TOURNAMENT_LEVELS.length * 3}`;

    // Render 10 World Circuit Tabs
    if (strip) {
      strip.innerHTML = '';
      TOURNAMENT_WORLDS.forEach(world => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `world-tab-btn ${world.id === this.selectedWorldId ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="w-icon">${world.icon}</span>
          <span class="w-title">W${world.id}: ${world.name.split(':')[1]?.trim() || world.name}</span>
          <small class="w-stages">Lv ${world.levelsRange[0]}-${world.levelsRange[1]}</small>
        `;
        btn.addEventListener('click', () => {
          this.selectedWorldId = world.id;
          this._renderLevelsBrowser();
        });
        strip.appendChild(btn);
      });
    }

    // Render 12 Level Cards for the selected World
    if (grid) {
      grid.innerHTML = '';
      const world = TOURNAMENT_WORLDS.find(w => w.id === this.selectedWorldId) || TOURNAMENT_WORLDS[0];
      const stages = TOURNAMENT_LEVELS.filter(l => l.worldId === world.id);

      stages.forEach(lvl => {
        const isUnlocked = lvl.id <= this.storyManager.unlockedLevel;
        const starsEarned = this.storyManager.levelStars[lvl.id] || 0;

        const card = document.createElement('div');
        card.className = `stage-card-item ${isUnlocked ? 'unlocked' : 'locked'} ${lvl.format === '1v2' ? 'handicap' : ''} ${lvl.id % 12 === 0 ? 'boss-card' : ''}`;

        let starIcons = '';
        for (let s = 1; s <= 3; s++) {
          starIcons += s <= starsEarned ? '<span class="s-on">⭐</span>' : '<span class="s-off">☆</span>';
        }

        card.innerHTML = `
          <div class="sc-header">
            <span class="sc-num">STAGE ${lvl.levelNum}</span>
            <span class="sc-format">${lvl.format.toUpperCase()}</span>
            <span class="sc-stars">${starIcons}</span>
          </div>
          <div class="sc-main">
            <h4 class="sc-title">${lvl.title.replace(/^Level \d+:\s*/, '')}</h4>
            <div class="sc-court">${lvl.courtName}</div>
            <div class="sc-opp">VS ${lvl.opponentName}</div>
            <div class="sc-rewards">🪙 +${lvl.rewardCoins} • ⚡ +${lvl.rewardRP} RP</div>
          </div>
          <div class="sc-lock ${isUnlocked ? 'hidden' : ''}">
            <span>🔒 Locked (Clear Lv ${lvl.levelNum - 1})</span>
          </div>
          <div class="sc-action">
            <button type="button" class="sc-play-btn" ${isUnlocked ? '' : 'disabled'}>
              ${isUnlocked ? (starsEarned > 0 ? 'REPLAY ➔' : 'PLAY ➔') : 'LOCKED'}
            </button>
          </div>
        `;

        if (isUnlocked) {
          const trigger = () => {
            this.closeCyberModal(this.modalLevels);
            this.storyManager.playTournamentLevel(lvl.id);
          };
          card.addEventListener('click', trigger);
          const playBtn = card.querySelector('.sc-play-btn');
          if (playBtn) playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            trigger();
          });
        }

        grid.appendChild(card);
      });
    }
  }

  // =========================================================================
  // 2. STORY MODE BROWSER
  // =========================================================================
  _renderStoryBrowser() {
    const acc = document.getElementById('story-chapters-accordion');
    if (!acc) return;
    acc.innerHTML = '';

    STORY_CHAPTERS.forEach(ch => {
      const isUnlocked = ch.id <= this.storyManager.unlockedChapter;
      const isSelected = ch.id === this.selectedChapterId;

      const row = document.createElement('div');
      row.className = `story-ch-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'active' : ''}`;
      row.innerHTML = `
        <div class="ch-badge-col">
          <span class="ch-num">${isUnlocked ? `CH.${ch.id}` : '🔒'}</span>
        </div>
        <div class="ch-details-col">
          <div class="ch-top">
            <h4 class="ch-name">${ch.title}</h4>
            <span class="ch-fmt">${ch.format.toUpperCase()} • ${ch.location}</span>
          </div>
          <p class="ch-obj">🎯 ${ch.objective}</p>
          <div class="ch-rival">Rival: <strong>${ch.rival.name}</strong> (${ch.rival.title})</div>
        </div>
        <div class="ch-action-col">
          <button type="button" class="ch-play-btn" ${isUnlocked ? '' : 'disabled'}>
            ${isUnlocked ? 'Play Chapter ➔' : 'Locked'}
          </button>
        </div>
      `;

      if (isUnlocked) {
        row.querySelector('.ch-play-btn')?.addEventListener('click', () => {
          this.closeCyberModal(this.modalStory);
          this.storyManager.playStoryChapter(ch.id);
        });
      }

      acc.appendChild(row);
    });
  }

  // =========================================================================
  // 3. RANKED SYSTEM & LEADERBOARDS
  // =========================================================================
  _renderRankedModal() {
    const list = document.getElementById('rank-tiers-list');
    const lb = document.getElementById('rank-leaderboard-list');

    if (list) {
      list.innerHTML = '';
      const playerRP = this.storyManager.resources.rankPoints;

      RANK_TIERS.forEach(tier => {
        const isCurrent = playerRP >= tier.minRP && playerRP <= tier.maxRP;
        const item = document.createElement('div');
        item.className = `rank-tier-row ${isCurrent ? 'current-tier' : ''}`;
        item.innerHTML = `
          <span class="tier-icon" style="color: ${tier.color}">${tier.badge}</span>
          <div class="tier-name-col">
            <span class="tier-label" style="color: ${tier.color}">${tier.name}</span>
            <span class="tier-range">${tier.minRP} - ${tier.maxRP >= 99999 ? '∞' : tier.maxRP} RP</span>
          </div>
          <span class="tier-status">${isCurrent ? '★ YOUR RANK' : ''}</span>
        `;
        list.appendChild(item);
      });
    }

    if (lb) {
      lb.innerHTML = '';
      const topPlayers = [
        { rank: 1, name: "Overlord Titan", tier: "RAzy Grand Champion", badge: "⚡", rp: 4120, winRate: "98%" },
        { rank: 2, name: "Ryu Dragon", tier: "Master", badge: "👑", rp: 3380, winRate: "93%" },
        { rank: 3, name: "Akira Cyber", tier: "Master", badge: "👑", rp: 3150, winRate: "91%" },
        { rank: 4, name: "Kenji Flash", tier: "Diamond I", badge: "💠", rp: 2940, winRate: "89%" },
        { rank: 5, name: this.playerProfile.name || "Ammaar (You)", tier: this.storyManager.getRank().name, badge: this.storyManager.getRank().badge, rp: this.storyManager.resources.rankPoints, winRate: "87.5%", isSelf: true },
        { rank: 6, name: "Matt Titan", tier: "Diamond II", badge: "💠", rp: 2710, winRate: "85%" },
        { rank: 7, name: "Elisa Ice", tier: "Platinum I", badge: "💎", rp: 2420, winRate: "82%" },
        { rank: 8, name: "Maya Coast", tier: "Gold I", badge: "🥇", rp: 1890, winRate: "79%" },
      ];

      topPlayers.forEach(p => {
        const row = document.createElement('div');
        row.className = `lb-player-row ${p.isSelf ? 'self-player' : ''}`;
        row.innerHTML = `
          <span class="lb-pos">#${p.rank}</span>
          <span class="lb-badge">${p.badge}</span>
          <div class="lb-names">
            <strong class="lb-p-name">${p.name}</strong>
            <small class="lb-p-tier">${p.tier}</small>
          </div>
          <span class="lb-rp">${p.rp} RP</span>
          <span class="lb-win">${p.winRate}</span>
        `;
        lb.appendChild(row);
      });
    }
  }

  // =========================================================================
  // 4. USER PROFILE MODAL
  // =========================================================================
  _refreshProfileModal() {
    const avatar = this.playerProfile.avatarId || 'player1';
    renderMiiAvatar('prof-modal-avatar', avatar);

    const inputName = document.getElementById('input-prof-edit-name');
    if (inputName) inputName.value = this.playerProfile.name || 'Ammaar';

    const selTitle = document.getElementById('select-prof-title');
    if (selTitle) selTitle.value = this.playerProfile.title || 'Thunder Ace';

    const rankInfo = this.storyManager.getRank();
    const rankStamp = document.getElementById('prof-modal-rank-stamp');
    if (rankStamp) {
      rankStamp.textContent = `${rankInfo.badge} ${rankInfo.name.toUpperCase()}`;
      rankStamp.style.color = rankInfo.color;
    }

    const cardMedal = document.getElementById('prof-card-medal');
    if (cardMedal) cardMedal.textContent = rankInfo.badge;

    const cardTier = document.getElementById('prof-card-tier');
    if (cardTier) cardTier.textContent = rankInfo.name;

    const cardRp = document.getElementById('prof-card-rp');
    if (cardRp) cardRp.textContent = `${this.storyManager.resources.rankPoints} Rank Points`;

    const cardNext = document.getElementById('prof-card-next');
    if (cardNext) cardNext.textContent = `Next: ${rankInfo.nextRank.name} in ${rankInfo.rpToNext} RP`;

    const cardProgress = document.getElementById('prof-card-progress');
    if (cardProgress) cardProgress.style.width = `${rankInfo.progressPercent}%`;

    // Stats
    const statMatches = document.getElementById('prof-stat-matches');
    if (statMatches) statMatches.textContent = String(this.playerProfile.matchesPlayed || 48);

    const statStars = document.getElementById('prof-stat-stars');
    let totalStars = 0;
    Object.values(this.storyManager.levelStars).forEach(s => totalStars += (s || 0));
    if (statStars) statStars.textContent = `⭐ ${totalStars} / ${TOURNAMENT_LEVELS.length * 3}`;

    const statWorld = document.getElementById('prof-stat-world');
    const currentWorld = Math.min(10, Math.ceil(this.storyManager.unlockedLevel / 12));
    if (statWorld) statWorld.textContent = `World ${currentWorld} (Lv ${this.storyManager.unlockedLevel})`;

    // Permanent Authoritative UID & Creation Date
    const elProfUid = document.getElementById('prof-player-uid');
    if (elProfUid) elProfUid.textContent = this.playerProfile.uid || 'RAZ-7F3A91C2';

    const elProfDate = document.getElementById('prof-creation-date');
    if (elProfDate) elProfDate.textContent = `Registered: ${this.playerProfile.createdAt || 'Oct 2026'}`;

    // Mini avatar options
    renderMiiAvatar('mini-av-1', 'player1');
    renderMiiAvatar('mini-av-2', 'player2');
    renderMiiAvatar('mini-av-3', 'opponent1');
    renderMiiAvatar('mini-av-4', 'opponent2');

    // Render Mii Court Personality Selector
    this._renderPersonalitySelector();
  }

  _renderPersonalitySelector() {
    const grid = document.getElementById('personality-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentPId = this.playerProfile.personality || 'aggressive';
    const currentP = MII_PERSONALITIES[currentPId] || MII_PERSONALITIES.aggressive;

    const elTag = document.getElementById('prof-active-personality-tag');
    if (elTag) {
      elTag.textContent = `${currentP.icon} ${currentP.name.toUpperCase()} BUFF ACTIVE`;
      elTag.style.color = currentP.color;
      elTag.style.borderColor = currentP.color;
      elTag.style.background = currentP.badgeBg;
    }

    const elBadge = document.getElementById('prof-personality-badge');
    if (elBadge) {
      elBadge.textContent = `${currentP.icon} ${currentP.name}: ${currentP.headline.split('•')[0].trim()}`;
      elBadge.style.color = currentP.color;
      elBadge.style.borderColor = currentP.color;
    }

    const termPill = document.getElementById('terminal-personality-pill');
    if (termPill) {
      termPill.textContent = `${currentP.icon} ${currentP.name}: ${currentP.headline.split('•')[0].trim()}`;
      termPill.style.color = currentP.color;
      termPill.style.borderColor = currentP.color;
    }

    Object.values(MII_PERSONALITIES).forEach(p => {
      const isSelected = p.id === currentPId;
      const card = document.createElement('div');
      card.className = `personality-card-choice ${isSelected ? 'active' : ''}`;
      card.innerHTML = `
        <div class="pc-top">
          <span class="pc-name" style="color:${isSelected ? p.color : '#fff'}">
            <span>${p.icon}</span> <span>${p.name}</span>
          </span>
          <span class="pc-tag">${isSelected ? 'ACTIVE ✓' : 'SELECT'}</span>
        </div>
        <div class="pc-buff" style="color:${p.color}">${p.headline}</div>
        <div class="pc-desc">${p.description}</div>
      `;

      card.addEventListener('click', () => {
        this.playerProfile.personality = p.id;
        this._saveProfile();
        if (this.engine) {
          this.engine.playerPersonality = p.id;
          if (this.engine.matchConfig) {
            const personality = this.storyManager.getPersonality(p.id);
            this.engine.activePersonality = personality;
            if (this.engine.player) {
              const baseSpeed = this.engine.matchConfig.difficulty === 'legend' ? 10.4 : (this.engine.matchConfig.difficulty === 'pro' ? 9.8 : 10.2);
              this.engine.player.maxSpeed = baseSpeed * (personality.buffs.moveSpeedMult || 1.0);
            }
          }
        }
        this._renderPersonalitySelector();
      });

      grid.appendChild(card);
    });
  }

  _initProfileModalFeatures() {
    const btnSaveName = document.getElementById('btn-prof-save-name');
    const inputName = document.getElementById('input-prof-edit-name');
    if (btnSaveName && inputName) {
      btnSaveName.addEventListener('click', () => {
        const val = inputName.value.trim();
        if (val) {
          this.playerProfile.name = val;
          this._saveProfile();
          btnSaveName.textContent = '✓ Saved';
          setTimeout(() => btnSaveName.textContent = 'Save', 1500);
        }
      });
    }

    const selTitle = document.getElementById('select-prof-title');
    if (selTitle) {
      selTitle.addEventListener('change', () => {
        this.playerProfile.title = selTitle.value;
        this.storyManager.resources.title = selTitle.value;
        this.storyManager.saveResources();
        this._saveProfile();
      });
    }

    document.querySelectorAll('.mini-av-choice').forEach(choice => {
      choice.addEventListener('click', () => {
        document.querySelectorAll('.mini-av-choice').forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        const avId = choice.getAttribute('data-av') || 'player1';
        this.playerProfile.avatarId = avId;
        this._saveProfile();
        renderMiiAvatar('prof-modal-avatar', avId);
      });
    });

    // Profile Card Copy UID Button
    const btnProfCopyUid = document.getElementById('btn-prof-copy-uid');
    if (btnProfCopyUid) {
      btnProfCopyUid.addEventListener('click', () => {
        const uid = this.playerProfile.uid || 'RAZ-7F3A91C2';
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(uid).catch(() => {});
        }
        btnProfCopyUid.textContent = '✓ Copied!';
        this.showToast(`Player UID Copied: ${uid}`, '📋');
        setTimeout(() => {
          if (btnProfCopyUid) btnProfCopyUid.textContent = '📋 Copy UID';
        }, 1500);
      });
    }

    // Profile Card Action Buttons
    const btnChangeAv = document.getElementById('btn-prof-change-avatar');
    if (btnChangeAv) {
      btnChangeAv.addEventListener('click', () => {
        this.closeCyberModal(this.modalProfile);
        this.openCyberModal(this.modalWardrobe);
      });
    }

    const btnHistory = document.getElementById('btn-prof-match-history');
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        this.closeCyberModal(this.modalProfile);
        this.openCyberModal(this.modalHistory);
      });
    }

    const btnSettings = document.getElementById('btn-prof-open-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        this.closeCyberModal(this.modalProfile);
        this.openCyberModal(this.modalSettings);
      });
    }

    const btnLogout = document.getElementById('btn-prof-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        this.playerProfile.isLoggedIn = false;
        this._saveProfile();
        this.closeCyberModal(this.modalProfile);
        this.showToast('Signed out', 'ℹ️');
        this.showScreen('auth');
      });
    }

    // Quests filter tabs
    document.querySelectorAll('.q-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        this._renderQuestsModal(filter);
      });
    });
  }

  // =========================================================================
  // 5. QUESTS & MAILBOX & CHECK-IN
  // =========================================================================
  _renderQuestsModal(filter = 'all') {
    this.activeQuestFilter = filter;
    const container = document.getElementById('quests-list-container');
    if (!container) return;
    container.innerHTML = '';

    const quests = this.storyManager ? this.storyManager.quests : this.quests;

    // Calculate Overall Tactical Completion Percentage
    let totalTarget = 0;
    let totalProgress = 0;
    let readyCount = 0;
    quests.forEach(q => {
      totalTarget += q.target;
      totalProgress += Math.min(q.target, q.progress);
      if (q.progress >= q.target && !q.claimed) readyCount++;
    });
    const overallPct = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;
    const elOverall = document.getElementById('quests-overall-pct');
    if (elOverall) elOverall.textContent = `${overallPct}%`;

    // Filter Buttons state
    document.querySelectorAll('.q-filter-btn').forEach(btn => {
      const f = btn.getAttribute('data-filter') || 'all';
      btn.classList.toggle('active', f === filter);
      if (f === 'ready') {
        btn.textContent = readyCount > 0 ? `Ready to Claim (${readyCount})` : 'Ready to Claim';
      }
    });

    const filtered = quests.filter(q => {
      if (filter === 'in_progress') return q.progress < q.target && !q.claimed;
      if (filter === 'ready') return q.progress >= q.target && !q.claimed;
      return true;
    });

    filtered.forEach(q => {
      const isComplete = q.progress >= q.target;
      const isReadyToClaim = isComplete && !q.claimed;
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));

      const row = document.createElement('div');
      row.className = `quest-item-row ${q.claimed ? 'claimed' : ''} ${isReadyToClaim ? 'ready-to-claim' : ''}`;
      row.innerHTML = `
        <div class="q-icon-box">${q.icon || '🎯'}</div>
        <div class="q-info">
          <div class="q-top-line">
            <strong class="q-title">${q.title}</strong>
            <span class="q-pct-badge">${q.claimed ? '100% CLAIMED' : (isComplete ? '100% READY' : `${pct}%`)}</span>
          </div>
          <span class="q-desc">${q.desc}</span>
          <div class="q-track-wrap">
            <div class="q-track">
              <div class="q-fill" style="width: ${pct}%"></div>
            </div>
            <span class="q-count">${q.progress}/${q.target}</span>
          </div>
        </div>
        <div class="q-rewards">
          <span>🪙 +${q.rewardCoins.toLocaleString()}</span>
          <span>⚡ +${q.rewardEXP} EXP</span>
        </div>
        <button type="button" class="q-claim-btn" ${isReadyToClaim ? '' : 'disabled'}>
          ${q.claimed ? 'Claimed ✓' : (isComplete ? 'Claim Gift 🎁' : 'In Progress')}
        </button>
      `;

      const claimBtn = row.querySelector('.q-claim-btn');
      if (claimBtn && isReadyToClaim) {
        claimBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          q.claimed = true;
          this.storyManager.saveQuests();
          this.storyManager.addReward({ coins: q.rewardCoins, exp: q.rewardEXP });
          this._renderQuestsModal(this.activeQuestFilter || 'all');
        });
      }

      container.appendChild(row);
    });
  }

  _renderMailboxModal() {
    const container = document.getElementById('mail-list-container');
    if (!container) return;
    container.innerHTML = '';

    this.mails.forEach(m => {
      const row = document.createElement('div');
      row.className = `mail-item-row ${m.claimed ? 'claimed' : ''}`;
      row.innerHTML = `
        <div class="mail-head">
          <span class="mail-title">${m.title}</span>
          <span class="mail-date">${m.date}</span>
        </div>
        <p class="mail-content">${m.content}</p>
        <div class="mail-gifts">
          ${m.coins ? `<span>🪙 +${m.coins.toLocaleString()}</span>` : ''}
          ${m.gems ? `<span>💎 +${m.gems.toLocaleString()}</span>` : ''}
          ${m.energy ? `<span>⚡ +${m.energy} Energy</span>` : ''}
        </div>
      `;
      container.appendChild(row);
    });

    const btnClaimAll = document.getElementById('btn-claim-all-mail');
    if (btnClaimAll) {
      btnClaimAll.onclick = () => {
        let coins = 0, gems = 0, energy = 0;
        this.mails.forEach(m => {
          if (!m.claimed) {
            coins += m.coins || 0;
            gems += m.gems || 0;
            energy += m.energy || 0;
            m.claimed = true;
          }
        });
        this.storyManager.addReward({ coins, gems, energy });
        btnClaimAll.textContent = 'All Claimed ✓';
        btnClaimAll.disabled = true;
        this._renderMailboxModal();
      };
    }
  }

  _renderCheckinModal() {
    const container = document.getElementById('checkin-grid-container');
    if (!container) return;
    container.innerHTML = '';

    DAILY_CHECKIN.forEach(d => {
      const card = document.createElement('div');
      card.className = `checkin-card ${d.claimed ? 'claimed' : ''} ${d.current ? 'current' : ''}`;
      card.innerHTML = `
        <span class="ck-day">DAY ${d.day}</span>
        <div class="ck-reward">${d.reward}</div>
        <span class="ck-status">${d.claimed ? 'Claimed ✓' : (d.current ? 'CLAIM NOW' : 'Locked')}</span>
      `;

      if (d.current && !d.claimed) {
        card.addEventListener('click', () => {
          d.claimed = true;
          this.storyManager.addReward({ coins: 25000 });
          this._renderCheckinModal();
        });
      }

      container.appendChild(card);
    });
  }

  _renderFriendsList() {
    if (!this.friendsContainer) return;
    this.friendsContainer.innerHTML = '';
    this.friendsList.forEach(friend => {
      const row = document.createElement('div');
      row.className = 'lobby-friend-row';
      const statusClass = friend.status === 'online' ? 'status-online' : friend.status === 'in-match' ? 'status-playing' : 'status-offline';
      const statusLabel = friend.status === 'online' ? 'Online' : friend.status === 'in-match' ? 'In Match' : 'Offline';

      row.innerHTML = `
        <div class="friend-info">
          <div class="friend-avatar-dot ${statusClass}"></div>
          <div class="friend-names">
            <span class="friend-name-text">${friend.name}</span>
            <span class="friend-skill-text">Skill ${friend.skill} • ${statusLabel}</span>
          </div>
        </div>
        <button type="button" class="friend-invite-btn" ${friend.status === 'offline' ? 'disabled' : ''}>
          ${friend.status === 'offline' ? 'Away' : 'Invite'}
        </button>
      `;

      const btnInvite = row.querySelector('.friend-invite-btn');
      if (btnInvite && friend.status !== 'offline') {
        btnInvite.addEventListener('click', () => {
          btnInvite.textContent = '✓ Sent';
          btnInvite.style.background = '#22c55e';
          setTimeout(() => {
            btnInvite.textContent = 'Joined!';
          }, 1000);
        });
      }

      this.friendsContainer.appendChild(row);
    });
  }

  _bindDOMEvents() {
    // 1. Splash & Landing
    if (this.btnSkipSplash) {
      this.btnSkipSplash.addEventListener('click', () => {
        clearTimeout(this.splashTimeout);
        this.showScreen('landing');
      });
    }

    if (this.btnLandingPlay) {
      this.btnLandingPlay.addEventListener('click', () => {
        if (this.engine && this.engine.audioEngine) {
          try {
            if (typeof this.engine.audioEngine.startSoundtrack === 'function') {
              this.engine.audioEngine.startSoundtrack('menu');
            } else if (typeof this.engine.audioEngine.playMusicForState === 'function') {
              this.engine.audioEngine.unlock?.();
              this.engine.audioEngine.playMusicForState('menu');
            }
          } catch (err) {}
        }
        if (this.playerProfile && this.playerProfile.isLoggedIn) {
          this.showScreen('lobby');
        } else {
          this.showScreen('auth');
        }
      });
    }

    if (this.btnLandingSettings) {
      this.btnLandingSettings.addEventListener('click', () => {
        if (this.engine && this.engine.audioEngine) {
          try {
            const isMuted = typeof this.engine.audioEngine.toggleMute === 'function'
              ? this.engine.audioEngine.toggleMute()
              : !this.engine.audioEngine.muted;
            this.btnLandingSettings.textContent = isMuted ? '🔇 Audio: OFF' : '🎵 Audio: ON';
          } catch (err) {}
        }
      });
    }

    // 2. Auth
    this.avatarPickerItems.forEach(item => {
      item.addEventListener('click', () => {
        this.avatarPickerItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.playerProfile.avatarId = item.dataset.avatar || 'player1';
        this._saveProfile();
      });
    });

    // 2. Stage 4 — Authentication (Google & Instant Guest)
    if (this.btnGoogleLogin) {
      this.btnGoogleLogin.addEventListener('click', () => {
        const email = 'playixkid@gmail.com';
        // Check if player already registered with this Google account
        const registered = localStorage.getItem('razy_user_profile');
        if (registered) {
          try {
            const data = JSON.parse(registered);
            if (data.username && data.uid) {
              this.playerProfile.isLoggedIn = true;
              this.playerProfile.isGuest = false;
              this.playerProfile.googleEmail = email;
              this._saveProfile();
              this.showToast(`Logged in as ${this.playerProfile.username}`, '✓');
              this.showScreen('lobby');
              return;
            }
          } catch (e) {}
        }

        // New player Google account -> Proceed to Stage 5 Profile Creation
        this.playerProfile.googleEmail = email;
        if (this.pCreateGoogleEmail) this.pCreateGoogleEmail.textContent = email;
        if (this.pCreateAvatarCanvas) renderMiiAvatar(this.pCreateAvatarCanvas, this.playerProfile.avatarId || 'player1');
        
        // Generate permanent collision-resistant UID for new player
        const newUID = this._generatePermanentUID();
        this.playerProfile.uid = newUID;
        if (this.previewUID) this.previewUID.textContent = newUID;
        
        this.showScreen('profileCreate');
      });
    }

    if (this.btnGuestLogin) {
      this.btnGuestLogin.addEventListener('click', () => {
        const customName = this.inputGuestName && this.inputGuestName.value.trim();
        const randNum = Math.floor(100 + Math.random() * 900);
        const guestName = customName || `GuestAce_${randNum}`;
        this.playerProfile.isLoggedIn = true;
        this.playerProfile.isGuest = true;
        this.playerProfile.username = guestName;
        this.playerProfile.name = guestName;
        this.playerProfile.uid = this.playerProfile.uid || this._generatePermanentUID();
        this._saveProfile();
        this.showToast(`Logged in as ${guestName}`, '⚡');
        this.showScreen('lobby');
      });
    }

    if (this.linkPrivacyPolicy) {
      this.linkPrivacyPolicy.addEventListener('click', () => this.openCyberModal(this.modalPrivacy));
    }
    if (this.linkTermsService) {
      this.linkTermsService.addEventListener('click', () => this.openCyberModal(this.modalTerms));
    }

    // Stage 5 — Profile & Unique Username Creation
    if (this.inputProfileUsername) {
      let debounceTimer = null;
      this.inputProfileUsername.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const raw = this.inputProfileUsername.value.trim();
        
        if (this.badgeUsernameAvailability) {
          this.badgeUsernameAvailability.className = 'availability-badge checking';
          this.badgeUsernameAvailability.querySelector('.status-msg').textContent = 'Checking availability…';
        }

        debounceTimer = setTimeout(() => {
          this._validateUsernameInput(raw);
        }, 220);
      });
    }

    if (this.btnSuggestUsername) {
      this.btnSuggestUsername.addEventListener('click', () => {
        this._generateUsernameSuggestions();
      });
    }

    if (this.btnSubmitCreateProfile) {
      this.btnSubmitCreateProfile.addEventListener('click', () => {
        const uname = this.inputProfileUsername ? this.inputProfileUsername.value.trim() : '';
        if (!uname || uname.length < 3) return;

        this.playerProfile.username = uname;
        this.playerProfile.name = uname;
        this.playerProfile.isLoggedIn = true;
        this.playerProfile.isGuest = false;
        this.playerProfile.createdAt = new Date().toISOString().split('T')[0];
        this._registerUsername(uname);
        this._saveProfile();

        this.showToast(`Account created! Welcome, ${uname}!`, '🎮');
        this.showScreen('lobby');
      });
    }

    // Left Navigation 10-Item Panel
    if (this.navTabBtns) {
      this.navTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.navTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const navId = btn.getAttribute('data-nav');
          this._handleLeftNavClick(navId);
        });
      });
    }

    // Top Right Utility Buttons
    if (this.btnTopFriends) this.btnTopFriends.addEventListener('click', () => this.openCyberModal(this.modalTeam));
    if (this.btnTopMessages) this.btnTopMessages.addEventListener('click', () => this.openCyberModal(this.modalMailbox));
    if (this.btnTopNotifications) this.btnTopNotifications.addEventListener('click', () => this.openCyberModal(this.modalNotifications));
    if (this.btnTopSettings) this.btnTopSettings.addEventListener('click', () => this.openCyberModal(this.modalSettings));

    // Bottom Action Bar: Chat Pill
    if (this.lobbyChatPill) {
      this.lobbyChatPill.addEventListener('click', () => this.openCyberModal(this.modalChat));
    }

    // Bottom Action Bar: Match Mode Pills (SOLO, DUO, SQUAD)
    if (this.lobbyModePills) {
      this.lobbyModePills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.lobbyModePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const mode = pill.getAttribute('data-mode');
          if (mode === 'solo') this.matchSettings.format = '1v1';
          else if (mode === 'duo') this.matchSettings.format = '2v2';
          else if (mode === 'squad') this.matchSettings.format = 'tournament';
          this.showToast(`Mode set to ${mode.toUpperCase()}`, '🎯');
        });
      });
    }

    // Bottom Action Bar: Game Library Selector
    if (this.btnOpenGameLibrary) {
      this.btnOpenGameLibrary.addEventListener('click', () => this.openCyberModal(this.modalGameLibrary));
    }

    // Game Library cards selection
    document.querySelectorAll('.game-card-item').forEach(card => {
      const gId = card.getAttribute('data-game');
      const btnSel = card.querySelector('.game-select-btn');
      const btnPlay = card.querySelector('.game-play-direct-btn');

      if (btnSel) {
        btnSel.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.game-card-item').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const title = card.querySelector('.game-title')?.textContent || 'Flagship Tennis 3D';
          if (this.activeGameTitle) this.activeGameTitle.textContent = title;
          this.closeCyberModal(this.modalGameLibrary);
          this.showToast(`Selected: ${title}`, '🎮');
        });
      }

      if (btnPlay) {
        btnPlay.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeCyberModal(this.modalGameLibrary);
          this._startMatchPrepSequence();
        });
      }
    });

    // Primary START Button -> Trigger Match Preparation Overlay
    if (this.btnLobbyStartMatch) {
      this.btnLobbyStartMatch.addEventListener('click', () => {
        this._startMatchPrepSequence();
      });
    }

    // Match Prep Modal Actions
    if (this.btnPrepCancel) {
      this.btnPrepCancel.addEventListener('click', () => {
        if (this._prepTimer) clearInterval(this._prepTimer);
        this.closeCyberModal(this.modalMatchPrep);
        this.showToast('Matchmaking cancelled', 'ℹ️');
      });
    }

    if (this.btnPrepLaunchNow) {
      this.btnPrepLaunchNow.addEventListener('click', () => {
        this._launchFlagshipMatch();
      });
    }

    // Settings Modal Tabs & Controls
    this._initUniversalSettingsBindings();

    // 3. Command Bar Modals Triggers
    if (this.cmdProfilePill) {
      this.cmdProfilePill.addEventListener('click', () => this.openCyberModal(this.modalProfile));
    }
    if (this.cmdRankPill) {
      this.cmdRankPill.addEventListener('click', () => this.openCyberModal(this.modalRanked));
    }

    // 4. Left Floating Modules
    if (this.btnHexMail) {
      this.btnHexMail.addEventListener('click', () => this.openCyberModal(this.modalMailbox));
    }
    if (this.btnHexQuests) {
      this.btnHexQuests.addEventListener('click', () => this.openCyberModal(this.modalQuests));
    }
    if (this.btnHexCheckin) {
      this.btnHexCheckin.addEventListener('click', () => this.openCyberModal(this.modalCheckin));
    }
    if (this.btnShopBillboard) {
      this.btnShopBillboard.addEventListener('click', () => this.openCyberModal(this.modalShop));
    }

    // 5. Center Tactical Pedestals (Mode Selection)
    const pedestals = [
      { el: this.pedestalLevels, mode: 'levels', modal: this.modalLevels },
      { el: this.pedestalStory, mode: 'story', modal: this.modalStory },
      { el: this.pedestalRanked, mode: 'ranked', modal: this.modalRanked },
      { el: this.pedestalDoubles, mode: 'doubles', modal: this.modalTeam },
    ];

    pedestals.forEach(p => {
      if (!p.el) return;
      p.el.addEventListener('click', () => {
        pedestals.forEach(x => x.el?.classList.remove('active'));
        p.el.classList.add('active');
        this.selectedMode = p.mode;
        this.openCyberModal(p.modal);
      });
    });

    // 6. Big Radiant Battle Button
    if (this.btnMainBattle) {
      this.btnMainBattle.addEventListener('click', () => {
        // Immediate play depending on mode
        if (this.selectedMode === 'levels') {
          this.storyManager.playTournamentLevel(this.storyManager.unlockedLevel);
        } else if (this.selectedMode === 'story') {
          this.storyManager.playStoryChapter(this.selectedChapterId);
        } else if (this.selectedMode === 'ranked') {
          // Ranked Match
          this._startRankedMatch();
        } else {
          // Doubles
          this._startDoublesMatch();
        }
      });
    }

    if (this.btnTermFriends) this.btnTermFriends.addEventListener('click', () => this.openCyberModal(this.modalTeam));
    if (this.btnTermBag) this.btnTermBag.addEventListener('click', () => this.openCyberModal(this.modalShop));
    if (this.btnTermRanks) this.btnTermRanks.addEventListener('click', () => this.openCyberModal(this.modalRanked));
    if (this.btnTermChat) this.btnTermChat.addEventListener('click', () => this.openCyberModal(this.modalTeam));
    if (this.btnTermHistory) this.btnTermHistory.addEventListener('click', () => this.openCyberModal(this.modalHistory));

    // Floating 1-Click Instant Match with default Casual AI
    if (this.btnLobbyQuickCasual) {
      this.btnLobbyQuickCasual.addEventListener('click', () => this.startQuickCasualMatch());
    }

    // 15s Cinematic Instant Replay Button in Terminal
    if (this.btnTermReplay) {
      this.btnTermReplay.addEventListener('click', () => this.openCinematicReplay());
    }

    if (this.btnCloseCinematicReplay) {
      this.btnCloseCinematicReplay.addEventListener('click', () => this.closeCinematicReplay());
    }

    if (this.btnReplayPlayPause) {
      this.btnReplayPlayPause.addEventListener('click', () => this.toggleReplayPlayPause());
    }

    if (this.btnReplayRestart) {
      this.btnReplayRestart.addEventListener('click', () => this.restartCinematicReplay());
    }

    if (this.replayScrubSlider) {
      this.replayScrubSlider.addEventListener('input', (e) => {
        this.scrubCinematicReplay(parseFloat(e.target.value));
      });
    }

    this.replaySpeedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const spd = parseFloat(btn.dataset.speed || '1.0');
        this.setReplaySpeed(spd);
      });
    });

    this.replayCamBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cam = btn.dataset.cam || 'orbit';
        this.setReplayCam(cam);
      });
    });

    // 8. Victory modal Next Level button
    if (this.btnVictoryNextLevel) {
      this.btnVictoryNextLevel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.hud && typeof this.hud.hideVictoryModal === 'function') {
          this.hud.hideVictoryModal();
        }

        if (this.storyManager.activeTournamentLevel) {
          const nextLvl = this.storyManager.activeTournamentLevel.id + 1;
          if (nextLvl <= TOURNAMENT_LEVELS.length) {
            this.storyManager.playTournamentLevel(nextLvl);
          } else {
            this.showScreen('lobby');
            this.openCyberModal(this.modalLevels);
          }
        } else if (this.storyManager.activeStoryChapter) {
          const nextCh = this.storyManager.activeStoryChapter.id + 1;
          if (nextCh <= STORY_CHAPTERS.length) {
            this.selectedChapterId = nextCh;
            this.storyManager.playStoryChapter(nextCh);
          } else {
            this.showScreen('lobby');
            this.openCyberModal(this.modalStory);
          }
        } else {
          this.showScreen('lobby');
        }
      });
    }

    // In-game Return to Lobby Button
    const btnLobbyReturn = document.getElementById('btn-return-lobby');
    if (btnLobbyReturn) {
      btnLobbyReturn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showScreen('lobby');
      });
    }

    // Team code copy & join
    if (this.btnNewCode) {
      this.btnNewCode.addEventListener('click', () => {
        this.matchSettings.teamCode = this._generateTeamCode();
        if (this.txtTeamCode) this.txtTeamCode.textContent = this.matchSettings.teamCode;
      });
    }

    if (this.btnCopyCode) {
      this.btnCopyCode.addEventListener('click', () => {
        navigator.clipboard?.writeText(this.matchSettings.teamCode);
        this.btnCopyCode.textContent = '✓ Copied!';
        setTimeout(() => {
          if (this.btnCopyCode) this.btnCopyCode.textContent = '📋 Copy';
        }, 1500);
      });
    }

    if (this.btnJoinTeam) {
      this.btnJoinTeam.addEventListener('click', () => {
        const code = this.inputJoinCode ? this.inputJoinCode.value.trim().toUpperCase() : '';
        if (code) {
          this.matchSettings.teamCode = code;
          if (this.txtTeamCode) this.txtTeamCode.textContent = code;
          alert(`Joined Team: ${code}! Ready for 2v2 Match.`);
        }
      });
    }

    // Force landscape lock button
    const btnForceLandscape = document.getElementById('btn-force-landscape');
    if (btnForceLandscape) {
      btnForceLandscape.addEventListener('click', () => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        if (window.screen?.orientation?.lock) window.screen.orientation.lock('landscape').catch(() => {});
      });
    }
  }

  // =========================================================================
  // RAzy CORE HELPERS: USERNAME VALIDATION, SUGGESTIONS & MATCH PREPARATION
  // =========================================================================
  _validateUsernameInput(raw) {
    if (!this.badgeUsernameAvailability) return;
    const badge = this.badgeUsernameAvailability;
    const msg = badge.querySelector('.status-msg');
    const btn = this.btnSubmitCreateProfile;

    if (!raw) {
      badge.className = 'availability-badge idle';
      if (msg) msg.textContent = 'Enter username (3–16 chars)';
      if (btn) btn.disabled = true;
      return;
    }

    if (raw.length < 3) {
      badge.className = 'availability-badge taken';
      if (msg) msg.textContent = 'Minimum 3 characters';
      if (btn) btn.disabled = true;
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(raw)) {
      badge.className = 'availability-badge taken';
      if (msg) msg.textContent = 'Only letters, numbers & _';
      if (btn) btn.disabled = true;
      return;
    }

    const reserved = ['admin', 'root', 'razy', 'system', 'moderator', 'support', 'null', 'undefined'];
    if (reserved.includes(raw.toLowerCase())) {
      badge.className = 'availability-badge taken';
      if (msg) msg.textContent = '✕ Reserved username';
      if (btn) btn.disabled = true;
      return;
    }

    const existing = this._getRegisteredUsernames();
    if (existing.includes(raw.toLowerCase())) {
      badge.className = 'availability-badge taken';
      if (msg) msg.textContent = '✕ Username already taken';
      if (btn) btn.disabled = true;
      return;
    }

    badge.className = 'availability-badge available';
    if (msg) msg.textContent = '✓ Available!';
    if (btn) btn.disabled = false;
  }

  _generateUsernameSuggestions() {
    const prefixes = ['Shadow', 'Cyber', 'Neon', 'Vortex', 'Titan', 'Apex', 'Hyper', 'Nova', 'Storm', 'Phantom'];
    const suffixes = ['Ace', 'Striker', 'Blade', 'Master', 'Champion', 'Hero', 'Ghost', 'Knight', 'Rider', 'Pulse'];
    const suggestions = [];

    for (let i = 0; i < 4; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const n = Math.floor(10 + Math.random() * 89);
      suggestions.push(`${p}${s}_${n}`);
    }

    if (this.boxSuggestions) {
      this.boxSuggestions.innerHTML = '';
      this.boxSuggestions.classList.remove('hidden');
      suggestions.forEach(name => {
        const chip = document.createElement('span');
        chip.className = 'suggestion-chip';
        chip.textContent = `@${name}`;
        chip.addEventListener('click', () => {
          if (this.inputProfileUsername) {
            this.inputProfileUsername.value = name;
            this._validateUsernameInput(name);
          }
        });
        this.boxSuggestions.appendChild(chip);
      });
    }
  }

  _handleLeftNavClick(navId) {
    // Close other modals first
    document.querySelectorAll('.cyber-modal-backdrop').forEach(m => this.closeCyberModal(m));

    switch (navId) {
      case 'home':
        // Return to main lobby view
        break;
      case 'character':
        this.openCyberModal(this.modalWardrobe);
        break;
      case 'weapons':
        this.openCyberModal(this.modalArmory);
        break;
      case 'inventory':
        this.openCyberModal(this.modalInventory);
        break;
      case 'store':
        this.openCyberModal(this.modalShop);
        break;
      case 'events':
        this.openCyberModal(this.modalEvents);
        break;
      case 'missions':
        this.openCyberModal(this.modalQuests);
        break;
      case 'clan':
        this.openCyberModal(this.modalClan);
        break;
      case 'rank':
        this.openCyberModal(this.modalRanked);
        break;
      case 'settings':
        this.openCyberModal(this.modalSettings);
        break;
    }
  }

  _startMatchPrepSequence() {
    this.openCyberModal(this.modalMatchPrep);

    const avatar = this.playerProfile.avatarId || 'player1';
    if (this.prepPlayerAvatar) renderMiiAvatar(this.prepPlayerAvatar, avatar);
    if (this.prepOpponentAvatar) renderMiiAvatar(this.prepOpponentAvatar, 'opponent1');

    const prepSlotName = document.querySelector('.prep-slot.player .prep-slot-name');
    if (prepSlotName) prepSlotName.textContent = this.playerProfile.username || this.playerProfile.name || 'Ammaar';

    let count = 3;
    if (this.prepCountdown) this.prepCountdown.textContent = String(count);

    if (this._prepTimer) clearInterval(this._prepTimer);
    this._prepTimer = setInterval(() => {
      count--;
      if (this.prepCountdown) this.prepCountdown.textContent = String(Math.max(1, count));
      if (count <= 0) {
        clearInterval(this._prepTimer);
        this._prepTimer = null;
        this._launchFlagshipMatch();
      }
    }, 500);
  }

  _launchFlagshipMatch() {
    if (this._prepTimer) {
      clearInterval(this._prepTimer);
      this._prepTimer = null;
    }
    this.closeCyberModal(this.modalMatchPrep);

    if (this.cmdDeckStage) {
      this.cmdDeckStage.classList.add('matchmaking-active');
    }

    try {
      this.engine?.audioEngine?.playSfx?.('menu_select');
    } catch (e) {}

    setTimeout(() => {
      if (this.cmdDeckStage) {
        this.cmdDeckStage.classList.remove('matchmaking-active');
      }

      this.storyManager.activeStoryChapter = null;
      this.storyManager.activeTournamentLevel = null;
      this.storyManager.updateHudLevelBadge('FLAGSHIP 3D TENNIS • LIVE');

      this.showScreen('game');

      if (this.engine?.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: this.matchSettings.format || '1v1',
          difficulty: this.matchSettings.difficulty || 'casual',
          gamesToWin: this.matchSettings.gamesToWin || 2,
          playerName: this.playerProfile.username || this.playerProfile.name || 'Ammaar',
          opponentName: 'Casual AI',
        });
      }
      this.showToast('Match launched! Ready on court.', '🎾');
    }, 380);
  }

  _initUniversalSettingsBindings() {
    // Settings Tabs
    const tabs = document.querySelectorAll('.settings-tab-btn');
    const panes = document.querySelectorAll('.settings-panel-content, .settings-tab-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.add('hidden'));
        tab.classList.add('active');
        const tabKey = tab.getAttribute('data-tab');
        const targetPane = document.getElementById(`tab-${tabKey}`) || document.getElementById(`tab-pane-${tabKey}`);
        if (targetPane) targetPane.classList.remove('hidden');
      });
    });

    // PWA & Android WebAPK Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.btnTopInstallApk) {
        this.btnTopInstallApk.style.borderColor = '#10b981';
        this.btnTopInstallApk.style.boxShadow = '0 0 10px rgba(16,185,129,0.6)';
      }
    });

    const openApkTab = () => {
      this.openCyberModal(this.modalSettings);
      const apkTab = document.querySelector('.settings-tab-btn[data-tab="apk"]');
      if (apkTab) apkTab.click();
    };

    const triggerApkInstall = () => {
      openApkTab();
      if (this.deferredInstallPrompt) {
        this.deferredInstallPrompt.prompt();
        this.deferredInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.showToast('RAzy APK installed to Android Home Screen!', '🎉');
          }
          this.deferredInstallPrompt = null;
        });
      } else {
        this.showToast('Select Download APK or AAB below!', '📦');
      }
    };

    if (this.btnTopInstallApk) {
      this.btnTopInstallApk.addEventListener('click', triggerApkInstall);
    }
    if (this.btnInstallApkPrompt) {
      this.btnInstallApkPrompt.addEventListener('click', () => {
        if (this.deferredInstallPrompt) {
          this.deferredInstallPrompt.prompt();
          this.deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              this.showToast('RAzy APK installed to Android Home Screen!', '🎉');
            }
            this.deferredInstallPrompt = null;
          });
        } else {
          this.showToast('Use "Download Signed APK" for direct installation!', '📲');
        }
      });
    }

    // Populate Account Tab details
    const accUID = document.getElementById('acc-display-uid');
    if (accUID) accUID.textContent = this.playerProfile.uid || 'RAZ-7F3A91C2';

    const accEmail = document.getElementById('acc-email-display');
    if (accEmail) accEmail.textContent = this.playerProfile.googleEmail || 'Guest Session';

    const accCreated = document.getElementById('acc-created-display');
    if (accCreated) accCreated.textContent = this.playerProfile.createdAt || '2026-10-24';

    // Copy UID Working Buttons
    const handleCopyUID = () => {
      const uid = this.playerProfile.uid || 'RAZ-7F3A91C2';
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(uid).catch(() => {});
      }
      this.showToast(`UID Copied: ${uid}`, '📋');
    };

    const btnAccCopy = document.getElementById('btn-acc-copy-uid');
    if (btnAccCopy) btnAccCopy.addEventListener('click', handleCopyUID);

    const btnModalCopy = document.getElementById('btn-modal-copy-uid');
    if (btnModalCopy) btnModalCopy.addEventListener('click', handleCopyUID);

    // Fullscreen switch
    const switchFs = document.getElementById('settings-toggle-fs');
    if (switchFs) {
      switchFs.addEventListener('change', () => {
        if (switchFs.checked) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    // Audio sliders
    const sliderMaster = document.getElementById('settings-vol-master');
    if (sliderMaster) {
      sliderMaster.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        if (this.engine?.audioEngine) {
          this.engine.audioEngine.masterVolume = val;
        }
      });
    }

    // Logout & Delete Account
    const btnLogout = document.getElementById('btn-acc-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        this.playerProfile.isLoggedIn = false;
        this._saveProfile();
        this.closeCyberModal(this.modalSettings);
        this.showToast('Signed out successfully', 'ℹ️');
        this.showScreen('auth');
      });
    }

    const btnDelete = document.getElementById('btn-acc-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        this.closeCyberModal(this.modalSettings);
        this.openCyberModal(this.modalDeleteAccount);
      });
    }

    const btnConfirmDelete = document.getElementById('btn-confirm-delete-account');
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', () => {
        localStorage.removeItem('razy_user_profile');
        localStorage.removeItem('smash_club_player_profile');
        this.playerProfile = this._loadProfile();
        this.closeCyberModal(this.modalDeleteAccount);
        this.showToast('Account deleted and reset', '🗑️');
        this.showScreen('auth');
      });
    }

    const btnCancelDelete = document.getElementById('btn-cancel-delete-account');
    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', () => {
        this.closeCyberModal(this.modalDeleteAccount);
      });
    }
  }

  // 1-Click Instant Match with Casual AI & Default Settings
  startQuickCasualMatch() {
    if (this.cmdDeckStage) {
      this.cmdDeckStage.classList.add('matchmaking-active');
    }

    // Close any open modals
    document.querySelectorAll('.cyber-modal-backdrop').forEach(m => this.closeCyberModal(m));

    try {
      this.engine?.audioEngine?.playSfx?.('menu_select');
    } catch (e) {}

    setTimeout(() => {
      if (this.cmdDeckStage) {
        this.cmdDeckStage.classList.remove('matchmaking-active');
      }

      this.storyManager.activeStoryChapter = null;
      this.storyManager.activeTournamentLevel = null;
      this.storyManager.updateHudLevelBadge('CASUAL AI • INSTANT MATCH');

      this.showScreen('game');

      if (this.engine?.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: '1v1',
          difficulty: 'casual',
          gamesToWin: 2,
          playerName: this.playerProfile.name || 'Ammaar',
          opponentName: 'Casual AI',
        });
      }
    }, 380);
  }

  _startRankedMatch() {
    if (this.cmdDeckStage) {
      this.cmdDeckStage.classList.add('matchmaking-active');
    }

    // Close any open modals
    document.querySelectorAll('.cyber-modal-backdrop').forEach(m => this.closeCyberModal(m));

    try {
      this.engine?.audioEngine?.playSfx?.('menu_select');
    } catch (e) {}

    setTimeout(() => {
      if (this.cmdDeckStage) {
        this.cmdDeckStage.classList.remove('matchmaking-active');
      }

      const rankInfo = this.storyManager.getRank();
      this.storyManager.activeStoryChapter = null;
      this.storyManager.activeTournamentLevel = null;
      this.storyManager.updateHudLevelBadge(`RANKED • ${rankInfo.name.toUpperCase()}`);

      this.showScreen('game');

      if (this.engine?.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: '1v1',
          difficulty: rankInfo.minRP > 2000 ? 'legend' : (rankInfo.minRP > 1000 ? 'pro' : 'casual'),
          gamesToWin: 2,
          playerName: this.playerProfile.name,
        });
      }
    }, 380);
  }

  _startDoublesMatch() {
    if (this.cmdDeckStage) {
      this.cmdDeckStage.classList.add('matchmaking-active');
    }

    // Close any open modals
    document.querySelectorAll('.cyber-modal-backdrop').forEach(m => this.closeCyberModal(m));

    try {
      this.engine?.audioEngine?.playSfx?.('menu_select');
    } catch (e) {}

    setTimeout(() => {
      if (this.cmdDeckStage) {
        this.cmdDeckStage.classList.remove('matchmaking-active');
      }

      this.storyManager.activeStoryChapter = null;
      this.storyManager.activeTournamentLevel = null;
      this.storyManager.updateHudLevelBadge(`2V2 DOUBLES CHAMPIONSHIP`);

      this.showScreen('game');

      if (this.engine?.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: '2v2',
          difficulty: 'pro',
          gamesToWin: 2,
          playerName: this.playerProfile.name,
        });
      }
    }, 380);
  }

  // =========================================================================
  // 15-SECOND CINEMATIC INSTANT REPLAY THEATRE
  // =========================================================================
  openCinematicReplay() {
    if (!this.modalCinematicReplay) return;

    const replayData = this.engine ? this.engine.getActiveReplayData() : null;
    if (this.replayMetaText && replayData) {
      this.replayMetaText.textContent = replayData.meta || `${this.playerProfile.name} • 15s Highlight Rally`;
    }

    if (this.replayScrubSlider) {
      this.replayScrubSlider.value = 0;
      this.replayScrubSlider.max = 15;
    }
    if (this.replayCurrentTime) {
      this.replayCurrentTime.textContent = '0:00';
    }

    this.modalCinematicReplay.classList.remove('hidden');
    this.modalCinematicReplay.style.opacity = '1';
    this.modalCinematicReplay.style.pointerEvents = 'auto';

    if (this.engine) {
      this.engine.startCinematicReplay();
    }

    if (this.replayPlayIcon) this.replayPlayIcon.textContent = '⏸';
    if (this.replayPlayTxt) this.replayPlayTxt.textContent = 'Pause';

    // Start sync timer
    if (this._replaySyncTimer) clearInterval(this._replaySyncTimer);
    this._replaySyncTimer = setInterval(() => {
      if (this.engine && this.engine.isCinematicReplayActive) {
        const t = this.engine.replayPlayhead || 0;
        if (this.replayScrubSlider) this.replayScrubSlider.value = t.toFixed(1);
        if (this.replayCurrentTime) this.replayCurrentTime.textContent = this._formatReplayTime(t);
      }
    }, 80);
  }

  closeCinematicReplay() {
    if (!this.modalCinematicReplay) return;
    this.modalCinematicReplay.classList.add('hidden');
    this.modalCinematicReplay.style.opacity = '0';
    this.modalCinematicReplay.style.pointerEvents = 'none';

    if (this._replaySyncTimer) {
      clearInterval(this._replaySyncTimer);
      this._replaySyncTimer = null;
    }

    if (this.engine) {
      this.engine.stopCinematicReplay();
    }
  }

  toggleReplayPlayPause() {
    if (!this.engine) return;
    const isPlaying = !this.engine.replayIsPlaying;
    this.engine.setCinematicReplayPlaying(isPlaying);
    if (this.replayPlayIcon) this.replayPlayIcon.textContent = isPlaying ? '⏸' : '▶';
    if (this.replayPlayTxt) this.replayPlayTxt.textContent = isPlaying ? 'Pause' : 'Play';
  }

  restartCinematicReplay() {
    if (!this.engine) return;
    this.engine.setCinematicReplayTime(0);
    this.engine.setCinematicReplayPlaying(true);
    if (this.replayScrubSlider) this.replayScrubSlider.value = 0;
    if (this.replayCurrentTime) this.replayCurrentTime.textContent = '0:00';
    if (this.replayPlayIcon) this.replayPlayIcon.textContent = '⏸';
    if (this.replayPlayTxt) this.replayPlayTxt.textContent = 'Pause';
  }

  scrubCinematicReplay(timeSec) {
    if (!this.engine) return;
    this.engine.setCinematicReplayTime(timeSec);
    if (this.replayCurrentTime) {
      this.replayCurrentTime.textContent = this._formatReplayTime(timeSec);
    }
  }

  setReplaySpeed(speed) {
    if (!this.engine) return;
    this.engine.setCinematicReplaySpeed(speed);

    this.replaySpeedBtns.forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });

    if (this.replaySpeedBadge) {
      this.replaySpeedBadge.textContent = `${speed}x SPEED`;
    }
  }

  setReplayCam(cam) {
    if (!this.engine) return;
    this.engine.setCinematicReplayCam(cam);

    this.replayCamBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cam === cam);
    });

    const labels = {
      orbit: '🎥 CAM 1: DYNAMIC ORBIT',
      sideline: '⚡ CAM 2: PRO SIDELINE',
      net: '🎾 CAM 3: NET POST POV',
      drone: '🚁 CAM 4: STADIUM DRONE',
    };
    if (this.replayCamBadge) {
      this.replayCamBadge.textContent = labels[cam] || `🎥 CAM: ${cam.toUpperCase()}`;
    }
  }

  _formatReplayTime(seconds) {
    const s = Math.floor(seconds);
    const ms = Math.floor((seconds - s) * 10);
    return `0:${s < 10 ? '0' : ''}${s}.${ms}`;
  }
}
