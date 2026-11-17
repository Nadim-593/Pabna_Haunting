# THE PABNA HAUNTING
### An Advanced Interactive Multi-Page Horror Web Experience
**Pabna Paranormal Research Cell (PPRC) — Classified Terminal**

---

## 1. Project Overview & Scenario

You have been recruited by the **Pabna Paranormal Research Cell (PPRC)** to investigate an anomalous radio signal originating from the ruins of the abandoned **Pabna Mental Asylum** along the **Ichamati River** in Pabna District, Bangladesh.

The signal (7.743 MHz) traps visitors inside a multi-tier virtual investigation terminal. You must analyze live CCTV surveillance feeds, search classified patient dossiers from 1965–1971, solve historical landmark cryptographic puzzles, reconnect the emergency telegraph line, and transmit the final rescue broadcast before facility containment collapses.

---

## 2. Page Navigation Architecture

- **Stage 01: Gateway Hub (`index.html`)**  
  Classified landing terminal, folklore intel, animated boot sequence, and demo clearance verification.
- **Stage 02: CCTV Surveillance Grid (`surveillance.html`)**  
  6 live simulated feeds from abandoned asylum sectors (Ward-C, Operating Theatre, Morgue, Isolation Cell 09). Interactive distortion filters, procedural noise, spectral frequency analyzer, and evidence logging.
- **Stage 03: Patient Archive & Cipher Vault (`archive.html`)**  
  Classified database of 10 psychiatric patients (1965–1971) with search & filter engine. Cipher Vault with 3 landmark puzzles (Tarash Bhaban, Hardinge Bridge, Shahid Bulu Park) yielding the final escape code.
- **Stage 04: Emergency Escape Protocol (`escape.html`)**  
  Tense red/black emergency lockdown dashboard, active countdown clock, power drainage meter, override code validator, horror jumpscare failure, and animated rescue broadcast victory.

---

## 3. Bonus Features Implemented

### Bonus 1: Procedural Web Audio API Sound System (+5)
- **Zero external audio files**: 100% procedurally synthesized in real time via the browser's native Web Audio API.
- Continuous 55 Hz sub-bass room drone with binaural detuned beating.
- Ambient ghostly whispering sound generator (pink noise filtered through dual formant resonators).
- Tactile mechanical terminal key clicks when typing in input fields.
- Button interaction blips, radio static bursts, and electrical spark crackles.
- Two-tone emergency klaxon alarm sirens and 45 Hz sub-bass jumpscare shocks.
- Global volume control & Mute/Unmute toggle in the persistent header.
- Fully respects browser autoplay restrictions.

### Bonus 2: Persistent LocalStorage State Management (+5)
- Automatic dual-storage persistence using `localStorage` and `sessionStorage`.
- Persists:
  - Agent login & authentication tokens.
  - Completed investigation stages (`gateway`, `surveillance`, `archive`, `escape`).
  - Logged evidence items and viewed CCTV cameras.
  - Unlocked confidential patient dossiers and solved cipher challenges.
  - Emergency lockdown code (`PPRC-ESCAPE-1971-ICHAMATI`).
  - Telegraph mini-game completion status (`telegraphSolved`).
  - Language preference (`en` / `bn`) and audio settings (`audioEnabled`, `audioVolume`).
- Resilient JSON validation with automatic corruption recovery.
- Full investigation purge & reset via `↻ RESET` in the footer.

### Bonus 3: Canvas / SVG Mini-Game — "RECONNECT THE TELEGRAPH LINE" (+5)
- Interactive electrical junction box accessible via the header `[⚡ TELEGRAPH LINE]` button or in Stage 03.
- Connect 4 severed terminal lines using interactive drag-and-drop or click-to-connect bezier curve wires with realistic physics droop and glowing shadows:
  1. `12V DYNAMO COIL` (Amber) &rarr; `[PORT B] SUB-LEVEL DYNAMO`
  2. `7.743 MHz RF CARRIER` (Green) &rarr; `[PORT A] ANTENNA TUNER`
  3. `ICHAMATI EARTH GROUND` (Cyan) &rarr; `[PORT D] FLOODGATE WATERBED GROUND`
  4. `HARDINGE EXPEDITION RELAY` (Red) &rarr; `[PORT C] HARDINGE BRIDGE RELAY`
- Tactile plug snap sound on correct connection, electrical spark particle bursts on wrong connection.
- 4-fuse blowout limit.
- Solving surges voltmeter needle and unlocks **SECRET TELEGRAPH LOG #4** with the emergency override code.

