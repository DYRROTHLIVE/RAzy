# Implementation Plan: Smash Club Tennis by Argon Studios

Transform the arcade tennis experience into **Smash Club Tennis** by **Argon Studios** featuring strict landscape display, an animated brand splash intro, landing page, Google & Guest authentication, and an interactive online & offline lobby supporting 1v1, 1v2, and 2v2 doubles matches with team codes, friends, and bots.

---

## User Review Required

> [!IMPORTANT]
> **Firebase Setup Workflow**: When implementation starts, the tool `set_up_firebase` will be triggered with `userConfirmedTermsAcceptedInUI: false`. A Firebase authorization dialog will open in the AI Studio UI for you to approve cloud Firestore and Firebase Auth provisioning. Once approved, cloud user profiles and friend lists will be wired up.

---

## Gaps & Assumptions

1. **Landscape Lock on Mobile Web**: Web browsers don't always allow unconditional programmatic `screen.orientation.lock()` without user interaction or standalone fullscreen. 
   - *Design Choice*: We implement an impenetrable full-screen portrait blocker (`#landscape-enforcer-shield`) with an active orientation listener. Whenever the viewport is portrait (`orientation: portrait` or height > width), a stylish Argon Studios rotation interface blocks interactions, auto-releasing immediately when rotated or when fullscreen landscape is engaged.
2. **1v2 and 2v2 Doubles Mechanics**:
   - *Design Choice*: Teammates are stationed side-by-side (left/deuce and right/ad courts) at the baseline and service line. When playing 1v2 (Solo player vs 2 Opponents) or 2v2 (Player + Bot Teammate vs 2 Opponents), the tennis court marks double tramlines, and partner AI covers their assigned court half while dynamically reacting to lobs and volleys.
3. **Multiplayer Room Code & P2P**:
   - *Design Choice*: Matches utilize 6-character team codes (e.g. `ARG-704`) and WebRTC peer channels alongside Firestore room tracking, allowing instant cross-device connections with zero lag, falling back to smart bots if peers disconnect.

---

## Proposed Changes

### 1. Landscape Enforcement & Viewport Protection
- **`styles.css` / `index.html`**:
  - Add `#landscape-enforcer-shield` with high z-index (`z-index: 999999`).
  - CSS `@media (orientation: portrait)` rule enforcing the shield to cover the screen entirely, instructing the player to rotate their device.
  - JavaScript listener on `resize` and `orientationchange` that triggers `screen.orientation?.lock?.('landscape')` or requestFullscreen to guarantee non-9:16 landscape presentation.

### 2. Animated Splash Screen & Brand Intro
- **`src/screens/splash_screen.js` / `index.html`**:
  - Cinematic **Argon Studios** introduction:
    - Glowing geometric logo reveal with metallic gradients and particle sparks.
    - Studio sound sting / synth chime.
    - Seamless 1.2-second crossfade into the Landing Screen upon completion or tap.

### 3. Landing Screen
- **`src/screens/landing_screen.js` / `index.html`**:
  - High-impact title: **Smash Club Tennis**.
  - Dynamic 3D tennis ball animation, court ambience audio, and "Tap to Play / Enter Club" prompt.
  - Quick access buttons: Sound settings, Credits, and Player Status.

### 4. Authentication Flow (Google Sign-In & Guest Mode)
- **`src/auth_manager.js`**:
  - **Login with Google**: Firebase Authentication popup sign-in via Google provider, storing user display name, avatar, and cloud rating.
  - **Guest Play**: 1-click instant guest entrance ("Guest Player #" with customizable nickname and Mii avatar selection).
  - Profile persistence in `localStorage` for offline sessions and Firebase Firestore for authenticated online players.

### 5. Game Lobby (Online & Offline Modes, 1v1 / 1v2 / 2v2)
- **`src/screens/lobby_screen.js` / `index.html`**:
  - **Mode Selection**:
    - **Online Mode**:
      - Team Code generator / input box (e.g., `Join Team Code` or `Create Team Room`).
      - Friend List with Online/Offline statuses and 1-tap "Invite" buttons.
      - Matchmaking options: Real Friends, Random Matchmaking, or Bot Fill.
    - **Offline Mode**:
      - Pure offline local play: All teammates and opponents are AI bots (Casual, Pro, Champion).
  - **Match Format Selector**:
    - **1vs1 Singles**: Classic player vs opponent.
    - **1vs2 Handicap / Challenge**: Player solo vs 2 coordinated opponents.
    - **2vs2 Doubles**: Player + Partner (Bot or Friend) vs 2 Opponents (Bots or Friends).
  - Match length selection (1 Game, Best of 3, Best of 5).

### 6. Court Engine & HUD Multi-Character Upgrades
- **`src/game_engine.js` & `src/hud_ui.js`**:
  - Enable 2 to 4 Mii avatars on the court simultaneously based on match format (1v1, 1v2, 2v2).
  - Scoreboard avatar badges show all active players (P1, P2 partner, Opponent 1, Opponent 2).
  - Side-by-side positioning coordinates for doubles teams.
  - Update game branding titles in `<title>`, meta tags, and HUD watermarks to "Smash Club Tennis".

---

## Verification Plan

### Automated Compilation & Linting
- Run `lint_applet` to check for syntax and type errors.
- Run `compile_applet` to verify successful Vite/TypeScript build without regressions.

### Manual Verification Steps
1. **Screen Flow**:
   - Reload page: Verify Argon Studios animated splash logo appears with smooth animation.
   - Transition to Landing Screen: Verify "Smash Club Tennis" banner, graphics, and Start button.
   - Click Start: Verify Auth modal presents "Login with Google" and "Play as Guest".
   - Login as Guest: Verify instant lobby appearance with player card and avatar.
2. **Lobby & Match Formats**:
   - Select **Offline Mode**: Verify 1v1, 1v2, and 2v2 options are selectable with bot teammates/opponents.
   - Start 2v2 match: Verify 4 Mii players appear on court in side-by-side positions, scoreboard displays both teams, and AI bots actively hit rallies.
   - Select **Online Mode**: Verify Team Code generation, copy link, and Friends list UI.
3. **Landscape Enforcement**:
   - Resize window to portrait dimensions (e.g. 375x667): Verify `#landscape-enforcer-shield` activates immediately, displaying the rotation prompt.
   - Return to landscape dimensions (e.g. 800x450): Verify shield smoothly disappears and game resumes.
