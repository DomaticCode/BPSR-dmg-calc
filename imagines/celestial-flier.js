(function(){

  // CF bonus arrays
  const CELESTIAL_FLIER_PASSIVE_HASTE_STAT = [8960, 11648, 14336, 17024, 19712, 22400];
  const CELESTIAL_FLIER_ACTIVE_HASTE_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'celestial-flier') return {};
    const level = state.level;

    const hasteStat = CELESTIAL_FLIER_PASSIVE_HASTE_STAT && state.applyPassiveStats
        ? CELESTIAL_FLIER_PASSIVE_HASTE_STAT[level]
        : 0;

    const hastePct = state.mode === 'active'
        ? (CELESTIAL_FLIER_ACTIVE_HASTE_PCT?.[level] || 0)
        : 0;

    return { hasteStat, hastePct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'celestial-flier') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1500, 1725, 1950, 2175, 2400, 2625];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Celestial Flier (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      150,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }

  window.IMAGINES['celestial-flier'] = { displayName: 'Celestial Flier', provideBonuses, provideSkills };
})();