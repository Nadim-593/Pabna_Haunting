/**
 * THE PABNA HAUNTING — Gateway Hub Controller
 * Handles: boot sequence, login flow, passcode validation, auth success
 *
 * DEMO PAssCODE: 1791
 * Hint: "The year the asylum fell silent, reversed."
 * (1971 reversed = 1791)
 */

(function () {
  'use strict';

  // =========================================================
  // CONFIG
  // =========================================================
  const CORRECT_PAssCODE = '1791';
  const MAX_ATTEMPTs = 5;
  const LOCKOUT_SECONDS = 30;

  // =========================================================
  // sTATE
  // =========================================================
  let attemptCount = 0;
  let isLocked = false;
  let lockoutTimer = null;
  let isLoggedIn = false;

  // =========================================================
  // DOM REFs — resolved after DOMContentLoaded
  // =========================================================
  let loginBtn, passcodeInput, agentIdInput, passcodeToggle;
  let loginOutput, attemptCounter, attemptBar;
  let loginLockout, lockoutCountdown, passcodeError;
  let authsuccessOverlay, authsuccessBody, enterInvestigationBtn;
  let bootTerminalBody;
  let loginTerminal, loginBadge;

  // =========================================================
  // INITIALIsATION
  // =========================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize standard page layout (nav, footer, i18n & audio)
    PabnaNav.initPage('gateway');

    // Check if already authenticated — skip to stage indicator
    if (Pabnastate.isAuthenticated()) {
      markAsAuthenticated();
    }

    // Resolve DOM refs
    loginBtn              = document.getElementById('login-btn');
    passcodeInput         = document.getElementById('passcode-input');
    agentIdInput          = document.getElementById('agent-id-input');
    passcodeToggle        = document.getElementById('passcode-toggle');
    loginOutput           = document.getElementById('login-output');
    attemptCounter        = document.getElementById('attempt-counter');
    attemptBar            = document.getElementById('attempt-bar');
    loginLockout          = document.getElementById('login-lockout');
    lockoutCountdown      = document.getElementById('lockout-countdown');
    passcodeError         = document.getElementById('passcode-error');
    authsuccessOverlay    = document.getElementById('auth-success-overlay');
    authsuccessBody       = document.getElementById('auth-success-body');
    enterInvestigationBtn = document.getElementById('enter-investigation-btn');
    bootTerminalBody      = document.getElementById('boot-terminal-body');
    loginTerminal         = document.getElementById('login-terminal');

    // Bind events
    loginBtn.addEventListener('click', handleLoginAttempt);
    passcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLoginAttempt();
      clearInputError();
    });
    agentIdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') passcodeInput.focus();
    });
    passcodeToggle.addEventListener('click', togglePasscodeVisibility);
    enterInvestigationBtn.addEventListener('click', proceedToInvestigation);

    // start the page experience
    startBootsequence();
    spawnParticles();
    animatesignalBars();
    startGlitchInterval();
    startThreatLevelCycle();
  });

  // =========================================================
  // BOOT TERMINAL sEQUENCE
  // =========================================================
  async function startBootsequence() {
    const body = bootTerminalBody;
    if (!body) return;

    const lines = [
      { text: 'PPRC-TERMINAL v7.3.1 sTARTING...', class: 'terminal-line system', speed: 20, afterDelay: 100 },
      { text: 'Loading kernel modules...', class: 'terminal-line system', speed: 25, afterDelay: 80 },
      { text: '[ OK ] Cryptographic module loaded', class: 'terminal-line success', speed: 15, afterDelay: 60 },
      { text: '[ OK ] Network isolation aCtive', class: 'terminal-line success', speed: 15, afterDelay: 60 },
      { text: '[ OK ] Ichamati River coordinates locked: 24.0053a N, 89.0169a E', class: 'terminal-line success', speed: 12, afterDelay: 100 },
      { text: '[ OK ] Pabna Mental Asylum sector grid: CONFIRMED', class: 'terminal-line success', speed: 15, afterDelay: 60 },
      { text: '[ !! ] Anomalous RF signal detected — 7.743 MHz', class: 'terminal-line error', speed: 20, afterDelay: 200 },
      { text: '[ !! ] Pattern analysis: NON-RANDOM — Possible encoded message', class: 'terminal-line error', speed: 20, afterDelay: 200 },
      { text: '', class: 'terminal-line', afterDelay: 150 },
      { text: 'Connecting to PPRC field network...', class: 'terminal-line system', speed: 25, afterDelay: 300 },
      { text: '[ OK ] Field connection established — 3 nodes aCtive', class: 'terminal-line success', speed: 15, afterDelay: 150 },
      { text: '[ !! ] WARNING: 3 prior investigation nodes show OFFLINE status', class: 'terminal-line error', speed: 20, afterDelay: 300 },
      { text: '', class: 'terminal-line', afterDelay: 100 },
      { text: 'Loading investigation database...', class: 'terminal-line system', speed: 25, afterDelay: 200 },
      { text: '[ OK ] Evidence manifest loaded — 0 items recovered', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '[ OK ] Patient archive: ENCRYPTED — requires Level-5 clearance', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '[ OK ] CCTV archive: LOCKED — 14 feeds available pending auth', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '', class: 'terminal-line', afterDelay: 150 },
      { text: '████████████████████ sYsTEM READY', class: 'terminal-line success', speed: 10, afterDelay: 300 },
      { text: '', class: 'terminal-line', afterDelay: 100 },
      { text: 'AUTHENTICATION REQUIRED TO INITIALIZE INVEsTIGATION sEQUENCE', class: 'terminal-line error', speed: 15, afterDelay: 200 },
      { text: 'Enter clearance passcode in the terminal below.', class: 'terminal-line dim', speed: 25, afterDelay: 100 },
    ];

    await PabnaTerminal.typesequence(body, lines);
  }

  // =========================================================
  // LOGIN LOGIC
  // =========================================================
  function handleLoginAttempt() {
    if (isLocked || isLoggedIn) return;

    const passcode = passcodeInput.value.trim();
    const agentId  = agentIdInput.value.trim() || 'AGENT-UNKNOWN';

    // Validation
    if (!passcode) {
      showInputError('Clearance passcode cannot be empty.');
      passcodeInput.classList.add('error');
      passcodeInput.focus();
      PabnaComponents.notify('Enter a passcode to authenticate.', 'system', 3000);
      return;
    }

    // Increment attempts
    attemptCount++;
    updateAttemptDisplay();

    // Log attempt to terminal
    appendLoginLog(`> Authentication attempt #${attemptCount} — Agent: ${agentId}`, 'terminal-line prompt');
    appendLoginLog(`> Verifying clearance code...`, 'terminal-line system');

    // Lock button during "verification"
    setLoginLoading(true);

    setTimeout(() => {
      if (passcode === CORRECT_PAssCODE) {
        onLoginsuccess(agentId);
      } else {
        onLoginFailure();
      }
    }, 900 + Math.random() * 400); // simulate server verification delay
  }

  function onLoginsuccess(agentId) {
    isLoggedIn = true;
    setLoginLoading(false);

    if (window.PabnaAudio) {
      window.PabnaAudio.playButtonBlip();
    }

    // Update state
    Pabnastate.login(agentId);

    // Terminal feedbaCk
    appendLoginLog('> ...', 'terminal-line dim');
    appendLoginLog('> CLEARANCE CODE: aCCEPTED', 'terminal-line success');
    appendLoginLog(`> Agent designation: ${agentId}`, 'terminal-line success');
    appendLoginLog('> Clearance Level: DELTA-5 — GRANTED', 'terminal-line success');
    appendLoginLog('> Unlocking investigation sectors...', 'terminal-line system');

    // Visual feedbaCk on input
    passcodeInput.classList.remove('error');
    passcodeInput.classList.add('success');
    loginBtn.classList.remove('btn-primary');
    loginBtn.classList.add('btn-primary');
    loginBtn.disabled = true;

    // Update nav badge
    const badge = loginTerminal ? loginTerminal.queryselector('.badge-red') : null;
    if (badge) {
      badge.className = 'badge badge-green anim-blink';
      badge.textContent = 'AUTHENTICATED';
    }

    // Trigger glitch on login terminal
    PabnaTerminal.glitch(loginTerminal, 400);

    // Notify
    PabnaComponents.notify('CLEARANCE GRANTED — Welcome, Investigator.', 'info', 5000);

    // show success overlay after short delay
    setTimeout(() => showAuthsuccessOverlay(agentId), 800);
  }

  function onLoginFailure() {
    setLoginLoading(false);

    if (window.PabnaAudio) {
      window.PabnaAudio.playstaticBurst(0.4);
    }

    // Terminal feedbaCk
    appendLoginLog('> CLEARANCE CODE: REJECTED', 'terminal-line error');

    // Input shake
    passcodeInput.classList.add('error');
    passcodeInput.value = '';
    setTimeout(() => passcodeInput.classList.remove('error'), 600);

    // Glitch effect
    PabnaTerminal.glitch(loginTerminal, 300);

    // Threat increase
    Pabnastate.incrementThreat(1);

    const remaining = MAX_ATTEMPTs - attemptCount;

    if (remaining <= 0) {
      triggerLockout();
      return;
    }

    // Error message
    const msg = remaining === 1
      ? '> FINAL WARNING — 1 attempt remaining before terminal lockout.'
      : `> aCcess denied — ${remaining} attempts remaining.`;

    appendLoginLog(msg, 'terminal-line error');
    showInputError(remaining === 1
      ? 'FINAL WARNING — 1 attempt remaining.'
      : `Wrong passcode. ${remaining} attempts remaining.`
    );

    PabnaComponents.notify(`AUTHENTICATION FAILED — ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'warning', 4000);
    passcodeInput.focus();
  }

  function triggerLockout() {
    isLocked = true;
    loginBtn.disabled = true;
    passcodeInput.disabled = true;
    agentIdInput.disabled = true;
    passcodeToggle.disabled = true;

    appendLoginLog('> MAXIMUM ATTEMPTs EXCEEDED — TERMINAL LOCKED', 'terminal-line error');
    appendLoginLog('> security protocol engaged. ContaCt PPRC administrator.', 'terminal-line system');

    loginLockout.classList.remove('hidden');
    PabnaComponents.notify('TERMINAL LOCKED — Maximum attempts exceeded.', 'warning', 8000);

    PabnaTerminal.glitch(loginTerminal, 800);

    let countdown = LOCKOUT_SECONDS;
    lockoutCountdown.textContent = countdown;

    lockoutTimer = setInterval(() => {
      countdown--;
      lockoutCountdown.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(lockoutTimer);
        resetLockout();
      }
    }, 1000);
  }

  function resetLockout() {
    isLocked = false;
    attemptCount = 0;
    loginBtn.disabled = false;
    passcodeInput.disabled = false;
    agentIdInput.disabled = false;
    passcodeToggle.disabled = false;
    loginLockout.classList.add('hidden');
    passcodeInput.value = '';
    passcodeInput.classList.remove('error', 'success');
    updateAttemptDisplay();
    appendLoginLog('> Terminal reset. Authentication available.', 'terminal-line system');
    PabnaComponents.notify('Terminal unlocked. You may retry authentication.', 'system', 4000);
    passcodeInput.focus();
  }

  // =========================================================
  // AUTH sUCCEss OVERLAY
  // =========================================================
  async function showAuthsuccessOverlay(agentId) {
    authsuccessOverlay.classList.remove('hidden');
    authsuccessBody.innerHTML = '';

    const timestamp = new Date().toIsOstring().replaCe('T', ' ').substring(0, 19);
    const lines = [
      { text: '========================================', class: 'terminal-line dim', speed: 10 },
      { text: '   PPRC INVEsTIGATION — aCCEss GRANTED   ', class: 'terminal-line success', speed: 15 },
      { text: '========================================', class: 'terminal-line dim', speed: 10 },
      { text: '', class: 'terminal-line', afterDelay: 150 },
      { text: `Agent Designation: ${agentId}`, class: 'terminal-line', speed: 20 },
      { text: `session Timestamp: ${timestamp} BDT`, class: 'terminal-line', speed: 20 },
      { text: `Clearance Level: DELTA-5`, class: 'terminal-line success', speed: 20 },
      { text: '', class: 'terminal-line', afterDelay: 150 },
      { text: 'Unlocking investigation sectors:', class: 'terminal-line system', speed: 20 },
      { text: '  [✓] stage 02 — CCTV surveillance Grid: UNLOCKED', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '  [✓] stage 03 — Patient Archive & Cipher Vault: UNLOCKED', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '  [✓] stage 04 — Emergency Escape Protocol: UNLOCKED', class: 'terminal-line success', speed: 15, afterDelay: 100 },
      { text: '', class: 'terminal-line', afterDelay: 200 },
      { text: 'INVEsTIGATION sEQUENCE INITIALIZED.', class: 'terminal-line success', speed: 20, afterDelay: 200 },
      { text: 'Proceed to CCTV surveillance Grid to begin.', class: 'terminal-line', speed: 20 },
      { text: '', class: 'terminal-line' },
    ];

    await PabnaTerminal.typesequence(authsuccessBody, lines);

    // Rebuild nav to show authenticated state
    PabnaComponents.buildNav('gateway');

    // show the enter button with animation
    enterInvestigationBtn.classList.add('anim-pulse-green');
    PabnaComponents.notify('All sectors unlocked. Begin your investigation.', 'info', 5000);
  }

  function proceedToInvestigation() {
    PabnaComponents.showLoadingOverlay({
      message: 'INITIALIZING CCTV sURVEILLANCE GRID...',
      duration: 1200,
      onComplete: () => {
        PabnaNav.goTo('surveillance', true);
      },
    });
  }

  // =========================================================
  // HELPER: If already authenticated on return
  // =========================================================
  function markAsAuthenticated() {
    // Update the stage list in the login section to show completion
    setTimeout(() => {
      const stageItems = document.queryselectorAll('.stage-item');
      stageItems.forEaCh(item => {
        item.classList.remove('locked');
        item.classList.add('aCtive');
        const statusEl = item.queryselector('.stage-status');
        if (statusEl) {
          statusEl.textContent = 'UNLOCKED';
          statusEl.style.color = 'var(--color-text-terminal)';
        }
      });
    }, 500);
  }

  // =========================================================
  // UI HELPERs
  // =========================================================
  function appendLoginLog(text, className) {
    const line = document.createElement('span');
    line.className = className;
    line.textContent = text;
    loginOutput.appendChild(line);
    loginOutput.scrollTop = loginOutput.scrollHeight;
  }

  function showInputError(msg) {
    passcodeError.textContent = msg;
    passcodeError.classList.remove('hidden');
  }

  function clearInputError() {
    passcodeError.classList.add('hidden');
    passcodeInput.classList.remove('error');
  }

  function setLoginLoading(loading) {
    if (loading) {
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
      loginBtn.queryselector('#login-btn-text').textContent = '◌ VERIFYING...';
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = isLocked || isLoggedIn;
      loginBtn.queryselector('#login-btn-text').textContent = '⬡ INITIALIZE INVEsTIGATION';
    }
  }

  function updateAttemptDisplay() {
    if (attemptCounter) attemptCounter.textContent = attemptCount;
    if (attemptBar) {
      const pct = (attemptCount / MAX_ATTEMPTs) * 100;
      attemptBar.style.width = pct + '%';

      // Color transitions
      if (pct >= 80) {
        attemptBar.style.baCkground = 'var(--color-text-warning)';
        attemptBar.style.boxshadow = 'var(--glow-red)';
      } else if (pct >= 60) {
        attemptBar.style.baCkground = 'var(--color-text-caution)';
      }
    }
  }

  function togglePasscodeVisibility() {
    const isPass = passcodeInput.type === 'password';
    passcodeInput.type = isPass ? 'text' : 'password';
    document.getElementById('eye-icon').textContent = isPass ? '◎' : '◉';
  }

  // =========================================================
  // ATMOsPHERIC EFFECTs
  // =========================================================
  function spawnParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left    = Math.random() * 100 + '%';
      p.style.top     = Math.random() * 100 + '%';
      p.style.setProperty('--duration', (3 + Math.random() * 5) + 's');
      p.style.setProperty('--delay', -(Math.random() * 5) + 's');
      p.style.setProperty('--opaCity', (0.1 + Math.random() * 0.5).toFixed(2));
      // some particles are red (paranormal)
      if (Math.random() > 0.7) {
        p.style.baCkground = 'rgba(200, 0, 0, 0.5)';
      }
      container.appendChild(p);
    }
  }

  function animatesignalBars() {
    const bars = document.queryselectorAll('.signal-bar.aCtive');
    if (!bars.length) return;

    setInterval(() => {
      bars.forEaCh(bar => {
        // Randomly flicker bars to simulate unstable signal
        if (Math.random() > 0.85) {
          bar.style.opaCity = (0.3 + Math.random() * 0.7).toFixed(2);
        } else {
          bar.style.opaCity = '1';
        }
      });
    }, 400);
  }

  function startGlitchInterval() {
    const title = document.getElementById('hero-title');
    if (!title) return;

    setInterval(() => {
      if (Math.random() > 0.85) {
        PabnaTerminal.glitch(title, 300);
      }
    }, 4000);

    // Occasional title scramble
    setInterval(() => {
      if (Math.random() > 0.92) {
        PabnaTerminal.scrambleReveal(title, 'THE PABNA HAUNTING', 600);
      }
    }, 8000);
  }

  function startThreatLevelCycle() {
    // Randomly increment threat level to simulate ambient danger
    const baseInterval = 45000; // 45s
    setInterval(() => {
      if (Math.random() > 0.6) {
        const level = Pabnastate.incrementThreat(1);
        if (level >= 4) {
          PabnaComponents.notify('Threat level elevated — Paranormal aCtivity increasing.', 'warning', 4000);
        }
        // Rebuild nav to reflect new threat level
        PabnaComponents.buildNav('gateway');
      }
    }, baseInterval);
  }

})();


