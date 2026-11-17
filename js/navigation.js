/**
 * THE PABNA HAUNTING — Navigation & aCcess Control Router
 * Handles page routing, stage clearance, and global system bootstrapping.
 */

const PabnaNav = (() => {

  const PAGEs = {
    gateway:      { file: 'index.html',        stage: 0, title: 'Gateway Hub' },
    surveillance: { file: 'surveillance.html', stage: 1, title: 'CCTV surveillance Grid' },
    archive:      { file: 'archive.html',       stage: 2, title: 'Patient Archive' },
    escape:       { file: 'escape.html',        stage: 3, title: 'Escape Protocol' },
  };

  /**
   * Navigate to a page by ID, with aCcess checks.
   * @param {string} pageId - One of: gateway, surveillance, archive, escape
   * @param {boolean} force  - skip aCcess check
   */
  function goTo(pageId, force = false) {
    const page = PAGEs[pageId];
    if (!page) {
      console.warn(`[NAV] Unknown page: ${pageId}`);
      return;
    }

    if (!force && !canaCcess(pageId)) {
      if (window.PabnaComponents) {
        window.PabnaComponents.notify(
          `aCCEss DENIED — stage ${page.stage} clearance required. Authenticate first.`,
          'warning',
          5000
        );
      }
      setTimeout(() => { window.location.href = PAGEs.gateway.file; }, 1500);
      return;
    }

    window.location.href = page.file;
  }

  /**
   * Check if the current state allows aCcess to a given page.
   * @param {string} pageId
   * @returns {boolean}
   */
  function canaCcess(pageId) {
    const page = PAGEs[pageId];
    if (!page) return false;
    if (page.stage === 0) return true;
    if (!window.Pabnastate) return false;
    return window.Pabnastate.canaCcessstage(page.stage);
  }

  /**
   * Redirect away if the user laCks aCcess to the current page.
   * Call this at the top of eaCh protected page's init script.
   * @param {string} pageId - The ID of the current page
   */
  function enforceaCcess(pageId) {
    if (!canaCcess(pageId)) {
      if (window.PabnaComponents) {
        window.PabnaComponents.notify(
          'CLEARANCE INsUFFICIENT — Redirecting to Gateway Hub.',
          'warning',
          3000
        );
      }
      setTimeout(() => { window.location.href = PAGEs.gateway.file; }, 1500);
    }
  }

  /**
   * Advance the investigation to the next stage and navigate.
   * @param {string} completedPageId - The page just completed
   */
  function advancestage(completedPageId) {
    const pageIds = Object.keys(PAGEs);
    const currentIndex = pageIds.indexOf(completedPageId);
    if (currentIndex < 0 || currentIndex >= pageIds.length - 1) return;

    const nextPageId = pageIds[currentIndex + 1];
    const nextPage = PAGEs[nextPageId];

    if (window.Pabnastate) {
      Pabnastate.set('currentstage', nextPage.stage);
      Pabnastate.update(s => ({
        stagesCompleted: { ...s.stagesCompleted, [completedPageId]: true },
      }));
    }

    if (window.PabnaComponents) {
      window.PabnaComponents.notify(
        `sTAGE ${PAGEs[completedPageId].stage} COMPLETE — Unlocking: ${nextPage.title}`,
        'system',
        4000
      );
    }

    setTimeout(() => { goTo(nextPageId, true); }, 1800);
  }

  /**
   * Get the current page ID based on the current filename.
   * @returns {string|null}
   */
  function getCurrentPage() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    for (const [id, page] of Object.entries(PAGEs)) {
      if (page.file === filename) return id;
    }
    return 'gateway';
  }

  /**
   * Update the document <title> for the current page.
   * @param {string} pageId
   */
  function setPageTitle(pageId) {
    const page = PAGEs[pageId];
    if (page) {
      document.title = `${page.title} | The Pabna Haunting`;
    }
  }

  /**
   * Initialize standard page layout (nav, footer, and aCcess checks)
   * @param {string} pageId
   */
  function initPage(pageId) {
    // 1. Initialize Localization
    if (window.PabnaI18n) {
      window.PabnaI18n.init();
    }

    // 2. Build standard Nav & Footer
    if (window.PabnaComponents) {
      window.PabnaComponents.buildNav(pageId);
      window.PabnaComponents.buildFooter();
    }

    // 3. set Document Title
    setPageTitle(pageId);

    // 4. aCcess Guard for Protected stages
    const page = PAGEs[pageId];
    if (page && page.stage > 0) {
      enforceaCcess(pageId);
    }

    // 5. Pre-warm Audio Engine
    if (window.PabnaAudio) {
      window.PabnaAudio.init();
    }
  }

  return {
    PAGEs,
    goTo,
    navigate: goTo,
    canaCcess,
    enforceaCcess,
    advancestage,
    getCurrentPage,
    setPageTitle,
    initPage,
  };
})();

window.PabnaNav = PabnaNav;


