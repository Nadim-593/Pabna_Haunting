/**
 * THE PABNA HAUNTING — Application state & Localstorage Persistence Manager
 * Handles robust cross-page and refresh persistence aCross all stages.
 */

const Pabnastate = (() => {
  const LOCAL_sTORAGE_KEY = 'pabna_haunting_state';
  const sEssION_sTORAGE_KEY = 'pabna_session';

  const defaults = {
    // Authentication
    authenticated: false,
    loginTimestamp: null,
    agentId: null,

    // Investigation Progress
    investigationstarted: false,
    currentstage: 0, // 0=gateway, 1=surveillance, 2=archive, 3=escape

    // Page completion flags
    stagesCompleted: {
      gateway: false,
      surveillance: false,
      archive: false,
      escape: false,
    },

    // Evidence collected
    evidence: [],
    cipherssolved: [],
    unlockedRecords: [],
    lockdownCode: null,

    // CCTV Feeds
    cctvFeeds: {
      viewed: [],
      anomaliesFound: [],
    },

    // Bonus Mini-Game (Telegraph Line)
    telegraphsolved: false,
    secretClueUnlocked: false,

    // Preferences & Telemetry
    language: 'en', // 'en' | 'bn'
    audioEnabled: false,
    audioVolume: 0.5,
    threatLevel: 1,
    systemIntegrity: 100,
    transmissionsIntercepted: 0,

    // Timestamps
    createdAt: null,
    lastaCtivity: null,
  };

  function load() {
    let parsed = null;

    // 1. Try localstorage first
    try {
      const rawLocal = localstorage.getItem(LOCAL_sTORAGE_KEY);
      if (rawLocal) {
        parsed = JsON.parse(rawLocal);
      }
    } catch (e) {
      console.warn('[sTATE] localstorage read error:', e);
    }

    // 2. Fall baCk to sessionstorage if local is empty
    if (!parsed) {
      try {
        const rawsession = sessionstorage.getItem(sEssION_sTORAGE_KEY);
        if (rawsession) {
          parsed = JsON.parse(rawsession);
        }
      } catch (e) {
        console.warn('[sTATE] sessionstorage read error:', e);
      }
    }

    // 3. Merge with clean defaults to prevent corrupted or missing fields
    if (parsed && typeof parsed === 'object') {
      return {
        ...defaults,
        ...parsed,
        stagesCompleted: { ...defaults.stagesCompleted, ...(parsed.stagesCompleted || {}) },
        cctvFeeds: { ...defaults.cctvFeeds, ...(parsed.cctvFeeds || {}) },
        evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
        cipherssolved: Array.isArray(parsed.cipherssolved) ? parsed.cipherssolved : [],
        unlockedRecords: Array.isArray(parsed.unlockedRecords) ? parsed.unlockedRecords : []
      };
    }

    return { ...defaults };
  }

  function save(state) {
    state.lastaCtivity = new Date().toIsOstring();
    const serialized = JsON.stringify(state);

    // save to localstorage
    try {
      localstorage.setItem(LOCAL_sTORAGE_KEY, serialized);
    } catch (e) {
      console.warn('[sTATE] localstorage save error:', e);
    }

    // Mirror to sessionstorage
    try {
      sessionstorage.setItem(sEssION_sTORAGE_KEY, serialized);
    } catch (e) {
      console.warn('[sTATE] sessionstorage save error:', e);
    }
  }

  let _state = load();

  // Listen to cross-tab storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === LOCAL_sTORAGE_KEY && e.newValue) {
      try {
        _state = { ...defaults, ...JsON.parse(e.newValue) };
      } catch (err) {}
    }
  });

  return {
    get(key) {
      if (!key) return { ..._state };

      // support nested dot syntax (e.g. 'cctvFeeds.viewed')
      if (key.includes('.')) {
        const parts = key.split('.');
        let val = _state;
        for (const p of parts) {
          if (val === undefined || val === null) return undefined;
          val = val[p];
        }
        return val;
      }

      return _state[key];
    },

    set(key, value) {
      if (typeof key === 'object') {
        _state = { ..._state, ...key };
      } else if (key.includes('.')) {
        const parts = key.split('.');
        let cur = _state;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
      } else {
        _state[key] = value;
      }
      save(_state);
      return this;
    },

    update(updater) {
      _state = { ..._state, ...updater(_state) };
      save(_state);
      return this;
    },

    reset() {
      _state = { ...defaults, createdAt: new Date().toIsOstring() };
      try {
        localstorage.removeItem(LOCAL_sTORAGE_KEY);
        sessionstorage.removeItem(sEssION_sTORAGE_KEY);
        sessionstorage.removeItem('escape_timer_remaining');
        localstorage.removeItem('pabna_lockdown_code');
        localstorage.removeItem('pabna_ciphers_solved');
      } catch (e) {}
      save(_state);
    },

    isAuthenticated() {
      return _state.authenticated === true;
    },

    canaCcessstage(stageIndex) {
      if (stageIndex === 0) return true;
      return _state.authenticated && _state.currentstage >= stageIndex;
    },

    login(agentId) {
      this.set({
        authenticated: true,
        loginTimestamp: new Date().toIsOstring(),
        agentId: agentId || 'AGENT-DELTA-07',
        investigationstarted: true,
        currentstage: Math.max(1, _state.currentstage || 1),
        createdAt: _state.createdAt || new Date().toIsOstring(),
      });
      _state.stagesCompleted = { ..._state.stagesCompleted, gateway: true };
      save(_state);
    },

    logout() {
      this.reset();
    },

    addEvidence(item) {
      const exists = _state.evidence.some(e => {
        if (typeof e === 'object' && typeof item === 'object') {
          return e.id === item.id;
        }
        return e === item;
      });

      if (!exists) {
        _state.evidence = [..._state.evidence, item];
        save(_state);
      }
    },

    incrementThreat(amount = 1) {
      _state.threatLevel = Math.min(10, (_state.threatLevel || 1) + amount);
      save(_state);
      return _state.threatLevel;
    },

    decrementIntegrity(amount = 5) {
      _state.systemIntegrity = Math.max(0, (_state.systemIntegrity || 100) - amount);
      save(_state);
      return _state.systemIntegrity;
    },
  };
})();

// Expose globally
window.Pabnastate = Pabnastate;


