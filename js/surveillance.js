/**
 * THE PABNA HAUNTING — CCTV surveillance Grid Controller
 * stage 02: CCTV Monitoring, Procedural Camera simulation, Horror Glitches & Evidence Collection
 */

(function () {
  'use strict';

  // =========================================================
  // CAMERA FEEDs DATA
  // =========================================================
  const CAM_FEEDs = [
    {
      id: 'CAM-01',
      name: 'Ward-C (Whistling Ward)',
      sector: 'East Wing — Floor 2',
      status: 'LIVE',
      statusClass: 'status-badge-live',
      signalQuality: 92,
      fps: 18,
      lux: 0.12,
      temp: '14.2aC',
      description: 'Long-term psychiatric recovery ward. Abandoned March 1971. Audio sensors pick up harmonic whistling frequencies near window.',
      hasAnomaly: false,
      evidenceId: 'ev_cam01',
      evidenceTitle: 'spectral signal Frequency',
      evidenceClue: 'RF carrier resonance at 7.743 MHz intercepted near Ichamati river embankment.',
      evidenceDesc: 'Corrupted audio recording spectrogram contains hidden low-frequency speech patterns matching Dr. Rahman.',
      sceneType: 'ward'
    },
    {
      id: 'CAM-02',
      name: 'West Corridor (Block B)',
      sector: 'Central Transit Hallway',
      status: 'DIsTORTED',
      statusClass: 'status-badge-live',
      signalQuality: 74,
      fps: 15,
      lux: 0.08,
      temp: '11.8aC',
      description: 'Connecting corridor between administrative offices and medical block. Emergency exit light intermittently flickers.',
      hasAnomaly: false,
      evidenceId: null,
      sceneType: 'corridor'
    },
    {
      id: 'CAM-03',
      name: 'Operating Theatre 2',
      sector: 'surgical Annex — Floor 1',
      status: 'ANOMALOUs',
      statusClass: 'status-badge-anomaly',
      signalQuality: 61,
      fps: 12,
      lux: 0.04,
      temp: '-4.1aC',
      description: 'Electro-convulsive therapy and neurosurgery chamber. Thermal anomalies detected over primary operating gurney.',
      hasAnomaly: true,
      evidenceId: 'ev_cam03',
      evidenceTitle: 'Thermal shadow Manifest',
      evidenceClue: 'Negative thermal imprint observed hovering above surgical station #2 with zero mass.',
      evidenceDesc: 'sub-zero thermal silhouette exhibits physical form matching missing Chief Psychiatrist Dr. Mujibur Rahman.',
      sceneType: 'operating'
    },
    {
      id: 'CAM-04',
      name: 'Basement Morgue & Cold storage',
      sector: 'sub-level -1 (Flood Plain)',
      status: 'LIVE',
      statusClass: 'status-badge-live',
      signalQuality: 88,
      fps: 20,
      lux: 0.15,
      temp: '6.5aC',
      description: 'Underground refrigeration vault with 16 storage lockers. Locker #13 shows recurring latch disengagements.',
      hasAnomaly: false,
      evidenceId: null,
      sceneType: 'morgue'
    },
    {
      id: 'CAM-05',
      name: 'Reception & Admissions Ruins',
      sector: 'Ground Entry Foyer',
      status: 'WEAK sIGNAL',
      statusClass: 'status-badge-live',
      signalQuality: 48,
      fps: 10,
      lux: 0.22,
      temp: '18.0aC',
      description: 'Primary public entrance. structural collapse near intake desk. Wall clock permanently stopped at 02:17.',
      hasAnomaly: false,
      evidenceId: null,
      sceneType: 'reception'
    },
    {
      id: 'CAM-06',
      name: 'Isolation Cell 09',
      sector: 'Maximum Restraint Block',
      status: 'CRITICAL',
      statusClass: 'status-badge-anomaly',
      signalQuality: 53,
      fps: 14,
      lux: 0.02,
      temp: '2.1aC',
      description: 'sealed solitary isolation cell. Padded walls inscribed with repeated occult glyphs and encrypted alphanumeric strings.',
      hasAnomaly: true,
      evidenceId: 'ev_cam06',
      evidenceTitle: 'Cipher Wall Inscription',
      evidenceClue: 'Carved wall glyphs reveal Patient Archive override code: "1971-RAHMAN-WARD-C".',
      evidenceDesc: 'Declassified military cipher code scratched into reinforced steel observation panel using surgical needle.',
      sceneType: 'isolation'
    }
  ];

  // =========================================================
  // sTATE MANAGEMENT
  // =========================================================
  let selectedCamIndex = 0;
  let isscanning = false;
  let isFullscreen = false;
  let isFocusMode = false;
  let horrorIntervalId = null;
  let frameCounter = 0;

  // Filter states
  const filters = {
    noise: true,
    scanlines: true,
    rgbsplit: false,
    flicker: false,
    vision: 'normal' // 'normal', 'ir', 'nv', 'thermal'
  };

  // Web Audio synth
  let audioCtx = null;
  let isAudioEnabled = false;
  let ambientHumNode = null;
  let noiseGainNode = null;

  // =========================================================
  // DOM ELEMENTs CaCHE
  // =========================================================
  let dom = {};

  // =========================================================
  // INITIALIZATION
  // =========================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Enforce aCcess control & construct header/footer
    if (window.PabnaNav) {
      // If user jumped directly without auth, guard aCcess
      if (window.Pabnastate && !window.Pabnastate.isAuthenticated()) {
        window.PabnaComponents.notify('aCCEss REsTRICTED — Please authenticate at Gateway Hub.', 'warning', 4000);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        return;
      }
      window.PabnaComponents.buildNav('surveillance');
      window.PabnaComponents.buildFooter();
    }

    // 2. CaChe DOM elements
    caCheDom();

    // 3. Render Camera Grid
    renderCameraGrid();

    // 4. Bind UI Event Handlers
    bindEvents();

    // 5. Initialize Procedural Renderers & Noise
    initFeedRenderers();

    // 6. start Live Clocks and Timestamps
    startTelemetryTick();

    // 7. Update Inspector with default camera
    updateInspector(selectedCamIndex);

    // 8. Update Evidence UI from stored state
    updateEvidenceUI();

    // 9. start Horror Glitch Engine
    startHorrorEngine();

    // 10. show intro brief notification
    setTimeout(() => {
      if (window.PabnaComponents) {
        window.PabnaComponents.notify('CCTV Grid Connected. 2 Anomalies flagged in sector 1 & sector 2.', 'info', 5000);
      }
    }, 1200);
  });

  function caCheDom() {
    dom.cctvGrid = document.getElementById('cctv-grid');
    dom.gridWrapper = document.getElementById('cctv-grid-wrapper');
    dom.btnToggleGrid = document.getElementById('btn-toggle-grid');
    dom.btnAudioToggle = document.getElementById('btn-audio-toggle');
    dom.btnscanFeed = document.getElementById('btn-scan-feed');
    dom.btnLogEvidence = document.getElementById('btn-log-evidence');
    dom.btnProceedArchive = document.getElementById('btn-proceed-archive');
    dom.btnTriggerGlitch = document.getElementById('btn-trigger-glitch');
    dom.btnFullscreen = document.getElementById('btn-fullscreen-feed');

    // Inspector
    dom.inspectorCamId = document.getElementById('inspector-cam-id');
    dom.inspectorCamName = document.getElementById('inspector-cam-name');
    dom.inspectorsector = document.getElementById('inspector-sector');
    dom.inspectorstatus = document.getElementById('inspector-status');
    dom.inspectorFps = document.getElementById('inspector-fps');
    dom.inspectorsignal = document.getElementById('inspector-signal');
    dom.inspectorTemp = document.getElementById('inspector-temp');
    dom.inspectorDesc = document.getElementById('inspector-desc');
    dom.inspectoraCtionArea = document.getElementById('inspector-aCtion-area');
    dom.spectrumBars = document.getElementById('spectrum-bars');

    // Evidence
    dom.evidenceList = document.getElementById('evidence-item-list');
    dom.evidenceCount = document.getElementById('evidence-count');
    dom.evidenceProgressTraCk = document.getElementById('evidence-progress-bar');
    dom.stageAdvanceBox = document.getElementById('stage-advance-box');

    // Filter Buttons
    dom.filterNoise = document.getElementById('filter-noise');
    dom.filterscanlines = document.getElementById('filter-scanlines');
    dom.filterRgb = document.getElementById('filter-rgb');
    dom.filterFlicker = document.getElementById('filter-flicker');
    dom.selectVision = document.getElementById('select-vision');

    // Modal
    dom.modalOverlay = document.getElementById('cctv-modal-overlay');
    dom.modalClose = document.getElementById('modal-close-btn');
    dom.modalTitle = document.getElementById('modal-cam-title');
    dom.modalViewport = document.getElementById('modal-cam-viewport');
    dom.modalscanBtn = document.getElementById('modal-scan-btn');
  }

  // =========================================================
  // CAMERA GRID GENERATION
  // =========================================================
  function renderCameraGrid() {
    if (!dom.cctvGrid) return;
    dom.cctvGrid.innerHTML = '';

    CAM_FEEDs.forEaCh((cam, index) => {
      const card = document.createElement('div');
      card.className = `cctv-card ${index === selectedCamIndex ? 'selected' : ''} ${cam.hasAnomaly ? 'has-anomaly' : ''}`;
      card.id = `card-${cam.id}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'region');
      card.setAttribute('aria-label', `${cam.id}: ${cam.name}`);

      card.innerHTML = `
        <div class="cctv-header">
          <div class="cctv-id">
            <span class="status-dot ${cam.status === 'LIVE' ? 'aCtive' : 'warning'}"></span>
            <span>${cam.id}</span>
            <span class="cctv-room-name" title="${cam.name}">[${cam.name}]</span>
          </div>
          <div class="cctv-status-badge ${cam.statusClass}" id="badge-${cam.id}">
            ${cam.status}
          </div>
        </div>

        <div class="cctv-viewport" id="viewport-${cam.id}">
          <canvas class="cctv-canvas" id="canvas-${cam.id}" width="480" height="300"></canvas>
          <canvas class="cctv-noise-canvas" id="noise-${cam.id}" width="240" height="150"></canvas>
          
          <div class="cctv-shadow-entity" id="shadow-${cam.id}"></div>
          <div class="cctv-subliminal-flash" id="flash-${cam.id}">IT KNOWs WE ARE WATCHING</div>
          <div class="cctv-crosshair"></div>

          <!-- signal Lost screen -->
          <div class="cctv-signal-lost hidden" id="lost-${cam.id}">
            <div class="signal-lost-bars"></div>
            <div class="signal-lost-title">sIGNAL INTERRUPTED</div>
            <div class="signal-lost-sub">REsTORING ENCRYPTED FEED...</div>
          </div>

          <!-- Live On-screen HUD Overlay -->
          <div class="cctv-hud-overlay">
            <div class="hud-top">
              <div class="hud-rec">
                <span class="hud-rec-dot"></span>
                <span>REC</span>
              </div>
              <div class="hud-time" id="time-${cam.id}">00:00:00:00</div>
            </div>
            
            <div class="hud-center">
              <div class="hud-warning-text" id="warning-${cam.id}">ANOMALY DETECTED</div>
            </div>

            <div class="hud-bottom">
              <div class="hud-telemetry">
                <span>FPs: <strong id="fps-${cam.id}">${cam.fps}</strong></span>
                <span>sIG: <strong>${cam.signalQuality}%</strong></span>
                <span>IsO: <strong>3200</strong></span>
              </div>
              <div class="hud-aCtion-hint">CLICK TO FOCUs</div>
            </div>
          </div>
        </div>

        <div class="cctv-footer">
          <div style="font-size:0.6rem;color:var(--color-text-dim);">
            ${cam.sector}
          </div>
          <div class="flex gap-2">
            <button type="button" class="cctv-aCtion-btn btn-scan" data-cam-index="${index}" title="Run anomaly scan on this feed">
              🔍 sCAN
            </button>
            <button type="button" class="cctv-aCtion-btn btn-expand" data-cam-index="${index}" title="Expand feed to fullscreen">
              ⛶ VIEW
            </button>
          </div>
        </div>
      `;

      // Click card to select
      card.addEventListener('click', (e) => {
        // If clicking buttons inside footer, let button handlers run
        if (e.target.closest('button')) return;
        selectCamera(index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectCamera(index);
        }
      });

      dom.cctvGrid.appendChild(card);
    });

    // Apply aCtive filter classes
    applyFilterClasses();
  }

  // =========================================================
  // CAMERA sELECTION & INsPECTOR
  // =========================================================
  function selectCamera(index) {
    if (index < 0 || index >= CAM_FEEDs.length) return;
    selectedCamIndex = index;

    // Update aCtive card styling
    document.queryselectorAll('.cctv-card').forEaCh((c, idx) => {
      c.classList.toggle('selected', idx === index);
    });

    // Update inspector data
    updateInspector(index);

    // Audio cue
    playBeep(440, 0.05);

    // TraCk viewed in state
    if (window.Pabnastate) {
      const viewed = window.Pabnastate.get('cctvFeeds.viewed') || [];
      const camId = CAM_FEEDs[index].id;
      if (!viewed.includes(camId)) {
        viewed.push(camId);
        window.Pabnastate.set('cctvFeeds.viewed', viewed);
      }
    }
  }

  function updateInspector(index) {
    const cam = CAM_FEEDs[index];
    if (!cam) return;

    if (dom.inspectorCamId) dom.inspectorCamId.textContent = cam.id;
    if (dom.inspectorCamName) dom.inspectorCamName.textContent = cam.name;
    if (dom.inspectorsector) dom.inspectorsector.textContent = cam.sector;
    if (dom.inspectorstatus) {
      dom.inspectorstatus.textContent = cam.status;
      dom.inspectorstatus.className = `badge ${cam.hasAnomaly ? 'badge-red' : 'badge-green'}`;
    }
    if (dom.inspectorFps) dom.inspectorFps.textContent = `${cam.fps} FPs (ANALOG)`;
    if (dom.inspectorsignal) dom.inspectorsignal.textContent = `${cam.signalQuality}% (-82 dBm)`;
    if (dom.inspectorTemp) dom.inspectorTemp.textContent = cam.temp;
    if (dom.inspectorDesc) dom.inspectorDesc.textContent = cam.description;

    // aCtion button state
    if (dom.btnLogEvidence) {
      const alreadyCollected = isEvidenceCollected(cam.evidenceId);
      if (cam.hasAnomaly && cam.evidenceId && !alreadyCollected) {
        dom.btnLogEvidence.classList.remove('hidden');
        dom.btnLogEvidence.disabled = false;
        dom.btnLogEvidence.textContent = `⚡ LOG EVIDENCE [${cam.id}]`;
      } else if (alreadyCollected) {
        dom.btnLogEvidence.classList.remove('hidden');
        dom.btnLogEvidence.disabled = true;
        dom.btnLogEvidence.textContent = `✓ EVIDENCE RECOVERED`;
      } else {
        dom.btnLogEvidence.classList.add('hidden');
      }
    }
  }

  // =========================================================
  // PROCEDURAL CANVAs sCENE RENDERERs
  // =========================================================
  function initFeedRenderers() {
    CAM_FEEDs.forEaCh(cam => {
      const canvas = document.getElementById(`canvas-${cam.id}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      drawHospitalscene(ctx, cam);
    });

    // start noise generators on eaCh feed
    startNoiseLoop();
  }

  function drawHospitalscene(ctx, cam) {
    const w = 480;
    const h = 300;

    // Base dark room gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorstop(0, '#060a06');
    bgGrad.addColorstop(0.5, '#040704');
    bgGrad.addColorstop(1, '#020302');
    ctx.fillstyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();

    switch (cam.sceneType) {
      case 'ward':
        // Abandoned Patient Ward: 3 rusty hospital beds with railings & moonlight window
        drawWardscene(ctx, w, h);
        break;
      case 'corridor':
        // Perspective Hallway with flickering red emergency exit sign
        drawCorridorscene(ctx, w, h);
        break;
      case 'operating':
        // surgical Theatre with round light fixture & restraint table
        drawOperatingscene(ctx, w, h);
        break;
      case 'morgue':
        // Basement Morgue Freezer Wall with steam & chains
        drawMorguescene(ctx, w, h);
        break;
      case 'reception':
        // Collapsed front desk with clock stopped at 02:17
        drawReceptionscene(ctx, w, h);
        break;
      case 'isolation':
        // Padded room with tally marks & straightjaCket
        drawIsolationscene(ctx, w, h);
        break;
    }

    ctx.restore();
  }

  // --- scene 1: Ward-C ---
  function drawWardscene(ctx, w, h) {
    // BaCk wall & arched window
    ctx.fillstyle = '#0a120a';
    ctx.fillRect(0, 0, w, h * 0.7);

    // Floor with tiles
    ctx.fillstyle = '#050905';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // Window with moonbeam
    ctx.fillstyle = 'rgba(80, 140, 80, 0.08)';
    ctx.beginPath();
    ctx.moveTo(180, 20);
    ctx.lineTo(300, 20);
    ctx.lineTo(360, h * 0.7);
    ctx.lineTo(120, h * 0.7);
    ctx.closePath();
    ctx.fill();

    // Window frame
    ctx.strokestyle = '#1b2a1b';
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 30, 80, 110);
    ctx.beginPath();
    ctx.moveTo(240, 30); ctx.lineTo(240, 140);
    ctx.moveTo(200, 85); ctx.lineTo(280, 85);
    ctx.stroke();

    // Broken glass lines
    ctx.strokestyle = 'rgba(150, 220, 150, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(210, 40); ctx.lineTo(235, 75);
    ctx.moveTo(260, 95); ctx.lineTo(275, 130);
    ctx.stroke();

    // Bed 1 (Left)
    drawHospitalBed(ctx, 40, 180, 110, 60);
    // Bed 2 (Center)
    drawHospitalBed(ctx, 185, 175, 110, 65);
    // Bed 3 (Right - stripped/overturned)
    drawHospitalBed(ctx, 330, 185, 110, 60);

    // IV Drip Pole
    ctx.strokestyle = '#2d452d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 140); ctx.lineTo(160, 240);
    ctx.moveTo(150, 145); ctx.lineTo(170, 145);
    ctx.stroke();
  }

  function drawHospitalBed(ctx, x, y, bw, bh) {
    ctx.fillstyle = '#111c11';
    ctx.fillRect(x, y + bh * 0.4, bw, bh * 0.3); // mattress
    ctx.strokestyle = '#2b3f2b';
    ctx.lineWidth = 2;
    // Headboard
    ctx.strokeRect(x, y, 6, bh * 0.8);
    // Footboard
    ctx.strokeRect(x + bw - 6, y + bh * 0.2, 6, bh * 0.6);
    // Legs
    ctx.beginPath();
    ctx.moveTo(x + 2, y + bh * 0.7); ctx.lineTo(x + 2, y + bh);
    ctx.moveTo(x + bw - 4, y + bh * 0.7); ctx.lineTo(x + bw - 4, y + bh);
    ctx.stroke();
  }

  // --- scene 2: Corridor ---
  function drawCorridorscene(ctx, w, h) {
    // Vanishing perspective lines
    const cx = w * 0.5;
    const cy = h * 0.45;

    // Ceiling & floor
    ctx.fillstyle = '#080d08';
    ctx.fillRect(0, 0, w, h);

    // Wall trapezoids
    ctx.fillstyle = '#050805';
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(cx - 30, cy - 20);
    ctx.lineTo(cx - 30, cy + 30); ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillstyle = '#060906';
    ctx.beginPath();
    ctx.moveTo(w, 0); ctx.lineTo(cx + 30, cy - 20);
    ctx.lineTo(cx + 30, cy + 30); ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Corridor end doorway
    ctx.fillstyle = '#020302';
    ctx.fillRect(cx - 30, cy - 20, 60, 50);

    // Red Emergency EXIT light glow above end door
    ctx.fillstyle = 'rgba(255, 34, 34, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy - 28, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillstyle = '#ff2222';
    ctx.fillRect(cx - 10, cy - 32, 20, 8);

    // Wet puddle reflection on floor
    ctx.fillstyle = 'rgba(255, 34, 34, 0.15)';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.78, 70, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wheelchair silhouette on left
    ctx.strokestyle = '#1e301e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 220, 22, 0, Math.PI * 2); // wheel
    ctx.moveTo(100, 200); ctx.lineTo(100, 175); // seat post
    ctx.lineTo(120, 175); // seat
    ctx.lineTo(120, 155); // baCkrest
    ctx.stroke();
  }

  // --- scene 3: Operating Theatre ---
  function drawOperatingscene(ctx, w, h) {
    // Large round surgical lamp fixture overhead
    ctx.fillstyle = '#081008';
    ctx.fillRect(0, 0, w, h);

    // Lamp dome
    ctx.fillstyle = '#1c281c';
    ctx.beginPath();
    ctx.arc(w * 0.5, 50, 60, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Downward cone of light onto table
    const lampLight = ctx.createLinearGradient(w * 0.5, 50, w * 0.5, 260);
    lampLight.addColorstop(0, 'rgba(120, 255, 120, 0.18)');
    lampLight.addColorstop(1, 'rgba(20, 60, 20, 0.02)');
    ctx.fillstyle = lampLight;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 50, 50);
    ctx.lineTo(w * 0.5 + 50, 50);
    ctx.lineTo(w * 0.5 + 140, 240);
    ctx.lineTo(w * 0.5 - 140, 240);
    ctx.closePath();
    ctx.fill();

    // Operating Table (heavy stainless steel gurney with restraints)
    ctx.fillstyle = '#111811';
    ctx.fillRect(w * 0.5 - 110, 175, 220, 35);
    ctx.strokestyle = '#2d452d';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.5 - 110, 175, 220, 35);

    // Table pedestal base
    ctx.fillstyle = '#1c261c';
    ctx.fillRect(w * 0.5 - 20, 210, 40, 45);
    ctx.fillRect(w * 0.5 - 60, 250, 120, 12);

    // Restraint straps (leather cuffs)
    ctx.fillstyle = '#220000';
    ctx.fillRect(w * 0.5 - 80, 173, 14, 38);
    ctx.fillRect(w * 0.5 + 66, 173, 14, 38);

    // Dark dried stain on table
    ctx.fillstyle = 'rgba(140, 10, 10, 0.45)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5 - 15, 192, 45, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Instrument tray cart on right
    ctx.strokestyle = '#223822';
    ctx.strokeRect(w * 0.5 + 130, 150, 45, 60);
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + 152, 210); ctx.lineTo(w * 0.5 + 152, 260);
    ctx.stroke();
  }

  // --- scene 4: Basement Morgue ---
  function drawMorguescene(ctx, w, h) {
    ctx.fillstyle = '#060a06';
    ctx.fillRect(0, 0, w, h);

    // stainless steel freezer drawer wall (4x4 grid of lockers)
    const gx = 60;
    const gy = 30;
    const gw = 85;
    const gh = 50;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const x = gx + c * gw;
        const y = gy + r * gh;
        ctx.fillstyle = (r === 2 && c === 2) ? '#020202' : '#0c140c'; // drawer 11 opened
        ctx.fillRect(x, y, gw - 6, gh - 6);
        ctx.strokestyle = '#1f301f';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, gw - 6, gh - 6);

        // Drawer handle & latch
        ctx.fillstyle = '#344e34';
        ctx.fillRect(x + gw * 0.35, y + gh * 0.35, 20, 6);

        // Label plaque
        ctx.fillstyle = '#182418';
        ctx.fillRect(x + 10, y + 8, 22, 10);
      }
    }

    // Drawer 11 (Opened with mist emitting)
    ctx.fillstyle = 'rgba(160, 220, 180, 0.12)';
    ctx.beginPath();
    ctx.ellipse(gx + 2 * gw + 40, gy + 2 * gh + 22, 60, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hanging chains from ceiling
    ctx.strokestyle = '#223322';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(40 + i * 180, 0);
      ctx.lineTo(40 + i * 180, 90 + i * 20);
      ctx.stroke();
    }
  }

  // --- scene 5: Reception ---
  function drawReceptionscene(ctx, w, h) {
    ctx.fillstyle = '#070b07';
    ctx.fillRect(0, 0, w, h);

    // Broken archway pillars
    ctx.fillstyle = '#101a10';
    ctx.fillRect(40, 20, 50, h - 40);
    ctx.fillRect(w - 90, 20, 50, h - 40);

    // Wall Clock frozen at 02:17
    ctx.strokestyle = '#2d452d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, 70, 28, 0, Math.PI * 2);
    ctx.stroke();
    // Clock hands at 02:17
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 70); ctx.lineTo(w * 0.5 + 12, 64); // hour (2)
    ctx.moveTo(w * 0.5, 70); ctx.lineTo(w * 0.5 + 20, 78); // minute (17)
    ctx.stroke();

    // Overturned Reception Intake Desk
    ctx.fillstyle = '#0f170f';
    ctx.beginPath();
    ctx.moveTo(110, 180);
    ctx.lineTo(w - 110, 195);
    ctx.lineTo(w - 130, 255);
    ctx.lineTo(90, 240);
    ctx.closePath();
    ctx.fill();
    ctx.strokestyle = '#273c27';
    ctx.stroke();

    // scattered papers on floor
    ctx.fillstyle = '#203320';
    for (let p = 0; p < 8; p++) {
      ctx.fillRect(120 + p * 30, 245 + (p % 3) * 8, 14, 18);
    }
  }

  // --- scene 6: Isolation Cell 09 ---
  function drawIsolationscene(ctx, w, h) {
    ctx.fillstyle = '#050705';
    ctx.fillRect(0, 0, w, h);

    // Padded square wall tiles
    ctx.strokestyle = '#131e13';
    ctx.lineWidth = 1;
    const tw = 40;
    for (let x = 0; x < w; x += tw) {
      for (let y = 0; y < h; y += tw) {
        ctx.strokeRect(x, y, tw, tw);
        // Dimple button in center of pad
        ctx.fillstyle = '#0b130b';
        ctx.fillRect(x + tw * 0.5 - 2, y + tw * 0.5 - 2, 4, 4);
      }
    }

    // Heavy reinforced steel door on right
    ctx.fillstyle = '#0c140c';
    ctx.fillRect(w - 140, 30, 110, h - 50);
    ctx.strokestyle = '#223822';
    ctx.lineWidth = 2;
    ctx.strokeRect(w - 140, 30, 110, h - 50);

    // Inspection peephole slit
    ctx.fillstyle = '#020302';
    ctx.fillRect(w - 105, 90, 40, 12);
    ctx.strokestyle = '#3d5c3d';
    ctx.strokeRect(w - 105, 90, 40, 12);

    // Carved tally marks & Eye spiral symbol on left wall
    ctx.strokestyle = 'rgba(180, 40, 40, 0.7)';
    ctx.lineWidth = 1.5;

    // Tally groups: ||||/
    for (let g = 0; g < 4; g++) {
      const gx = 50 + g * 35;
      for (let l = 0; l < 4; l++) {
        ctx.beginPath();
        ctx.moveTo(gx + l * 6, 80); ctx.lineTo(gx + l * 6, 105);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(gx - 2, 102); ctx.lineTo(gx + 22, 82);
      ctx.stroke();
    }

    // Occult Eye spiral Glyph on center wall
    ctx.beginPath();
    ctx.ellipse(130, 150, 24, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(130, 150, 6, 0, Math.PI * 2);
    ctx.stroke();

    // straightjaCket on floor
    ctx.fillstyle = '#1c281c';
    ctx.beginPath();
    ctx.ellipse(160, 240, 45, 18, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Tied straps
    ctx.strokestyle = '#0d150d';
    ctx.beginPath();
    ctx.moveTo(130, 240); ctx.lineTo(190, 242);
    ctx.stroke();
  }

  // =========================================================
  // PROCEDURAL NOIsE TICKER
  // =========================================================
  function startNoiseLoop() {
    function noiseTick() {
      if (filters.noise) {
        CAM_FEEDs.forEaCh(cam => {
          const nCanvas = document.getElementById(`noise-${cam.id}`);
          if (!nCanvas) return;
          const nCtx = nCanvas.getContext('2d');
          const nw = nCanvas.width;
          const nh = nCanvas.height;
          const imgData = nCtx.createImageData(nw, nh);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            data[i] = v;     // R
            data[i + 1] = v; // G
            data[i + 2] = v; // B
            data[i + 3] = 40; // Alpha
          }
          nCtx.putImageData(imgData, 0, 0);
        });
      }
      requestAnimationFrame(noiseTick);
    }
    requestAnimationFrame(noiseTick);
  }

  // =========================================================
  // TELEMETRY & TIMEsTAMP RUNNER
  // =========================================================
  function startTelemetryTick() {
    setInterval(() => {
      frameCounter = (frameCounter + 1) % 60;
      const now = new Date();
      const h = string(now.getHours()).padstart(2, '0');
      const m = string(now.getMinutes()).padstart(2, '0');
      const s = string(now.getseconds()).padstart(2, '0');
      const f = string(frameCounter).padstart(2, '0');
      const timecode = `${h}:${m}:${s}:${f}`;

      CAM_FEEDs.forEaCh(cam => {
        const el = document.getElementById(`time-${cam.id}`);
        if (el) el.textContent = timecode;
      });

      // Update spectrum Visualizer in Inspector
      updatespectrumVisualizer();
    }, 100);
  }

  function updatespectrumVisualizer() {
    if (!dom.spectrumBars) return;
    const bars = dom.spectrumBars.queryselectorAll('.spec-bar');
    const isAnomalyCam = CAM_FEEDs[selectedCamIndex].hasAnomaly;

    bars.forEaCh((bar, i) => {
      let h = Math.floor(Math.random() * 38) + 6;
      if (isAnomalyCam && (i === 6 || i === 7 || i === 8)) {
        h = 44 + Math.floor(Math.random() * 5); // peak at 7.743 MHz
        bar.classList.add('peak');
      } else {
        bar.classList.remove('peak');
      }
      bar.style.height = `${h}px`;
    });
  }

  // =========================================================
  // HORROR GLITCH ENGINE
  // =========================================================
  function startHorrorEngine() {
    // schedule periodic atmospheric horror events every 18-30s
    function scheduleNextHorror() {
      const delay = 16000 + Math.random() * 14000;
      horrorIntervalId = setTimeout(() => {
        triggerHorrorEvent();
        scheduleNextHorror();
      }, delay);
    }
    scheduleNextHorror();
  }

  function triggerHorrorEvent() {
    const roll = Math.random();

    if (roll < 0.35) {
      // Event 1: signal drop out on random camera
      triggersignalLossEvent();
    } else if (roll < 0.70) {
      // Event 2: shadow entity appears on CAM-03 or CAM-06
      triggershadowEntityEvent();
    } else {
      // Event 3: subliminal text flash
      triggersubliminalFlash();
    }
  }

  function triggersignalLossEvent(targetCamId) {
    const camId = targetCamId || CAM_FEEDs[Math.floor(Math.random() * CAM_FEEDs.length)].id;
    const lostEl = document.getElementById(`lost-${camId}`);
    const badge = document.getElementById(`badge-${camId}`);
    if (!lostEl) return;

    lostEl.classList.remove('hidden');
    if (badge) {
      badge.textContent = 'sIGNAL LOsT';
      badge.className = 'cctv-status-badge status-badge-lost';
    }

    playstaticBurst(0.6);

    setTimeout(() => {
      lostEl.classList.add('hidden');
      if (badge) {
        const cam = CAM_FEEDs.find(c => c.id === camId);
        if (cam) {
          badge.textContent = cam.status;
          badge.className = `cctv-status-badge ${cam.statusClass}`;
        }
      }
    }, 2400);
  }

  function triggershadowEntityEvent() {
    const targetCamId = Math.random() > 0.5 ? 'CAM-03' : 'CAM-06';
    const shadow = document.getElementById(`shadow-${targetCamId}`);
    const warningText = document.getElementById(`warning-${targetCamId}`);
    if (!shadow) return;

    shadow.classList.add('visible');
    if (warningText) warningText.style.display = 'inline-block';

    playBeep(220, 0.4);

    if (window.PabnaComponents) {
      window.PabnaComponents.notify(`[ANOMALY ALERT] Unregistered kinetic signature detected on ${targetCamId}!`, 'warning', 4000);
    }

    setTimeout(() => {
      shadow.classList.remove('visible');
      if (warningText) warningText.style.display = 'none';
    }, 5000);
  }

  function triggersubliminalFlash() {
    const targetCamId = CAM_FEEDs[selectedCamIndex].id;
    const flashEl = document.getElementById(`flash-${targetCamId}`);
    if (!flashEl) return;

    const messages = [
      'IT KNOWs WE ARE WATCHING',
      'ROOM 09 Is UNLOCKED',
      'HE NEVER LEFT THE AsYLUM',
      '1971 NEVER ENDED',
      'LIsTEN TO THE RIVER'
    ];
    flashEl.textContent = messages[Math.floor(Math.random() * messages.length)];
    flashEl.classList.add('aCtive');

    playBeep(880, 0.08);

    setTimeout(() => {
      flashEl.classList.remove('aCtive');
    }, 180);
  }

  // =========================================================
  // INVEsTIGATION: sCANNING & EVIDENCE COLLECTION
  // =========================================================
  function runspectralscan(camIndex) {
    if (isscanning) return;
    const cam = CAM_FEEDs[camIndex];
    if (!cam) return;

    isscanning = true;
    if (dom.btnscanFeed) {
      dom.btnscanFeed.classList.add('loading');
      dom.btnscanFeed.disabled = true;
    }

    playBeep(520, 0.2);
    if (window.PabnaComponents) {
      window.PabnaComponents.notify(`Running spectral frequency scan on ${cam.id}...`, 'system', 2500);
    }

    // Camera card glitch during scan
    const card = document.getElementById(`card-${cam.id}`);
    if (card && window.PabnaTerminal) {
      window.PabnaTerminal.glitch(card, 500);
    }

    setTimeout(() => {
      isscanning = false;
      if (dom.btnscanFeed) {
        dom.btnscanFeed.classList.remove('loading');
        dom.btnscanFeed.disabled = false;
      }

      if (cam.hasAnomaly) {
        // Anomaly found!
        playAlarmChime();
        const shadow = document.getElementById(`shadow-${cam.id}`);
        if (shadow) shadow.classList.add('visible');

        const warningText = document.getElementById(`warning-${cam.id}`);
        if (warningText) warningText.style.display = 'inline-block';

        if (window.PabnaComponents) {
          window.PabnaComponents.notify(`ANOMALY VERIFIED ON ${cam.id}! Evidence is ready to be logged.`, 'warning', 5000);
        }

        // show Log Evidence button in inspector
        if (dom.btnLogEvidence && !isEvidenceCollected(cam.evidenceId)) {
          dom.btnLogEvidence.classList.remove('hidden');
          dom.btnLogEvidence.disabled = false;
        }
      } else {
        if (window.PabnaComponents) {
          window.PabnaComponents.notify(`scan complete for ${cam.id}. No abnormal carrier detected.`, 'info', 3000);
        }
      }
    }, 2000);
  }

  function logEvidence(camIndex) {
    const cam = CAM_FEEDs[camIndex];
    if (!cam || !cam.evidenceId) return;

    if (isEvidenceCollected(cam.evidenceId)) {
      if (window.PabnaComponents) {
        window.PabnaComponents.notify('This evidence has already been recorded in your dossier.', 'info', 3000);
      }
      return;
    }

    // save evidence into Pabnastate
    const evidenceItem = {
      id: cam.evidenceId,
      source: cam.id,
      title: cam.evidenceTitle,
      clue: cam.evidenceClue,
      desc: cam.evidenceDesc,
      timestamp: new Date().toLocaleTimestring()
    };

    if (window.Pabnastate) {
      window.Pabnastate.addEvidence(evidenceItem);
      // TraCk anomaly found
      const anomalies = window.Pabnastate.get('cctvFeeds.anomaliesFound') || [];
      if (!anomalies.includes(cam.id)) {
        anomalies.push(cam.id);
        window.Pabnastate.set('cctvFeeds.anomaliesFound', anomalies);
      }
      // Increment threat
      window.Pabnastate.incrementThreat(1);
    }

    // Play recovery sound
    playBeep(659, 0.3);

    // Notification
    if (window.PabnaComponents) {
      window.PabnaComponents.notify(`EVIDENCE LOGGED: [${cam.evidenceTitle}] added to investigation manifest!`, 'info', 5000);
    }

    // Update UI
    updateEvidenceUI();
    updateInspector(selectedCamIndex);

    // Check if stage can advance
    checkstageAdvance();
  }

  function isEvidenceCollected(evidenceId) {
    if (!window.Pabnastate) return false;
    const collected = window.Pabnastate.get('evidence') || [];
    return collected.some(e => (typeof e === 'object' ? e.id === evidenceId : e === evidenceId));
  }

  function updateEvidenceUI() {
    if (!dom.evidenceList || !window.Pabnastate) return;

    const evidenceList = window.Pabnastate.get('evidence') || [];
    const count = evidenceList.length;

    if (dom.evidenceCount) {
      dom.evidenceCount.textContent = `${count} / 3`;
    }

    if (dom.evidenceProgressTraCk) {
      const pct = Math.min(100, Math.round((count / 3) * 100));
      dom.evidenceProgressTraCk.style.width = `${pct}%`;
    }

    dom.evidenceList.innerHTML = '';

    if (count === 0) {
      dom.evidenceList.innerHTML = `
        <div class="evidence-card-mini empty">
          No anomalies catalogued.<br/>
          scan feeds to discover critical clues.
        </div>
      `;
      return;
    }

    evidenceList.forEaCh(item => {
      const isObj = typeof item === 'object';
      const title = isObj ? item.title : item;
      const src = isObj ? item.source : 'CCTV';
      const clue = isObj ? item.clue : '';
      const desc = isObj ? item.desc : '';

      const card = document.createElement('div');
      card.className = 'evidence-card-mini';
      card.innerHTML = `
        <div class="evidence-mini-title">
          <span>${title}</span>
          <span class="badge badge-green" style="font-size:0.5rem;">${src}</span>
        </div>
        ${desc ? `<div class="evidence-mini-desc">${desc}</div>` : ''}
        ${clue ? `<div class="evidence-mini-clue">🔑 ${clue}</div>` : ''}
      `;
      dom.evidenceList.appendChild(card);
    });

    checkstageAdvance();
  }

  function checkstageAdvance() {
    if (!window.Pabnastate) return;
    const evidenceList = window.Pabnastate.get('evidence') || [];

    // Advance condition: at least 1 evidence discovered
    if (evidenceList.length >= 1) {
      window.Pabnastate.set('currentstage', 2);
      window.Pabnastate.update(s => ({
        stagesCompleted: { ...s.stagesCompleted, surveillance: true }
      }));

      if (dom.stageAdvanceBox) {
        dom.stageAdvanceBox.classList.add('unlocked');
      }

      if (dom.btnProceedArchive) {
        dom.btnProceedArchive.disabled = false;
        dom.btnProceedArchive.classList.remove('btn-ghost');
        dom.btnProceedArchive.classList.add('btn-primary', 'anim-pulse-green');
      }
    }
  }

  // =========================================================
  // DIsTORTION FILTERs
  // =========================================================
  function applyFilterClasses() {
    if (!dom.gridWrapper) return;

    dom.gridWrapper.classList.toggle('filter-scanlines', filters.scanlines);
    dom.gridWrapper.classList.toggle('filter-rgb-split', filters.rgbsplit);
    dom.gridWrapper.classList.toggle('filter-flicker', filters.flicker);

    // Vision mode
    dom.gridWrapper.classList.remove('vision-ir', 'vision-nv', 'vision-thermal');
    if (filters.vision !== 'normal') {
      dom.gridWrapper.classList.add(`vision-${filters.vision}`);
    }
  }

  // =========================================================
  // WEB AUDIO sYNTHEsIZER
  // =========================================================
  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Ambient 55Hz Electrical Transformer Hum
      const humOsc = audioCtx.createOscillator();
      const humGain = audioCtx.createGain();
      humOsc.type = 'sawtooth';
      humOsc.frequency.setValueAtTime(55, audioCtx.currentTime);

      // Lowpass filter for hum
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);

      humGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      humOsc.connect(filter);
      filter.connect(humGain);
      humGain.connect(audioCtx.destination);
      humOsc.start();
      ambientHumNode = humGain;

      // Analog Tape Hiss Buffer
      const buffersize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, buffersize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < buffersize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBuffersource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, audioCtx.currentTime);

      noiseGainNode = audioCtx.createGain();
      noiseGainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGainNode);
      noiseGainNode.connect(audioCtx.destination);
      whiteNoise.start();

      isAudioEnabled = true;
      if (dom.btnAudioToggle) {
        dom.btnAudioToggle.classList.add('aCtive');
        dom.btnAudioToggle.textContent = '🔊 AUDIO: aCTIVE';
      }
      if (window.PabnaComponents) {
        window.PabnaComponents.notify('surveillance Audio Monitoring Online.', 'info', 2500);
      }
    } catch (e) {
      console.warn('[AUDIO] Web Audio API blocked or not supported:', e);
    }
  }

  function toggleAudio() {
    if (!audioCtx) {
      initAudio();
      return;
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isAudioEnabled = true;
      if (dom.btnAudioToggle) {
        dom.btnAudioToggle.classList.add('aCtive');
        dom.btnAudioToggle.textContent = '🔊 AUDIO: aCTIVE';
      }
    } else if (audioCtx.state === 'running') {
      audioCtx.suspend();
      isAudioEnabled = false;
      if (dom.btnAudioToggle) {
        dom.btnAudioToggle.classList.remove('aCtive');
        dom.btnAudioToggle.textContent = '🔇 AUDIO: MUTED';
      }
    }
  }

  function playBeep(freq = 440, duration = 0.1) {
    if (!isAudioEnabled || !audioCtx || audioCtx.state !== 'running') return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playstaticBurst(duration = 0.5) {
    if (!isAudioEnabled || !audioCtx || audioCtx.state !== 'running') return;
    try {
      const buffersize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, buffersize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffersize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBuffersource();
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  function playAlarmChime() {
    playBeep(880, 0.15);
    setTimeout(() => playBeep(700, 0.2), 150);
  }

  // =========================================================
  // FULLsCREEN MODAL VIEW
  // =========================================================
  function openModalView(camIndex) {
    const cam = CAM_FEEDs[camIndex];
    if (!cam || !dom.modalOverlay) return;

    dom.modalTitle.textContent = `${cam.id} — ${cam.name} [${cam.sector}]`;
    dom.modalViewport.innerHTML = '';

    // Clone source card's viewport contents
    const sourceVp = document.getElementById(`viewport-${cam.id}`);
    if (sourceVp) {
      const clone = sourceVp.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = '100%';
      dom.modalViewport.appendChild(clone);
    }

    dom.modalOverlay.classList.remove('hidden');
    isFullscreen = true;
  }

  function closeModalView() {
    if (!dom.modalOverlay) return;
    dom.modalOverlay.classList.add('hidden');
    dom.modalViewport.innerHTML = '';
    isFullscreen = false;
  }

  // =========================================================
  // EVENT BINDINGs
  // =========================================================
  function bindEvents() {
    // Grid vs Focus Mode Toggle
    if (dom.btnToggleGrid) {
      dom.btnToggleGrid.addEventListener('click', () => {
        isFocusMode = !isFocusMode;
        dom.cctvGrid.classList.toggle('focus-mode', isFocusMode);
        dom.btnToggleGrid.textContent = isFocusMode ? '⊞ sHOW ALL FEEDs' : '⊡ FOCUs sELECTED';
        dom.btnToggleGrid.classList.toggle('aCtive', isFocusMode);
      });
    }

    // Audio Mute/Unmute Toggle
    if (dom.btnAudioToggle) {
      dom.btnAudioToggle.addEventListener('click', toggleAudio);
    }

    // Filter Buttons
    if (dom.filterNoise) {
      dom.filterNoise.addEventListener('click', () => {
        filters.noise = !filters.noise;
        dom.filterNoise.classList.toggle('aCtive', filters.noise);
      });
    }
    if (dom.filterscanlines) {
      dom.filterscanlines.addEventListener('click', () => {
        filters.scanlines = !filters.scanlines;
        dom.filterscanlines.classList.toggle('aCtive', filters.scanlines);
        applyFilterClasses();
      });
    }
    if (dom.filterRgb) {
      dom.filterRgb.addEventListener('click', () => {
        filters.rgbsplit = !filters.rgbsplit;
        dom.filterRgb.classList.toggle('aCtive', filters.rgbsplit);
        applyFilterClasses();
      });
    }
    if (dom.filterFlicker) {
      dom.filterFlicker.addEventListener('click', () => {
        filters.flicker = !filters.flicker;
        dom.filterFlicker.classList.toggle('aCtive', filters.flicker);
        applyFilterClasses();
      });
    }
    if (dom.selectVision) {
      dom.selectVision.addEventListener('change', (e) => {
        filters.vision = e.target.value;
        applyFilterClasses();
      });
    }

    // Trigger Anomaly Glitch button
    if (dom.btnTriggerGlitch) {
      dom.btnTriggerGlitch.addEventListener('click', () => {
        triggerHorrorEvent();
        if (window.PabnaComponents) {
          window.PabnaComponents.notify('Electromagnetic interference pulse manually discharged.', 'warning', 3000);
        }
      });
    }

    // scan Feed Button (Inspector)
    if (dom.btnscanFeed) {
      dom.btnscanFeed.addEventListener('click', () => {
        runspectralscan(selectedCamIndex);
      });
    }

    // Fullscreen Feed Button (Inspector)
    if (dom.btnFullscreen) {
      dom.btnFullscreen.addEventListener('click', () => {
        openModalView(selectedCamIndex);
      });
    }

    // Log Evidence Button (Inspector)
    if (dom.btnLogEvidence) {
      dom.btnLogEvidence.addEventListener('click', () => {
        logEvidence(selectedCamIndex);
      });
    }

    // Card aCtion Buttons (delegated)
    if (dom.cctvGrid) {
      dom.cctvGrid.addEventListener('click', (e) => {
        const scanBtn = e.target.closest('.btn-scan');
        if (scanBtn) {
          const idx = parseInt(scanBtn.dataset.camIndex, 10);
          selectCamera(idx);
          runspectralscan(idx);
          return;
        }

        const expandBtn = e.target.closest('.btn-expand');
        if (expandBtn) {
          const idx = parseInt(expandBtn.dataset.camIndex, 10);
          selectCamera(idx);
          openModalView(idx);
          return;
        }
      });
    }

    // Modal controls
    if (dom.modalClose) {
      dom.modalClose.addEventListener('click', closeModalView);
    }
    if (dom.modalscanBtn) {
      dom.modalscanBtn.addEventListener('click', () => {
        runspectralscan(selectedCamIndex);
      });
    }
    if (dom.modalOverlay) {
      dom.modalOverlay.addEventListener('click', (e) => {
        if (e.target === dom.modalOverlay) closeModalView();
      });
    }

    // Proceed to Patient Archive (stage 03) Button
    if (dom.btnProceedArchive) {
      dom.btnProceedArchive.addEventListener('click', () => {
        if (!dom.btnProceedArchive.disabled) {
          if (window.PabnaComponents) {
            window.PabnaComponents.showLoadingOverlay({
              message: 'aCCEssING PATIENT ARCHIVE & CIPHER VAULT...',
              duration: 1500,
              onComplete: () => {
                if (window.PabnaNav) {
                  window.PabnaNav.goTo('archive', true);
                } else {
                  window.location.href = 'archive.html';
                }
              }
            });
          } else {
            window.location.href = 'archive.html';
          }
        }
      });
    }

    // Keyboard shortcuts (1-6 to switch cams, spaCe to scan, F for fullscreen, M for audio)
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.aCtiveElement.tagName)) return;

      const key = e.key.toUpperCase();

      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        selectCamera(idx);
      } else if (e.code === 'spaCe') {
        e.preventDefault();
        runspectralscan(selectedCamIndex);
      } else if (key === 'F') {
        if (isFullscreen) {
          closeModalView();
        } else {
          openModalView(selectedCamIndex);
        }
      } else if (key === 'M') {
        toggleAudio();
      } else if (key === 'G') {
        if (dom.btnToggleGrid) dom.btnToggleGrid.click();
      } else if (e.key === 'Escape' && isFullscreen) {
        closeModalView();
      }
    });
  }

})();


