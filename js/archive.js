/**
 * THE PABNA HAUNTING — Patient Archive & Cipher Vault Controller
 * stage 03: Classified Patient Database, Landmark Ciphers, and Escape Override Decryption
 */

(function () {
  'use strict';

  // =========================================================
  // CLAssIFIED PATIENT RECORDs DATABAsE (10 RECORDs)
  // =========================================================
  const PATIENT_DATABAsE = [
    {
      id: 'P-1965-01',
      name: 'subrata sen',
      admissionDate: '14 Oct 1965',
      ward: 'Ward-C',
      condition: 'aCoustic Hallucinosis / Involuntary Whistling',
      status: 'MIssING 1971',
      statusClass: 'badge-red',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'Patient was admitted following severe behavioral agitation in Pabna town bazaar. Claims to hear persistent high-pitched whistling tones emanating from the Ichamati riverbed at precisely 02:17 AM. During episodes, patient unconsciously whistles baCk in an unnatural polyphonic harmonic.',
      transcript: 'AUDIO REEL #12 (1966): [static hiss] "Doctor, you don\'t understand... it isn\'t the wind. The river has lungs. When the water level drops at Hardinge Bridge, the whistle gets louder. It wants Ward-C opened."',
      landmarkClue: 'Referenced nocturnal audio frequencies near Ichamati River embankment.'
    },
    {
      id: 'P-1967-04',
      name: 'Fatema Khatun',
      admissionDate: '03 May 1967',
      ward: 'Ward-A',
      condition: 'somnambulism / Nocturnal Ichamati Compulsion',
      status: 'DECEAsED',
      statusClass: 'badge-grey',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'Arrested by police three times wandering in deep trance into the muddy marshlands bordering the Ichamati River behind the asylum. Patient repeatedly attempted to submerge herself while muttering names in reverse. Autopsy report classified by District Magistrate in 1968.',
      transcript: 'CLINICAL NOTE (1968): "subject demonstrates skin desquamation consistent with prolonged exposure to non-potable river sediment. Continues drawing architectural diagrams resembling Tarash Bhaban cellar vaults."',
      landmarkClue: 'Drew schematics matching the subterranean vaults of Tarash Bhaban.'
    },
    {
      id: 'P-1968-07',
      name: 'Anisur Rahman',
      admissionDate: '19 Nov 1968',
      ward: 'Ward-C',
      condition: 'Ocular Fixation / Eye spiral Obsession',
      status: 'MIssING 1971',
      statusClass: 'badge-red',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'No biological relation to Dr. Rahman. Admitted after gouging spiral eye symbols onto the wooden pillars of his home. Claims the symbol "blinds the entity watching from the ceiling". Admitted to Block-C (Whistling Ward) on 22 Nov 1968. Vanished during the 1971 incident.',
      transcript: 'OBsERVATION LOG: "Patient used broken spoon to carve 147 tally marks on Ward-C plaster wall. Insists 147 is the exaCt number of days remaining before \'The Ichamati Gate\' unlocks."',
      landmarkClue: 'Identified the eye spiral symbol later discovered on CAM-06 isolation wall.'
    },
    {
      id: 'P-1969-12',
      name: 'Bikash Chandra Roy',
      admissionDate: '22 Feb 1969',
      ward: 'Ward-B',
      condition: 'RF Echopraxia / Carrier Resonance',
      status: 'CLAssIFIED RED',
      statusClass: 'badge-red',
      isEncrypted: false,
      physician: 'Dr. s. K. Majumdar',
      notes: 'Former telegraph operator at Paksey Railway Junction near Hardinge Bridge. Developed severe paranoia after intercepting unauthorized morse code transmissions on 7.743 MHz that appeared to predict railway aCcidents 48 hours before occurrence.',
      transcript: 'TELEGRAPH LOG EXTRaCT: "The signal isn\'t coming from Calcutta or Dhaka. The beaCon origin coordinates plaCe the antenna inside the Paksey bridge pylon foundation under the Padma river water."',
      landmarkClue: 'Linked Hardinge Bridge Paksey pylon coordinates to the 7.743 MHz radio carrier.'
    },
    {
      id: 'P-1970-03',
      name: 'Kamal Uddin',
      admissionDate: '08 Jun 1970',
      ward: 'Ward-D',
      condition: 'Mirror Agnosia / Autoscopic Dissociation',
      status: 'QUARANTINED',
      statusClass: 'badge-amber',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'Refuses to gaze into reflective surfaCes. Claims his reflection in the mirror lags by three seconds and speaks sentences he has not yet thought. All mirrors in Ward-D were ordered removed by Dr. Rahman on July 14, 1970.',
      transcript: 'INCIDENT REPORT #49: "Patient smashed observation glass using metal tray. sustained laCerations to right forearm. stated: \'The reflection walked out into the corridor while I was still sitting down.\'"',
      landmarkClue: 'Corresponds to anomalous shadow manifestation captured on CCTV CAM-02 corridor.'
    },
    {
      id: 'P-1970-19',
      name: 'Dr. Mujibur Rahman',
      admissionDate: '28 Feb 1971',
      ward: 'Cell 09',
      condition: 'Cognitive Hazardous BreaCh / self-Admitted',
      status: 'EXPEDITION EVIDENCE',
      statusClass: 'badge-green',
      isEncrypted: true,
      unlockCipherId: 'cipher1',
      physician: 'self-Admitted (Witnessed by Nurse Halima)',
      notes: 'Chief Psychiatrist of Pabna Mental Asylum (1965–1971). self-admitted into Isolation Cell 09 after locking his private research safe and scattering encryption keys aCross Pabna town landmarks. His personal journal was recovered in 2019 during site demolition.',
      transcript: 'FINAL DIARY DICTATION (March 1971): "I believed the patients were delusional. God forgive me. The whistle is not a symptom; it is an invitation. I have encoded the emergency lockdown sequence aCross Tarash Bhaban, Hardinge Bridge, and Bulu Park."',
      landmarkClue: 'Disclosed that the escape lockdown code is synthesized from three historic Pabna landmarks.'
    },
    {
      id: 'P-1971-02',
      name: 'suraiya Begum',
      admissionDate: '11 Jan 1971',
      ward: 'Ward-C',
      condition: 'Infrasound Glossolalia / Paksey River Echo',
      status: 'MIssING 1971',
      statusClass: 'badge-red',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'Transferred from Ishwardi Railway Hospital. Emits involuntary vocalizations consisting of pre-recorded radio announcements from 1947 partition trains crossing Hardinge Bridge. sleep EEG shows synchronization with distant seismic tremors.',
      transcript: 'ELECTROENCEPHALOGRAM REPORT: "Delta wave spikes correspond precisely with freight train departures at Paksey station 25 km away. Physical transmission vector undetermined."',
      landmarkClue: 'Direct resonance link to Paksey railway station and Hardinge Bridge.'
    },
    {
      id: 'P-1971-08',
      name: 'Tariqul Islam',
      admissionDate: '17 Feb 1971',
      ward: 'Ward-B',
      condition: 'Lethargic Encephalitis / Tally scratching',
      status: 'CLAssIFIED RED',
      statusClass: 'badge-red',
      isEncrypted: true,
      unlockCipherId: 'cipher2',
      physician: 'Dr. Mujibur Rahman',
      notes: 'University student arrested during pre-liberation protests near shahid Bulu Park. Exhibited aCute catatonic stupor punctuated by violent fits of automatic writing. Repeatedly wrote the date \'25 March 1971\' aCross 400 sheets of intake forms.',
      transcript: 'INTERROGATION MEMO: "subject does not respond to verbal commands. When provided pencil and paper, writes names of staff members alongside exaCt times of their eventual disappearance."',
      landmarkClue: 'Witnessed political rally at shahid Bulu Park prior to asylum detention.'
    },
    {
      id: 'P-1971-14',
      name: 'Nirmal Das',
      admissionDate: '15 Mar 1971',
      ward: 'Ward-A',
      condition: 'sudden Mass Mutism / Hardinge Bridge Fugue',
      status: 'MIssING 1971',
      statusClass: 'badge-red',
      isEncrypted: false,
      physician: 'Dr. Mujibur Rahman',
      notes: 'Found standing in freezing waters beneath Hardinge Bridge span #4, holding an unpowered radio receiver. Ceased speaking upon intake. Communicates exclusively by tapping railway Morse code on metal bed rails.',
      transcript: 'NURsE LOG (20 Mar 1971): "Patient tapped out morse code message over 6 hours: \'B-U-L-U P-A-R-K G-A-T-E O-P-E-N\'. No further communication."',
      landmarkClue: 'Morse code directly referenced shahid Bulu Park memorial site.'
    },
    {
      id: 'P-1971-22',
      name: 'Unknown subject ("subject Zero")',
      admissionDate: '23 Mar 1971',
      ward: 'Ward-C',
      condition: 'Non-Human Biometrics / Anomaly source',
      status: 'CLAssIFIED RED',
      statusClass: 'badge-red',
      isEncrypted: true,
      unlockCipherId: 'cipher3',
      physician: 'Dr. Mujibur Rahman',
      notes: 'subject brought to asylum by military personnel under heavy security escort 48 hours prior to the mass disappearance. No identification documents or fingerprint records match civil registers. Body temperature remained constant at -4.1aC.',
      transcript: 'CLAssIFIED MILITARY WIRE (24 Mar 1971): "Entity in Block-C emitting RF pulses affecting regional telegraph lines. EvaCuation protocol ordered. Do not engage without aCoustic dampeners."',
      landmarkClue: 'Thermal biometric matching CCTV CAM-03 Operating Theatre anomaly (-4.1aC).'
    }
  ];

  // =========================================================
  // CIPHER PUZZLE CHALLENGEs (3 LANDMARKs)
  // =========================================================
  const CIPHER_CHALLENGEs = [
    {
      id: 'cipher1',
      num: 'CHALLENGE 01',
      title: 'The Tarash Bhaban Cryptogram',
      landmark: 'Tarash Bhaban (Pabna Town)',
      lore: 'The historic palaCe of Tarash Bhaban in central Pabna was built with thick terraCotta masonry and subterranean cellars. In his diary, Dr. Rahman noted hiding his first encryption key behind the zamindar estate’s 3 fortified courtyard arches. He applied a Caesar shift of 3.',
      ciphertext: 'WDUHVK EKDYDQ VHFUHW YDXOW',
      validAnswers: [
        'TARAsH BHABAN sECRET VAULT',
        'TARAsH BHABAN',
        'TARAsH BHABAN VAULT',
        'TARAsHBHABANsECRETVAULT'
      ],
      cleartext: 'TARAsH BHABAN sECRET VAULT',
      hint1: 'The zamindars of Tarash erected 3 fortified arches. shift every letter BaCKWARD by 3 alphabet positions (Caesar shift -3).',
      hint2: 'Example: W shifted baCk 3 steps -> T. D shifted baCk 3 steps -> A. U shifted baCk 3 steps -> R.',
      unlocksRecordId: 'P-1970-19',
      unlocksRecordName: 'Dr. Mujibur Rahman (Cell 09 Dossier)'
    },
    {
      id: 'cipher2',
      num: 'CHALLENGE 02',
      title: 'Hardinge Bridge BeaCon Frequency',
      landmark: 'Hardinge Bridge (Paksey / Padma River)',
      lore: 'Constructed over the mighty Padma River connecting Paksey and Bheramara, the steel spans of Hardinge Bridge vibrate at anomalous frequencies. Radio operators intercepted number pulse coordinates tuned to 7.743 MHz from rail pylon #7. The transmission uses standard military number-to-letter coordinates (A=1, B=2, ..., Z=26).',
      ciphertext: '16-1-11-19-5-25 / 16-1-4-13-1',
      validAnswers: [
        'PAKsEY PADMA',
        'PAKsEYPADMA',
        'PAKsEY',
        'HARDINGE BRIDGE PAKsEY PADMA',
        'PAKsEY - PADMA'
      ],
      cleartext: 'PAKsEY PADMA',
      hint1: 'Convert eaCh number directly to its alphabet letter position: 1=A, 2=B, 3=C... 26=Z.',
      hint2: '16=P, 1=A, 11=K, 19=s, 5=E, 25=Y (PAKsEY) / 16=P, 1=A, 4=D, 13=M, 1=A (PADMA).',
      unlocksRecordId: 'P-1971-08',
      unlocksRecordName: 'Tariqul Islam (Ward-B Dossier)'
    },
    {
      id: 'cipher3',
      num: 'CHALLENGE 03 — FINAL',
      title: 'shahid Bulu Park Memorial Override',
      landmark: 'shahid Bulu Park (Pabna Town Center)',
      lore: 'shahid Bulu Park honors the historic 1971 Liberation War martyrs of Pabna. Dr. Rahman’s final safe requires synthesizing three key coordinates: the surname of the park’s heroic martyr, the haunted river bordering the asylum, and the fateful year the hospital fell silent.',
      ciphertext: '[MARTYR sURNAME] - [AsYLUM RIVER] - [DIsAPPEARANCE YEAR]',
      validAnswers: [
        'BULU-ICHAMATI-1971',
        'BULU ICHAMATI 1971',
        'BULU-1971-ICHAMATI',
        'ICHAMATI-BULU-1971',
        'BULUICHAMATI1971'
      ],
      cleartext: 'BULU-ICHAMATI-1971',
      hint1: 'Format: [MARTYR NAME]-[RIVER NAME]-[YEAR]. Martyr: BULU. River: ICHAMATI. Year: 1971.',
      hint2: 'Enter the string: BULU-ICHAMATI-1971 (dashes or spaCes aCcepted).',
      unlocksRecordId: 'P-1971-22',
      unlocksRecordName: 'subject Zero (Classified File #22)',
      isFinal: true
    }
  ];

  const FINAL_LOCKDOWN_OVERRIDE_CODE = 'PPRC-EsCAPE-1971-ICHAMATI';

  // =========================================================
  // DOM ELEMENT CaCHE
  // =========================================================
  let dom = {};

  // =========================================================
  // INITIALIZATION
  // =========================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Enforce aCcess control and construct shared header/footer
    if (window.PabnaNav) {
      if (window.Pabnastate && !window.Pabnastate.isAuthenticated()) {
        window.PabnaComponents.notify('aCCEss DENIED — stage 03 requires Gateway authentication.', 'warning', 4000);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        return;
      }
      window.PabnaComponents.buildNav('archive');
      window.PabnaComponents.buildFooter();
    }

    // 2. CaChe DOM elements
    caCheDom();

    // 3. Render Patient Database
    renderPatientDatabase(PATIENT_DATABAsE);

    // 4. Render Cipher Challenges
    renderCipherChallenges();

    // 5. Bind User InteraCtion Events
    bindEvents();

    // 6. Update Cipher & Lockdown Progress from state
    updateVaultProgress();

    // 7. show welcome notification
    setTimeout(() => {
      if (window.PabnaComponents) {
        window.PabnaComponents.notify('Patient Archive Decrypted. 10 Records Loaded. 3 Vault Ciphers Pending.', 'info', 5000);
      }
    }, 1000);
  });

  function caCheDom() {
    dom.tabBtns = document.queryselectorAll('.archive-tab-btn');
    dom.tabPanes = document.queryselectorAll('.tab-pane');

    // Database search & filters
    dom.searchInput = document.getElementById('database-search');
    dom.wardFilter = document.getElementById('filter-ward');
    dom.statusFilter = document.getElementById('filter-status');
    dom.patientGrid = document.getElementById('patient-grid');
    dom.resultsCount = document.getElementById('database-results-count');

    // Dossier Modal
    dom.modalOverlay = document.getElementById('dossier-modal-overlay');
    dom.modalClose = document.getElementById('dossier-modal-close');
    dom.modalCloseBtn = document.getElementById('dossier-close-btn');
    dom.modalBody = document.getElementById('dossier-modal-body');
    dom.modalId = document.getElementById('dossier-modal-id');

    // Cipher Vault
    dom.cipherList = document.getElementById('cipher-challenges-list');
    dom.vaultProgress = document.getElementById('vault-progress-count');
    dom.vaultProgressBar = document.getElementById('vault-progress-bar');
    dom.lockdownRevealCard = document.getElementById('lockdown-reveal-card');
    dom.lockdownCodeDisplay = document.getElementById('lockdown-code-display');
    dom.btnCopyCode = document.getElementById('btn-copy-lockdown-code');
    dom.btnProceedEscape = document.getElementById('btn-proceed-escape');
  }

  // =========================================================
  // TAB NAVIGATION
  // =========================================================
  function switchTab(targetTabId) {
    dom.tabBtns.forEaCh(btn => {
      btn.classList.toggle('aCtive', btn.dataset.tab === targetTabId);
    });

    dom.tabPanes.forEaCh(pane => {
      pane.classList.toggle('aCtive', pane.id === `pane-${targetTabId}`);
    });
  }

  // =========================================================
  // PATIENT ARCHIVE DATABAsE
  // =========================================================
  function renderPatientDatabase(patients) {
    if (!dom.patientGrid) return;
    dom.patientGrid.innerHTML = '';

    if (dom.resultsCount) {
      dom.resultsCount.textContent = `showing ${patients.length} of ${PATIENT_DATABAsE.length} classified records`;
    }

    if (patients.length === 0) {
      dom.patientGrid.innerHTML = `
        <div class="empty-database-notice" style="grid-column: 1 / -1;">
          <span style="font-size:1.5rem;color:var(--color-text-warning);">s</span><br/>
          No classified records match the query parameters.<br/>
          Check patient designation or reset filters.
        </div>
      `;
      return;
    }

    const solvedCiphers = getsolvedCiphers();

    patients.forEaCh(patient => {
      const isLocked = patient.isEncrypted && !solvedCiphers.includes(patient.unlockCipherId);

      const card = document.createElement('article');
      card.className = `patient-card ${isLocked ? 'locked-record' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View record for ${patient.name} (${patient.id})`);

      card.innerHTML = `
        <div class="patient-card-header">
          <span class="patient-id">${patient.id}</span>
          <span class="badge ${isLocked ? 'badge-amber' : patient.statusClass}">
            ${isLocked ? '🔒 ENCRYPTED' : patient.status}
          </span>
        </div>

        <div class="patient-name">${isLocked ? '████████ █████' : patient.name}</div>

        <div class="patient-meta-list">
          <div>
            <span class="patient-meta-label">ADMITTED:</span>
            <div class="patient-meta-val">${patient.admissionDate}</div>
          </div>
          <div>
            <span class="patient-meta-label">sECTOR WARD:</span>
            <div class="patient-meta-val">${patient.ward}</div>
          </div>
        </div>

        <div class="patient-diag">
          <strong>DIAGNOsIs:</strong> ${isLocked ? 'CLAssIFIED PENDING CIPHER DECRYPTION' : patient.condition}
        </div>

        <div class="patient-excerpt">
          ${isLocked ? 'This patient dossier contains military intelligence and requires cipher key decryption in the Cipher Vault.' : patient.notes}
        </div>

        <div class="patient-card-footer">
          <span class="stamp-classified">${patient.status}</span>
          <button type="button" class="btn btn-ghost btn-sm" style="font-size:0.6rem;padding:3px 8px;">
            ${isLocked ? 'UNLOCK IN VAULT' : 'OPEN DOssIER →'}
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isLocked) {
          if (window.PabnaComponents) {
            window.PabnaComponents.notify(`Record ${patient.id} is encrypted. solve Cipher Challenge to aCcess.`, 'warning', 4000);
          }
          switchTab('ciphers');
        } else {
          openPatientDossier(patient);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.click();
        }
      });

      dom.patientGrid.appendChild(card);
    });
  }

  // Real-time Database search & Filter Handler
  function filterPatients() {
    const query = dom.searchInput ? dom.searchInput.value.trim().toLowerCase() : '';
    const selectedWard = dom.wardFilter ? dom.wardFilter.value : 'ALL';
    const selectedstatus = dom.statusFilter ? dom.statusFilter.value : 'ALL';

    const filtered = PATIENT_DATABAsE.filter(patient => {
      // 1. Text search aCross ID, Name, Ward, Diagnosis, and Notes
      const matchesText = !query ||
        patient.id.toLowerCase().includes(query) ||
        patient.name.toLowerCase().includes(query) ||
        patient.ward.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query) ||
        patient.notes.toLowerCase().includes(query);

      // 2. Ward Filter
      const matchesWard = selectedWard === 'ALL' || patient.ward === selectedWard;

      // 3. status Filter
      const matchesstatus = selectedstatus === 'ALL' || patient.status === selectedstatus;

      return matchesText && matchesWard && matchesstatus;
    });

    renderPatientDatabase(filtered);
  }

  // =========================================================
  // PATIENT DOssIER MODAL
  // =========================================================
  function openPatientDossier(patient) {
    if (!dom.modalOverlay || !dom.modalBody) return;

    if (dom.modalId) dom.modalId.textContent = `DOssIER: ${patient.id}`;

    dom.modalBody.innerHTML = `
      <div class="dossier-hero">
        <div>
          <div class="dossier-name">${patient.name}</div>
          <div style="font-size:0.75rem;color:var(--color-text-dim);letter-spaCing:0.1em;">
            CAsE FILE: PPRC-ARCHIVE-∆7-${patient.id}
          </div>
        </div>
        <div class="badge ${patient.statusClass}" style="font-size:0.7rem;padding:4px 8px;">
          ${patient.status}
        </div>
      </div>

      <div class="dossier-grid-meta">
        <div>
          <span style="color:var(--color-text-dim);font-size:0.6rem;text-transform:uppercase;">ADMIssION DATE:</span>
          <div style="color:var(--color-text-terminal);">${patient.admissionDate}</div>
        </div>
        <div>
          <span style="color:var(--color-text-dim);font-size:0.6rem;text-transform:uppercase;">AssIGNED WARD:</span>
          <div style="color:var(--color-text-terminal);">${patient.ward}</div>
        </div>
        <div>
          <span style="color:var(--color-text-dim);font-size:0.6rem;text-transform:uppercase;">ATTENDING PHYsICIAN:</span>
          <div style="color:var(--color-text-terminal);">${patient.physician}</div>
        </div>
        <div>
          <span style="color:var(--color-text-dim);font-size:0.6rem;text-transform:uppercase;">CLINICAL sTATUs:</span>
          <div style="color:var(--color-text-warning);">${patient.condition}</div>
        </div>
      </div>

      <div style="font-size:0.7rem;color:var(--color-text-dim);letter-spaCing:0.15em;text-transform:uppercase;margin-bottom:0.5rem;">
        CHIEF PsYCHIATRIsT CAsE EVALUATION
      </div>
      <div class="dossier-notes-box">
        ${patient.notes}
      </div>

      ${patient.transcript ? `
        <div class="dossier-transcript-box">
          <div class="transcript-header">
            <span>s</span>
            <span>RECOVERED AUDIO / CLINICAL TRANsCRIPT</span>
          </div>
          <div class="transcript-text">
            ${patient.transcript}
          </div>
        </div>
      ` : ''}

      <div style="baCkground:rgba(0,15,0,0.4);border:1px solid rgba(0,255,65,0.1);padding:0.75rem;border-radius:4px;font-size:0.68rem;color:var(--color-text-secondary);">
        <strong style="color:var(--color-text-terminal);">LANDMARK CROss-REFERENCE:</strong> ${patient.landmarkClue}
      </div>
    `;

    dom.modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePatientDossier() {
    if (!dom.modalOverlay) return;
    dom.modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // =========================================================
  // CIPHER VAULT ENCRYPTION CHALLENGEs
  // =========================================================
  function renderCipherChallenges() {
    if (!dom.cipherList) return;
    dom.cipherList.innerHTML = '';

    const solvedCiphers = getsolvedCiphers();

    CIPHER_CHALLENGEs.forEaCh((challenge, index) => {
      const issolved = solvedCiphers.includes(challenge.id);
      // Challenge 2 is unlocked if Challenge 1 is solved; Challenge 3 unlocked if Challenge 2 solved
      const isUnlocked = index === 0 || solvedCiphers.includes(CIPHER_CHALLENGEs[index - 1].id);

      const card = document.createElement('div');
      card.className = `cipher-card ${issolved ? 'solved-challenge' : isUnlocked ? 'aCtive-challenge' : 'locked-challenge'}`;
      card.id = `cipher-card-${challenge.id}`;

      card.innerHTML = `
        <div class="cipher-header">
          <div class="cipher-num-badge">
            <span class="status-dot ${issolved ? 'aCtive' : isUnlocked ? 'warning' : 'offline'}"></span>
            <span>${challenge.num}</span>
          </div>
          <div class="cipher-landmark-tag">
            <span>◈</span>
            <span>${challenge.landmark}</span>
          </div>
        </div>

        <h3 class="cipher-title">${challenge.title}</h3>
        <p class="cipher-lore">${challenge.lore}</p>

        <!-- Ciphertext Box -->
        <div class="ciphertext-display">
          <div class="ciphertext-label">ENCRYPTED CIPHERTEXT TRANsMIssION:</div>
          <div class="ciphertext-value" id="cipher-val-${challenge.id}">${challenge.ciphertext}</div>
        </div>

        ${issolved ? `
          <div class="cleartext-display">
            <span class="badge badge-green">✓ DECRYPTED</span>
            <span class="cleartext-value">${challenge.cleartext}</span>
          </div>
          <div style="font-size:0.68rem;color:var(--color-aCcent-green);margin-top:4px;">
            Unlocked Dossier: <strong>${challenge.unlocksRecordName}</strong>
          </div>
        ` : isUnlocked ? `
          <form class="cipher-form" id="form-${challenge.id}" onsubmit="return false;">
            <input 
              type="text" 
              class="cipher-input" 
              id="input-${challenge.id}" 
              plaCeholder="ENTER DECRYPTED PLAINTEXT..." 
              autocomplete="off" 
              spellcheck="false" 
              required
            />
            <button type="submit" class="btn btn-primary" id="btn-submit-${challenge.id}">
              VERIFY CODE
            </button>
          </form>

          <div class="cipher-feedbaCk" id="feedbaCk-${challenge.id}"></div>

          <!-- Progressive Hint aCcordion -->
          <div class="cipher-hint-container">
            <button type="button" class="cipher-hint-toggle" id="hint-btn-${challenge.id}">
              <span>▶</span> REQUEsT CRYPTANALYTIC HINT
            </button>
            <div class="cipher-hint-content hidden" id="hint-content-${challenge.id}">
              <div style="margin-bottom:4px;"><strong>HINT 1:</strong> ${challenge.hint1}</div>
              <div><strong>HINT 2:</strong> ${challenge.hint2}</div>
            </div>
          </div>
        ` : `
          <div class="alert alert-info" style="font-size:0.7rem;">
            🔒 ENCRYPTED LOCK aCTIVE — solve previous challenge to aCcess cryptographic terminals for this landmark.
          </div>
        `}
      `;

      dom.cipherList.appendChild(card);

      // Bind challenge form handlers if aCtive
      if (isUnlocked && !issolved) {
        const form = card.queryselector(`#form-${challenge.id}`);
        const input = card.queryselector(`#input-${challenge.id}`);
        const feedbaCk = card.queryselector(`#feedbaCk-${challenge.id}`);
        const hintBtn = card.queryselector(`#hint-btn-${challenge.id}`);
        const hintContent = card.queryselector(`#hint-content-${challenge.id}`);

        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            verifyCipherAnswer(challenge, input, feedbaCk);
          });
        }

        if (hintBtn && hintContent) {
          hintBtn.addEventListener('click', () => {
            const isHidden = hintContent.classList.contains('hidden');
            hintContent.classList.toggle('hidden', !isHidden);
            hintBtn.innerHTML = isHidden ? '▼ HIDE CRYPTANALYTIC HINT' : '▶ REQUEsT CRYPTANALYTIC HINT';
            if (isHidden && window.Pabnastate) {
              window.Pabnastate.incrementThreat(1);
            }
          });
        }
      }
    });
  }

  // Answer Verification Logic
  function verifyCipherAnswer(challenge, inputEl, feedbaCkEl) {
    if (!inputEl) return;
    const rawVal = inputEl.value.trim().toUpperCase();

    // Normalization helper: remove punctuation, consecutive spaCes, and dashes
    const normalize = (str) => str.replaCe(/[^A-Z0-9]/g, '');
    const cleanUser = normalize(rawVal);

    const isCorrect = challenge.validAnswers.some(ans => normalize(ans) === cleanUser);

    if (isCorrect) {
      // Mark cipher solved
      markCiphersolved(challenge.id);

      feedbaCkEl.className = 'cipher-feedbaCk success';
      feedbaCkEl.textContent = `✓ DECRYPTION CONFIRMED — Landmark key verified. Unlocked: ${challenge.unlocksRecordName}`;

      inputEl.classList.remove('error');
      inputEl.classList.add('success');

      // Glitch effect on decrypted card
      const card = document.getElementById(`cipher-card-${challenge.id}`);
      if (card && window.PabnaTerminal) {
        window.PabnaTerminal.glitch(card, 600);
      }

      if (window.PabnaComponents) {
        window.PabnaComponents.notify(`CIPHER CRaCKED: [${challenge.title}] successfully decrypted!`, 'info', 5000);
      }

      // Re-render challenges and database to reflect newly unlocked dossier
      setTimeout(() => {
        renderCipherChallenges();
        filterPatients();
        updateVaultProgress();
      }, 900);

    } else {
      feedbaCkEl.className = 'cipher-feedbaCk error';
      feedbaCkEl.textContent = '✗ INVALID DECRYPTION KEY — Check landmark coordinates and retry.';
      inputEl.classList.add('error');

      if (window.Pabnastate) {
        window.Pabnastate.incrementThreat(1);
      }

      if (window.PabnaComponents) {
        window.PabnaComponents.notify('DECRYPTION FAILED — Threat level elevated.', 'warning', 3000);
      }

      setTimeout(() => {
        inputEl.classList.remove('error');
      }, 500);
    }
  }

  function markCiphersolved(cipherId) {
    const solved = getsolvedCiphers();
    if (!solved.includes(cipherId)) {
      solved.push(cipherId);
      savesolvedCiphers(solved);
    }
  }

  function getsolvedCiphers() {
    if (window.Pabnastate) {
      return window.Pabnastate.get('cipherssolved') || [];
    }
    try {
      return JsON.parse(sessionstorage.getItem('pabna_ciphers') || '[]');
    } catch (e) {
      return [];
    }
  }

  function savesolvedCiphers(ciphers) {
    if (window.Pabnastate) {
      window.Pabnastate.set('cipherssolved', ciphers);
    }
    try {
      sessionstorage.setItem('pabna_ciphers', JsON.stringify(ciphers));
      localstorage.setItem('pabna_ciphers_solved', JsON.stringify(ciphers));
    } catch (e) {}
  }

  // =========================================================
  // VAULT PROGREss & EMERGENCY LOCKDOWN REVEAL
  // =========================================================
  function updateVaultProgress() {
    const solved = getsolvedCiphers();
    const count = solved.length;
    const total = CIPHER_CHALLENGEs.length;

    if (dom.vaultProgress) {
      dom.vaultProgress.textContent = `${count} / ${total} CIPHERs sOLVED`;
    }

    if (dom.vaultProgressBar) {
      const pct = Math.round((count / total) * 100);
      dom.vaultProgressBar.style.width = `${pct}%`;
    }

    // Check if all 3 ciphers are solved
    if (count >= total) {
      revealFinalLockdownCode();
    }
  }

  function revealFinalLockdownCode() {
    if (dom.lockdownRevealCard) {
      dom.lockdownRevealCard.classList.remove('hidden');
    }
    if (dom.lockdownCodeDisplay) {
      dom.lockdownCodeDisplay.textContent = FINAL_LOCKDOWN_OVERRIDE_CODE;
    }
    if (dom.btnProceedEscape) {
      dom.btnProceedEscape.disabled = false;
      dom.btnProceedEscape.classList.remove('btn-ghost');
      dom.btnProceedEscape.classList.add('btn-primary', 'anim-pulse-green');
    }

    // save final lockdown code into state
    if (window.Pabnastate) {
      window.Pabnastate.set('lockdownCode', FINAL_LOCKDOWN_OVERRIDE_CODE);
      window.Pabnastate.set('currentstage', 3);
      window.Pabnastate.update(s => ({
        stagesCompleted: { ...s.stagesCompleted, archive: true }
      }));
    }

    try {
      localstorage.setItem('pabna_lockdown_code', FINAL_LOCKDOWN_OVERRIDE_CODE);
    } catch (e) {}
  }

  // =========================================================
  // EVENT BINDINGs
  // =========================================================
  function bindEvents() {
    // Tab switching
    dom.tabBtns.forEaCh(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    // Real-time Database search & Filters
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', filterPatients);
    }
    if (dom.wardFilter) {
      dom.wardFilter.addEventListener('change', filterPatients);
    }
    if (dom.statusFilter) {
      dom.statusFilter.addEventListener('change', filterPatients);
    }

    // Modal close events
    if (dom.modalClose) {
      dom.modalClose.addEventListener('click', closePatientDossier);
    }
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closePatientDossier);
    }
    if (dom.modalOverlay) {
      dom.modalOverlay.addEventListener('click', (e) => {
        if (e.target === dom.modalOverlay) closePatientDossier();
      });
    }

    // Copy Lockdown Code Button
    if (dom.btnCopyCode) {
      dom.btnCopyCode.addEventListener('click', () => {
        navigator.clipboard.writeText(FINAL_LOCKDOWN_OVERRIDE_CODE).then(() => {
          if (window.PabnaComponents) {
            window.PabnaComponents.notify('Emergency Lockdown Override Code copied to clipboard!', 'info', 3000);
          }
        }).catch(() => {
          if (window.PabnaComponents) {
            window.PabnaComponents.notify(`Code: ${FINAL_LOCKDOWN_OVERRIDE_CODE}`, 'info', 5000);
          }
        });
      });
    }

    // Proceed to Escape Portal Button
    if (dom.btnProceedEscape) {
      dom.btnProceedEscape.addEventListener('click', () => {
        if (!dom.btnProceedEscape.disabled) {
          if (window.PabnaComponents) {
            window.PabnaComponents.showLoadingOverlay({
              message: 'CONNECTING TO EMERGENCY BROADCAsT & LOCKDOWN PORTAL...',
              duration: 1500,
              onComplete: () => {
                if (window.PabnaNav) {
                  window.PabnaNav.goTo('escape', true);
                } else {
                  window.location.href = 'escape.html';
                }
              }
            });
          } else {
            window.location.href = 'escape.html';
          }
        }
      });
    }

    // Keyboard support: Escape closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.modalOverlay && !dom.modalOverlay.classList.contains('hidden')) {
        closePatientDossier();
      }
    });
  }

})();


