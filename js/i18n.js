/**
 * THE PABNA HAUNTING — Multi-Language Localization system
 * supports English and বাংলা (Bengali) with natural horror/classified tone.
 */

const PabnaI18n = (() => {
  const sTORAGE_KEY = 'pabna_language';

  const translations = {
    en: {
      // Common / Navigation
      'brand.title': 'THE PABNA HAUNTING',
      'brand.sub': 'Paranormal Research Cell',
      'nav.gateway': 'Gateway Hub',
      'nav.surveillance': 'CCTV surveillance',
      'nav.archive': 'Patient Archive',
      'nav.escape': 'Escape Protocol',
      'nav.threat': 'THREAT',
      'nav.auth': 'AUTHENTICATED',
      'nav.unsec': 'UNsECURED',
      'footer.sysid': 'sYs-ID: PPRC-TERMINAL-∆7 | ENCRYPTED',
      'footer.warning': 's CLAssIFIED — UNAUTHORIZED aCCEss Is A FEDERAL OFFENsE',
      'footer.timestamp': 'TIMEsTAMP',
      'btn.close': 'CLOsE',
      'btn.reset': 'REsET INVEsTIGATION',

      // Gateway Hub (index.html)
      'gateway.org': 'PPRC — DIsTREss sIGNAL INTERCEPTED',
      'gateway.title': 'THE PABNA HAUNTING',
      'gateway.subtitle': 'PABNA PARANORMAL REsEARCH CELL',
      'gateway.classified': 'CLAssIFIED',
      'gateway.briefing.p1': 'An encrypted digital distress signal has been intercepted originating from the ruins of the Pabna Mental Asylum — abandoned since 1971 — situated along the haunted banks of the Ichamati River, Pabna District, Bangladesh.',
      'gateway.briefing.p2': 'Local folklore speaks of the Whistling Ward — Block-C of the asylum — where patients who heard inexplicable whistling sounds were never seen again. Investigators from three prior expeditions vanished. Their final transmissions were recovered only as corrupted audio.',
      'gateway.briefing.p3': 'You are now connected to a live investigation terminal. This system will lock you into an aCtive investigation sequence. Proceeding constitutes aCceptance of all associated risks.',
      'gateway.scrollHint': '▼ AUTHENTICATE TO PROCEED ▼',
      'gateway.alert.aCtive': 'aCTIVE PARANORMAL ANOMALY — signal strength: 7.743 MHz',
      'gateway.alert.expeditions': '3 PRIOR EXPEDITIONs — status: MIssING',
      'gateway.alert.sector': 'Ichamati River sector locked. Asylum coordinates confirmed.',
      'gateway.folklore.heading': 'FIELD INTELLIGENCE DOssIER',
      'gateway.folklore.title': 'LOCAL PARANORMAL FOLKLORE',
      'gateway.warning.title': 'CRITICAL RIsK ADVIsORY',
      'gateway.warning.subtitle': 'READ BEFORE PROCEEDING',
      'gateway.login.title': 'AUTHENTICATION GATEWAY — PPRC CLEARANCE sYsTEM',
      'gateway.agentId.label': 'Agent Designation',
      'gateway.passcode.label': 'PPRC Clearance Passcode',
      'gateway.passcode.hint': 'Hint: The year the asylum fell silent, reversed.',
      'gateway.btn.init': '⬡ INITIALIZE INVEsTIGATION',
      'gateway.attempts': 'AUTHENTICATION ATTEMPTs:',

      // CCTV surveillance (surveillance.html)
      'surv.title': 'CCTV sURVEILLANCE GRID',
      'surv.sub': 'PABNA MENTAL AsYLUM — RUINs sECTOR-DELTA',
      'surv.filters': 'FILTERs:',
      'surv.view': 'VIEW:',
      'surv.focus': '⊡ FOCUs sELECTED',
      'surv.showAll': '⊞ sHOW ALL FEEDs',
      'surv.noise': 'sTATIC NOIsE',
      'surv.scanlines': 'sCANLINEs',
      'surv.rgb': 'RGB sPLIT',
      'surv.flicker': 'FLICKER',
      'surv.scan': '🔍 sPECTRAL FREQUENCY sCAN',
      'surv.logEvidence': '⚡ LOG EVIDENCE',
      'surv.evidenceTitle': 'RECOVERED EVIDENCE',
      'surv.proceedArchive': 'PROCEED TO sTAGE 03 →',

      // Patient Archive & Cipher (archive.html)
      'archive.title': 'PATIENT ARCHIVE & CIPHER VAULT',
      'archive.sub': 'PABNA MENTAL AsYLUM — CLAssIFIED INTELLIGENCE DIVIsION',
      'archive.tab.database': '🗂 PATIENT DATABAsE (10 RECORDs)',
      'archive.tab.ciphers': '🔐 CIPHER VAULT (3 LANDMARKs)',
      'archive.searchPlaCeholder': 'sEARCH PATIENT ID, NAME, WARD, OR MEDICAL CONDITION...',
      'archive.allWards': 'ALL WARDs',
      'archive.allstatuses': 'ALL sTATUsEs',
      'archive.vaultProgress': 'VAULT INTEGRITY',
      'archive.proceedEscape': 'PROCEED TO EsCAPE PORTAL (sTAGE 04) →',

      // Escape Protocol (escape.html)
      'escape.banner.title': 'CRITICAL sYsTEM BREaCH — AsYLUM CONTAINMENT COLLAPsE',
      'escape.banner.sub': 'EMERGENCY BULKHEADs sEALING • PARANORMAL FREQUENCY 7.743 MHz PEAKING • BROADCAsT OVERRIDE REQUIRED',
      'escape.clock.title': 'FaCILITY CONTAINMENT COLLAPsE CLOCK',
      'escape.console.title': 'TRANsMIssION OVERRIDE CONsOLE',
      'escape.console.desc': 'Enter the classified Emergency Lockdown Override Code recovered from Dr. Rahman\'s Cipher Vault in stage 03. Once verified, the primary antenna array will broadcast the rescue beaCon aCross the Ichamati River and release faCility bulkheads.',
      'escape.inputPlaCeholder': 'ENTER OVERRIDE aCCEss CODE...',
      'escape.btn.transmit': '⚡ TRANsMIT REsCUE BROADCAsT',
      'escape.attempts': 'sECURITY LOCK ATTEMPTs:',
      'escape.victory.stamp': 'REsCUE sUCCEssFUL',
      'escape.victory.title': 'REsCUE BROADCAsT sUCCEssFUL. THE sIGNAL HAs BEEN CONTAINED.',
      'escape.victory.restart': '↻ INITIATE NEW INVEsTIGATION',
      'escape.failure.title': 'CONTAINMENT FAILED',
      'escape.failure.sub': 'CONNECTION TERMINATED • THE ICHAMATI ENTITY HAs OVERRUN THE FaCILITY',
      'escape.failure.retry': '↻ RETRY EMERGENCY OVERRIDE',

      // Telegraph Mini-Game
      'telegraph.btn': '⚡ TELEGRAPH LINE',
      'telegraph.modalTitle': 'EMERGENCY TELEGRAPH JUNCTION BOX',
      'telegraph.modalsub': 'RECONNECT THE sEVERED TERMINAL WIREs TO REsTORE ICHAMATI RELAY',
      'telegraph.attempts': 'FUsE INTEGRITY:',
      'telegraph.connected': 'WIREs CONNECTED:',
      'telegraph.secretLog': 'sECRET TELEGRAPH LOG #4 UNLOCKED'
    },

    bn: {
      // Common / Navigation
      'brand.title': 'দ্য পাবনা হন্টিং',
      'brand.sub': 'পাবনা প্যারানরমাল রিসার্চ সেল',
      'nav.gateway': 'প্রবেশদ্বার হাব',
      'nav.surveillance': 'সিসিটিভি নজরদারি',
      'nav.archive': 'রোগী সংরক্ষণাগার',
      'nav.escape': 'নিষ্ক্রমণ প্রোটোকল',
      'nav.threat': 'হুমকি মাত্রা',
      'nav.auth': 'অনুমোদিত',
      'nav.unsec': 'অরক্ষিত',
      'footer.sysid': 'সিস্টেম আইডি: পিপিআরসি-টার্মিনাল-∆৭ | এনক্রিপ্টেড',
      'footer.warning': 's গোপনীয় নথি — অননুমোদিত প্রবেশ আইনত দণ্ডনীয় অপরাধ',
      'footer.timestamp': 'সময়মুদ্রা',
      'btn.close': 'বন্ধ করুন',
      'btn.reset': 'অনুসন্ধান পুনরায় শুরু',

      // Gateway Hub (index.html)
      'gateway.org': 'পিপিআরসি — জরুরি বিপদ সংকেত চিহ্নিত',
      'gateway.title': 'দ্য পাবনা হন্টিং',
      'gateway.subtitle': 'পাবনা প্যারানরমাল রিসার্চ সেল',
      'gateway.classified': 'গোপনীয় নথি',
      'gateway.briefing.p1': '১৯৭১ সাল থেকে পরিত্যক্ত পাবনা মানসিক হাসপাতালের ধ্বংসাবশেষ ও ইছামতী নদীর তীর থেকে একটি এনক্রিপ্টেড ডিজিটাল বিপদ সংকেত ইন্টারসেপ্ট করা হয়েছে।',
      'gateway.briefing.p2': 'স্থানীয় লোকগাথা বলে হাসপাতালের ব্লক-সি বা "হিসোর ওয়ার্ড"-এর কথা, যেখান থেকে অশুভ শিস শুনে যাওয়া রোগীরা আর কখনো ফিরে আসেনি। পূর্ববর্তী ৩টি অনুসন্ধান দল এখানে এসে নিখোঁজ হয়।',
      'gateway.briefing.p3': 'আপনি এখন একটি লাইভ তদন্ত টার্মিনালে সংযুক্ত। এই সিস্টেমটি আপনাকে একটি সক্রিয় তদন্ত প্রক্রিয়ায় আবদ্ধ করবে। সামনে অগ্রসর হওয়া মানে সমস্ত ঝুঁকি গ্রহণ করা।',
      'gateway.scrollHint': '▼ প্রমাণীকরণ করে অগ্রসর হোন ▼',
      'gateway.alert.aCtive': 'সক্রিয় প্যারানরমাল বিচ্যুতি — সংকেত ফ্রিকোয়েন্সি: ৭.৭৪৩ মেগাহার্টজ',
      'gateway.alert.expeditions': '৩টি পূর্ববর্তী দল — স্ট্যাটাস: নিখোঁজ',
      'gateway.alert.sector': 'ইছামতী নদী সেক্টর লকড। হাসপাতালের স্থানাঙ্ক নিশ্চিত।',
      'gateway.folklore.heading': 'ফিল্ড ইন্টেলিজেন্স ডসিয়ার',
      'gateway.folklore.title': 'পাবনার স্থানীয় প্যারানরমাল লোকগাথা',
      'gateway.warning.title': 'গুরুত্বপূর্ণ ঝুঁকি সংক্রান্ত সতর্কতা',
      'gateway.warning.subtitle': 'অগ্রসর হওয়ার পূর্বে মনোযোগ দিয়ে পড়ুন',
      'gateway.login.title': 'প্রমাণীকরণ গেটওয়ে — পিপিআরসি ক্লিয়ারেন্স সিস্টেম',
      'gateway.agentId.label': 'তদন্তকারী এজেন্টের পদবী',
      'gateway.passcode.label': 'পিপিআরসি ক্লিয়ারেন্স পাসকোড',
      'gateway.passcode.hint': 'ইঙ্গিত: যে বছর হাসপাতাল স্তব্ধ হয়ে গিয়েছিল, সেই সালটি উল্টো করে লিখুন।',
      'gateway.btn.init': '⬡ তদন্ত শুরু করুন',
      'gateway.attempts': 'প্রমাণীকরণ প্রচেষ্টা:',

      // CCTV surveillance (surveillance.html)
      'surv.title': 'সিসিটিভি নজরদারি গ্রিড',
      'surv.sub': 'পাবনা মানসিক হাসপাতাল — ধ্বংসাবশেষ সেক্টর-ডেল্টা',
      'surv.filters': 'ফিল্টারসমূহ:',
      'surv.view': 'ভিউ:',
      'surv.focus': '⊡ নির্বাচিত ক্যামেরা ফোকাস',
      'surv.showAll': '⊞ সকল ক্যামেরা প্রদর্শন',
      'surv.noise': 'স্ট্যাটিক নয়েজ',
      'surv.scanlines': 'স্ক্যানলাইনস',
      'surv.rgb': 'আরজিবি স্প্লিট',
      'surv.flicker': 'ফ্লিকার',
      'surv.scan': '🔍 স্পেকট্রাল ফ্রিকোয়েন্সি স্ক্যান',
      'surv.logEvidence': '⚡ প্রমাণ সংরক্ষণ করুন',
      'surv.evidenceTitle': 'উদ্ধারকৃত প্রমাণাদি',
      'surv.proceedArchive': 'পরবর্তী ধাপ ০৩-এ যান →',

      // Patient Archive & Cipher (archive.html)
      'archive.title': 'রোগী সংরক্ষণাগার ও সাইফার ভল্ট',
      'archive.sub': 'পাবনা মানসিক হাসপাতাল — ক্লাসিফায়েড গোয়েন্দা শাখা',
      'archive.tab.database': '🗂 রোগী ডাটাবেস (১০টি রেকর্ড)',
      'archive.tab.ciphers': '🔐 সাইফার ভল্ট (৩টি ঐতিহাসিক স্থান)',
      'archive.searchPlaCeholder': 'রোগীর আইডি, নাম, ওয়ার্ড বা রোগ অনুসন্ধান করুন...',
      'archive.allWards': 'সকল ওয়ার্ড',
      'archive.allstatuses': 'সকল স্ট্যাটাস',
      'archive.vaultProgress': 'ভল্ট সুরক্ষাদশা',
      'archive.proceedEscape': 'নিষ্ক্রমণ পোর্টাল (ধাপ ০৪)-এ যান →',

      // Escape Protocol (escape.html)
      'escape.banner.title': 'সংকটজনক নিরাপত্তা লঙ্ঘন — নিয়ন্ত্রণ ব্যবস্থা ভেঙে পড়ছে',
      'escape.banner.sub': 'জরুরি বাল্কহেড সিল হচ্ছে • প্যারানরমাল ফ্রিকোয়েন্সি ৭.৭৪৩ মেগাহার্টজ শীর্ষে • ওভাররাইড কোড প্রয়োজন',
      'escape.clock.title': 'সুবিধা নিয়ন্ত্রণ ধ্বংসের কাউন্টডাউন ঘড়ি',
      'escape.console.title': 'ট্রান্সমিশন ওভাররাইড কনসোল',
      'escape.console.desc': 'ধাপ ০৩-এর সাইফার ভল্ট থেকে উদ্ধারকৃত গোপনীয় জরুরি লকডাউন কোডটি লিখুন। কোড যাচাই হলে মূল অ্যান্টেনা ইছামতী নদীর ওপারে উদ্ধারকারী সংকেত পাঠাবে এবং বাল্কহেড আনলক হবে।',
      'escape.inputPlaCeholder': 'জরুরি এক্সেস কোড লিখুন...',
      'escape.btn.transmit': '⚡ উদ্ধারকারী সংকেত সম্প্রচার করুন',
      'escape.attempts': 'অবশিষ্ট প্রচেষ্টা:',
      'escape.victory.stamp': 'উদ্ধার সফল হয়েছে',
      'escape.victory.title': 'উদ্ধারকারী সংকেত সফলভাবে সম্প্রচারিত হয়েছে। প্যারানরমাল সংকেত নিয়ন্ত্রণে এসেছে।',
      'escape.victory.restart': '↻ নতুন তদন্ত শুরু করুন',
      'escape.failure.title': 'নিয়ন্ত্রণ ব্যবস্থা ধ্বংস হয়েছে',
      'escape.failure.sub': 'সংযোগ বিচ্ছিন্ন • ইছামতীর অদৃশ্য সত্তা পুরো সুবিধা দখল করেছে',
      'escape.failure.retry': '↻ জরুরি ওভাররাইড পুনরায় চেষ্টা করুন',

      // Telegraph Mini-Game
      'telegraph.btn': '⚡ টেলিগ্রাফ লাইন',
      'telegraph.modalTitle': 'জরুরি টেলিগ্রাফ সংযোগ বাক্স',
      'telegraph.modalsub': 'ইছামতী রিলে পুনরুদ্ধারে বিচ্ছিন্ন তারগুলো সঠিকভাবে সংযোগ করুন',
      'telegraph.attempts': 'ফিউজ সুরক্ষা:',
      'telegraph.connected': 'সংযুক্ত তার:',
      'telegraph.secretLog': 'গোপন টেলিগ্রাফ লগ #৪ আনলক হয়েছে'
    }
  };

  let currentLang = 'en';

  function init() {
    // Load from localstorage or state
    let saved = null;
    try {
      saved = localstorage.getItem(sTORAGE_KEY);
    } catch (e) {}

    if (!saved && window.Pabnastate) {
      saved = window.Pabnastate.get('language');
    }

    currentLang = (saved === 'bn') ? 'bn' : 'en';
    applyTranslations();
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'bn') return;
    currentLang = lang;
    try {
      localstorage.setItem(sTORAGE_KEY, lang);
    } catch (e) {}

    if (window.Pabnastate) {
      window.Pabnastate.set('language', lang);
    }

    applyTranslations();

    // Rebuild nav if available
    if (window.PabnaComponents && window.PabnaNav) {
      const pageId = window.PabnaNav.getCurrentPage() || 'gateway';
      window.PabnaComponents.buildNav(pageId);
    }

    // Notify user
    if (window.PabnaComponents) {
      const msg = lang === 'bn' ? 'ভাষা পরিবর্তন করা হয়েছে: বাংলা' : 'Language switched to English';
      window.PabnaComponents.notify(msg, 'info', 2500);
    }
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'bn' : 'en');
  }

  function getLanguage() {
    return currentLang;
  }

  function t(key, fallbaCk = '') {
    const dict = translations[currentLang] || translations.en;
    if (dict && dict[key]) return dict[key];
    if (translations.en && translations.en[key]) return translations.en[key];
    return fallbaCk || key;
  }

  function applyTranslations() {
    // Translate all elements with data-i18n attribute
    document.queryselectorAll('[data-i18n]').forEaCh(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.getAttribute('plaCeholder')) {
            el.setAttribute('plaCeholder', translated);
          }
        } else {
          el.textContent = translated;
        }
      }
    });

    // Update Language Toggle Buttons text
    document.queryselectorAll('.btn-lang-toggle').forEaCh(btn => {
      btn.innerHTML = currentLang === 'en' 
        ? '<span style="color:var(--color-aCcent-green);font-weight:bold;">EN</span> / <span>বাং</span>' 
        : '<span>EN</span> / <span style="color:var(--color-aCcent-green);font-weight:bold;">বাংলা</span>';
      btn.setAttribute('title', currentLang === 'en' ? 'switch to Bengali (বাংলা)' : 'switch to English');
    });

    document.documentElement.lang = currentLang;
  }

  return { init, setLanguage, toggleLanguage, getLanguage, t, applyTranslations };
})();

window.PabnaI18n = PabnaI18n;