### Bonus 4: Multi-Language Switcher (English & বাংলা) (+5)
- Seamless bilingual support: English & বাংলা.
- High-quality, natural horror-themed Bengali translations:
  - "পাবনা প্যারানরমাল রিসার্চ সেল"
  - "হিসোর ওয়ার্ড" (Whistling Ward)
  - "ইছামতী নদীর বিপদ সংকেত"
  - "জরুরি লকডাউন ও নিষ্ক্রমণ পোর্টাল"
- Preserves proper names: Pabna, Hardinge Bridge, Tarash Bhaban, Shahid Bulu Park, Dr. Mujibur Rahman.
- One-click `[ EN | বাংলা ]` toggle in the persistent navigation header.
- Real-time DOM updates via `data-i18n` attributes.
- Persists across sessions and page navigation.

---

## 4. Master Solutions & Evaluation Passcodes

| Stage / Challenge | Landmark / Target | Encrypted Input | Exact Solution |
| :--- | :--- | :--- | :--- |
| **Stage 01: Gateway Hub** | Clearance Passcode | *"The year the asylum fell silent, reversed"* (1971) | **`1791`** |
| **Stage 03: Cipher 01** | Tarash Bhaban | Caesar Shift +3: `WDUHVK EKDYDQ VHFUHW YDXOW` | **`TARASH BHABAN SECRET VAULT`** *(or `TARASH BHABAN`)* |
| **Stage 03: Cipher 02** | Hardinge Bridge | A1Z26 Code: `16-1-11-19-5-25 / 16-1-4-13-1` | **`PAKSEY PADMA`** *(or `PAKSEY`)* |
| **Stage 03: Cipher 03** | Shahid Bulu Park | Synthesis: `[MARTYR] - [RIVER] - [YEAR]` | **`BULU-ICHAMATI-1971`** |
| **Stage 04: Escape Portal** | Facility Lockdown | Emergency Lockdown Override Code | **`PPRC-ESCAPE-1971-ICHAMATI`** |

---

## 5. Local Setup & Testing Instructions

### How to Run:
No build tools, bundlers, or package installations required. Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari):

```bash
# Option A: Directly double-click index.html or open via browser
open index.html

# Option B: Run via any static HTTP server (e.g. Python or Node)
npx serve .
# or
python -m http.server 8000
```

### End-to-End Walkthrough:
1. **Gateway Hub (`index.html`)**:
   - Enter Agent ID (e.g. `AGENT-DELTA-07`).
   - Enter Passcode: `1791`.
   - Click **Initialize Investigation** &rarr; click **Enter the Investigation**.
2. **CCTV Surveillance Grid (`surveillance.html`)**:
   - Switch camera feeds (keys `1`–`6` or click).
   - Toggle distortion filters (Static Noise, Scanlines, RGB Split, Night Vision).
   - Click **🔊 SOUND** in header to activate ambient drone.
   - Select **CAM-03 [Operating Theatre 2]** and click **🔍 SPECTRAL FREQUENCY SCAN** (or Spacebar).
   - Click **⚡ LOG EVIDENCE** to record the *Thermal Shadow Manifest*.
   - Click **PROCEED TO STAGE 03 →**.
3. **Patient Archive & Cipher Vault (`archive.html`)**:
   - Filter patient records by Ward or search `Whistling`.
   - Open patient **Subrata Sen (`P-1965-01`)** dossier.
   - Click **`🔐 CIPHER VAULT`** tab.
   - Solve Challenge 1: `TARASH BHABAN SECRET VAULT`
   - Solve Challenge 2: `PAKSEY PADMA`
   - Solve Challenge 3: `BULU-ICHAMATI-1971`
   - Observe the **STAGE 04 OVERRIDE UNLOCKED** banner reveal code: `PPRC-ESCAPE-1971-ICHAMATI`.
   - Click **⚡ TELEGRAPH LINE** in header &rarr; connect all 4 wires to test mini-game.
   - Click **PROCEED TO ESCAPE PORTAL (STAGE 04) →**.
4. **Emergency Lockdown Protocol (`escape.html`)**:
   - **Victory Test**: Enter code `PPRC-ESCAPE-1971-ICHAMATI` (or click `[DEV: CODE]`), submit &rarr; observe transmission animation and Victory completion screen!
   - **Failure Test**: Click `↻ RETRY EMERGENCY OVERRIDE`, then click `[DEV: 10s]` &rarr; watch the timer expire to experience the jumpscare horror collapse!
