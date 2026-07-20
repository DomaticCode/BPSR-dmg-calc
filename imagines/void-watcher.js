(function(){

  const VOID_WATCHER_ACTIVE = [7.5, 9, 10.5, 12, 13.5, 15];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'void-watcher') return {};
    const level = state.level;

    let matkPct = 0;
    if (state.mode === 'active') {
      matkPct = (VOID_WATCHER_ACTIVE && VOID_WATCHER_ACTIVE[level]) || 0;
    }

    return { matkPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'void-watcher') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [80, 104, 128, 152, 176, 200];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;
    const damageBoostPerStack = [20, 26, 32, 38, 44, 50];
    const damageBoost = 10 * damageBoostPerStack[level] || damageBoostPerStack[0];

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 190;
    const skillName = `Void Watcher (${level}) (passive)`;
    return [[
      'imagine(passive)',
      damageMultiplier,
      0,
      false,
      skillName,
      [
        ['damageType', 'magical'],
        ['otherScaler', damageBoost]
      ],
      hitsPerParse,
      0
    ]];
  }
  function provideFormulaParts(kind, state) {
    return;
  }
  window.IMAGINES['void-watcher'] = { displayName: 'Void Watcher', provideBonuses, provideFormulaParts, provideSkills };
})();